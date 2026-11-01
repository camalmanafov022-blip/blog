<?php
/**
 * Newsfy CMS - Self-Hosted Standalone Data API
 * Bu fayl istənilən standart web hostingdə (cPanel, Apache, Nginx, LiteSpeed, PHP 7.4 - 8.3+)
 * xəbərləri, videoları və parametrləri birbaşa öz serverinizdəki data.json faylında saxlayır.
 */

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

$dataFile = __DIR__ . '/data.json';

// Initial structure if data.json is missing
function getInitialData() {
    return [
        'articles' => [],
        'videos' => [],
        'subscribers' => ['camal@intellektual.az', 'oxucu@newsfy.az'],
        'settings' => [
            'pubId' => 'ca-pub-9847291847192841',
            'pin' => 'admin123'
        ],
        'updatedAt' => time()
    ];
}

// Load data from hosting
function loadData($file) {
    if (file_exists($file)) {
        $content = file_get_contents($file);
        $decoded = json_decode($content, true);
        if (is_array($decoded)) {
            return $decoded;
        }
    }
    return getInitialData();
}

// Save data to hosting
function saveData($file, $data) {
    $data['updatedAt'] = time();
    $json = json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    return file_put_contents($file, $json, LOCK_EX) !== false;
}

$action = isset($_GET['action']) ? $_GET['action'] : (isset($_POST['action']) ? $_POST['action'] : 'load');

// 1. GET / LOAD
if ($_SERVER['REQUEST_METHOD'] === 'GET' || $action === 'load') {
    $data = loadData($dataFile);
    echo json_encode([
        'success' => true,
        'storage' => 'self_hosted_server',
        'data' => $data
    ], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

// 2. POST OPERATIONS
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $raw = file_get_contents('php://input');
    $input = json_decode($raw, true);
    if (!is_array($input) && !empty($_POST)) {
        $input = $_POST;
    }

    $current = loadData($dataFile);

    // SAVE ALL / BACKUP RESTORE
    if ($action === 'save_all' || (isset($input['articles']) && isset($input['videos']))) {
        if (isset($input['articles'])) $current['articles'] = $input['articles'];
        if (isset($input['videos'])) $current['videos'] = $input['videos'];
        if (isset($input['subscribers'])) $current['subscribers'] = $input['subscribers'];
        if (isset($input['settings'])) $current['settings'] = $input['settings'];
        saveData($dataFile, $current);
        echo json_encode(['success' => true, 'message' => 'Bütün məlumatlar hostingdə yadda saxlanıldı']);
        exit;
    }

    // SAVE / UPDATE ARTICLE
    if ($action === 'save_article' && isset($input['article'])) {
        $art = $input['article'];
        $found = false;
        foreach ($current['articles'] as $k => $item) {
            if ($item['id'] === $art['id']) {
                $current['articles'][$k] = $art;
                $found = true;
                break;
            }
        }
        if (!$found) {
            array_unshift($current['articles'], $art);
        }
        saveData($dataFile, $current);
        echo json_encode(['success' => true, 'article' => $art]);
        exit;
    }

    // DELETE ARTICLE
    if ($action === 'delete_article' && isset($input['id'])) {
        $artId = $input['id'];
        $current['articles'] = array_values(array_filter($current['articles'], function($a) use ($artId) {
            return $a['id'] !== $artId;
        }));
        saveData($dataFile, $current);
        echo json_encode(['success' => true, 'id' => $artId]);
        exit;
    }

    // SAVE / UPDATE VIDEO
    if ($action === 'save_video' && isset($input['video'])) {
        $vid = $input['video'];
        $found = false;
        foreach ($current['videos'] as $k => $item) {
            if ($item['id'] === $vid['id']) {
                $current['videos'][$k] = $vid;
                $found = true;
                break;
            }
        }
        if (!$found) {
            array_unshift($current['videos'], $vid);
        }
        saveData($dataFile, $current);
        echo json_encode(['success' => true, 'video' => $vid]);
        exit;
    }

    // DELETE VIDEO
    if ($action === 'delete_video' && isset($input['id'])) {
        $vidId = $input['id'];
        $current['videos'] = array_values(array_filter($current['videos'], function($v) use ($vidId) {
            return $v['id'] !== $vidId;
        }));
        saveData($dataFile, $current);
        echo json_encode(['success' => true, 'id' => $vidId]);
        exit;
    }

    // LIKE VIDEO
    if ($action === 'like_video' && isset($input['id'])) {
        $vidId = $input['id'];
        $delta = isset($input['delta']) ? (int)$input['delta'] : 1;
        foreach ($current['videos'] as $k => $v) {
            if ($v['id'] === $vidId) {
                $current['videos'][$k]['likes'] = max(0, (isset($v['likes']) ? $v['likes'] : 0) + $delta);
                break;
            }
        }
        saveData($dataFile, $current);
        echo json_encode(['success' => true]);
        exit;
    }

    echo json_encode(['success' => false, 'error' => 'Əməliyyat tapılmadı']);
    exit;
}
