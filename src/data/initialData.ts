import { Article, VideoItem, Subscriber, AdSettings, SiteSettings } from '../types';

// Real generated assets
import heroTechFuture from '../assets/images/hero_tech_future_editorial_1791379853527.jpg';
import personalGrowthImg from '../assets/images/personal_growth_mindset_1791379868267.jpg';
import deepWorkImg from '../assets/images/deep_work_focus_1791379878735.jpg';
import aiQuantumImg from '../assets/images/ai_quantum_computing_1791379889159.jpg';

export const INITIAL_SITE_SETTINGS: SiteSettings = {
  siteName: 'Fikir & Zəka',
  siteTagline: 'Müasir Düşüncə, Texnologiya və Şəxsi İnkişaf Jurnalı',
  siteDescription: 'Dərin təhlillər, texnoloji trendlər, şəxsi inkişaf fəlsəfəsi və maraqlı video icmallar.',
  adminPin: 'admin123',
  socialLinks: {
    twitter: 'https://twitter.com',
    linkedin: 'https://linkedin.com',
    youtube: 'https://youtube.com',
    telegram: 'https://t.me',
    github: 'https://github.com',
  },
};

export const INITIAL_AD_SETTINGS: AdSettings = {
  enabled: true,
  showSimulationBanner: true,
  adSensePublisherId: 'ca-pub-9847291847192841',
  headerSlotId: '1092837465',
  articleSlotId: '5647382910',
  sidebarSlotId: '9876543210',
  footerSlotId: '2468135790',
  customBannerText: 'Google Reklam Alanı (Google AdSense)',
};

export const INITIAL_ARTICLES: Article[] = [
  {
    id: 'art-1',
    title: 'Süni İntellekt Dövründə İnsan Ağlının Üstünlüyü: Dərin Düşünmə Qabiliyyəti',
    slug: 'suni-intellekt-dovrunde-insan-aglinin-ustunluyu',
    category: 'texnologiya',
    excerpt: 'Generativ süni intellekt modelləri hər gün daha da təkmilləşir. Bəs bu dövrdə insanın əsas rəqabət üstünlüyü nə olacaq? Dərin təhlil və gələcəyə baxış.',
    content: `Süni intellekt və avtomatlaşdırma artıq sadəcə texnoloji şirkətlərin deyil, bütün cəmiyyətin həyat tərzini yenidən formalaşdırır. Hər kəsin eyni məlumat bazasına və süni intellekt alətlərinə çıxışı olduğu bir dünyada informasiyanın özü deyil, onu necə sintez etdiyimiz və hansı sualları verdiyimiz ön plana çıxır.

### Dərin Düşünmənin (Deep Work) Qiyməti

Müasir dövrdə diqqət ən nadir və ən bahalı resursa çevrilib. Sosial şəbəkələrin davamlı bildirişləri və qısa məzmun formatları (short-form content) insan beynini fraqmentlərə bölür. Lakin mürəkkəb problemləri həll etmək üçün dərin fokuslanma tələb olunur.

> "Gələcəkdə iki növ insan olacaq: texnologiyanın diqqətini idarə etdiyi insanlar və diqqətinə sahib çıxaraq texnologiyanı idarə edən insanlar."

### Gələcəkdə Əvəzolunmaz Olacaq 3 Əsas Bacarıq

1. **Tənqidi və Fəlsəfi Təhlil**: Verilən cavabları deyil, problemin kökünü sorğulamaq.
2. **Emosional İntellekt və Empatiya**: İnsanlararası dərin etimad yaratmaq və komanda ruhunu qorumaq.
3. **Fənlərarası Sintez**: Texnologiya ilə fəlsəfəni, dizayn ilə psixologiyanı birləşdirmək.

Nəticə etibarilə, süni intellekt insanı əvəz etməyəcək; süni intellektdən şüurlu istifadə edən və strateji düşünən insanlar köhnə üsullarla işləyənləri geridə qoyacaq.`,
    coverImage: heroTechFuture,
    readTimeMinutes: 6,
    author: {
      name: 'Camal Mənafov',
      role: 'Təsisçi & Baş Redaktor',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      bio: 'Texnologiya, şəxsi inkişaf və rəqəmsal transformasiya üzrə müəllif.',
    },
    publishedAt: '2026-10-05',
    views: 1420,
    likes: 89,
    tags: ['Süni İntellekt', 'Gələcək', 'Dərin Düşüncə', 'Texnologiya'],
    featured: true,
    trending: true,
    isPersonalBlog: false,
  },
  {
    id: 'art-2',
    title: 'Şəxsi İntizam və Vərdişlər: 1% Qaydasının Həyatımıza Təsiri',
    slug: 'sexsi-intizam-ve-verdisler-1-faiz-qaydasi',
    category: 'sexsi-inkisaf',
    excerpt: 'Hər gün sadəcə 1 faiz daha yaxşı olmaq bir ildə insanı necə 37 qat daha güclü edir? Vərdişlərin atomar gücü və psixoloji mexanizmi.',
    content: `Böyük hədəflərə çatmaq istəyəndə əksər insanlar dərhal radikal dəyişikliklər etməyə çalışırlar. Bir gecədə 5 saat idman etmək, bütün qidalanmanı dəyişmək və ya birdən-birə kitab yazmağa başlamaq. Lakin psixologiya sübut edir ki, bu cür kəskin addımlar tez bir zamanda tükənmə ilə nəticələnir.

### Vərdişlərin Mürəkkəb Faiz Qaydası

Əgər siz hər gün sadəcə 1% daha yaxşılaşsanız, riyazi olaraq bir ilin sonunda (1.01^365) başlanğıc vəziyyətinizdən təxminən **37 qat** daha irəli gedəcəksiniz.

### Dayanıqlı Vərdiş Sistemi Necə Qurulur?

- **Tətikləyici Müəyyənləşdirin**: Yeni vərdişi artıq mövcud olan bir vərdişə bağlayın (məsələn: "Hər səhər qəhvə içdikdən sonra 10 səhifə oxuyacağam").
- **Giriş Baryerini Azaldın**: İdman paltarınızı axşamdan hazır qoyun, oxuyacağınız kitabı masanın mərkəzinə yerləşdirin.
- **2 Dəqiqə Qaydası**: Hər yeni vərdişə başlayarkən onu 2 dəqiqə ərzində icra ediləcək qədər sadələşdirin.

> "Biz vərdişlərimizin məhsuluyuq. Uğur təsadüfi böyük qələbələrdən deyil, gündəlik kiçik seçimlərimizin ardıcıllığından doğur."`,
    coverImage: personalGrowthImg,
    readTimeMinutes: 5,
    author: {
      name: 'Camal Mənafov',
      role: 'Təsisçi & Baş Redaktor',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      bio: 'Texnologiya, şəxsi inkişaf və rəqəmsal transformasiya üzrə müəllif.',
    },
    publishedAt: '2026-10-04',
    views: 980,
    likes: 64,
    tags: ['Şəxsi İnkişaf', 'Vərdişlər', 'Məhsuldarlıq', 'Psixologiya'],
    featured: true,
    trending: true,
    isPersonalBlog: false,
  },
  {
    id: 'art-3',
    title: 'Dərin İş (Deep Work): Diqqət Dağınıqlığı Əsrində Fokuslanma Sənəti',
    slug: 'derin-is-diqqet-daginiqligi-esrinde-fokuslanma',
    category: 'mehsuldarliq',
    excerpt: 'Hər 5 dəqiqədən bir telefona baxmaq vərdişi beynimizin strukturunu necə dəyişir və bunu aradan qaldırmaq üçün hansı rəqəmsal detoks metodları var?',
    content: `Bugünkü rəqəmsal mühitdə ən böyük rəqibimiz rəqib şirkətlər deyil, cibimizdə gəzdirdiyimiz və bizi daimi dopamin asılılığında saxlayan cihazlardır.

### Dayaz İş vs Dərin İş

Kal Nyuportun ifadə etdiyi kimi, işlərimizi iki qrupa ayıra bilərik:
1. **Dayaz İş (Shallow Work)**: E-poçtları cavablandırmaq, mesajlara baxmaq, inzibati xırdalıqlar. Dəyər yaratmır, amma çox vaxt aparır.
2. **Dərin İş (Deep Work)**: Beyni tam gərginliklə işlədən, nadir və dəyərli nəticələr hasil edən diqqətli fəaliyyət.

### Praktik Tətbiq Üsulları

- **Fokus Blokları**: Gününüzdə minimum 90 dəqiqəlik qəti toxunulmaz vaxt bloku yaradın.
- **Rəqəmsal Sərhədlər**: İş masanızda telefonunuzu görməyəcəyiniz məsafədə saxlayın.
- **Tək Tapşırıq Rejimi (Single-Tasking)**: Eyni anda bir neçə iş görmək (multitasking) illüziyadır; beyin sadəcə enerjisini sürətlə tükəndirir.`,
    coverImage: deepWorkImg,
    readTimeMinutes: 4,
    author: {
      name: 'Nigar Rəhimova',
      role: 'Koqnitiv Psixoloq & Tədqiqatçı',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
      bio: 'İnsan davranışı, beyin funksiyaları və məhsuldarlıq elmi üzrə mütəxəssis.',
    },
    publishedAt: '2026-10-02',
    views: 740,
    likes: 48,
    tags: ['Məhsuldarlıq', 'Fokus', 'Dərin İş', 'Zaman İdarəetməsi'],
    featured: false,
    trending: true,
    isPersonalBlog: false,
  },
  {
    id: 'art-4',
    title: 'Kvant Hesablamaları və 2030-cu İllərin Texnoloji Sıçrayışı',
    slug: 'kvant-hesablamalari-ve-texnoloji-sicrayis',
    category: 'innovasiya',
    excerpt: 'Kvant bitləri (kübitlər), superpozisiya və dolaşıqlıq prinsipləri mövcud kriptoqrafiyanı və dərman kəşflərini necə kökündən dəyişəcək?',
    content: `Klassik kompüterlər məlumatı 0 və ya 1 şəklində emal etdiyi halda, kvant kompüterləri eyni anda həm 0, həm də 1 ola bilən kübitlərdən istifadə edir. Bu, indiyə qədər həll edilməsi min illər aparan riyazi hesablamaların saniyələr içində bitməsi deməkdir.

### Kvant Texnologiyalarının Əsas Tətbiq Sahələri

- **Yeni Molekulların Modelləşdirilməsi**: Xərçəng və digər mürəkkəb xəstəliklər üçün fərdiləşdirilmiş dərman formulalarının kəşfi.
- **Enerji Saxlama və Batareyalar**: Qrafen və yeni materialların kvant səviyyəsində simulyasiyası ilə günlərlə şarj tələb etməyən batareyalar.
- **Kibermühafizə və Post-Kvant Kriptoqrafiya**: Mövcud şifrələmə protokollarının yenidən yazılması zərurəti.`,
    coverImage: aiQuantumImg,
    readTimeMinutes: 7,
    author: {
      name: 'Elvin Qasımov',
      role: 'Kvant Mühəndisi & Fizik',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      bio: 'Yeni nəsil hesablama sistemləri və nanotexnologiyalar üzrə elmi işçi.',
    },
    publishedAt: '2026-09-28',
    views: 610,
    likes: 39,
    tags: ['Kvant', 'Fizika', 'Gələcək', 'Kriptoqrafiya'],
    featured: false,
    trending: false,
    isPersonalBlog: false,
  },
  {
    id: 'art-5',
    title: 'Şəxsi Qeydlər: Həyatı Məqsədyönlü Yaşamaq və Stoitsizm Təlimi',
    slug: 'sexsi-qeydler-heyati-meqsedyonlu-yasamaq-stoitsizm',
    category: 'bloq',
    excerpt: 'Gündəlik qeydlərimdən: Nəzarət edə biləcəyimiz şeylərə fokuslanmaq və daxili sakitliyi qorumağın qədim fəlsəfi açarları.',
    content: `Hər səhər masamın arxasına keçəndə özümə xatırlatdığım tək bir prinsip var: "Həyatda baş verən hadisələr deyil, bizim onlara verdiyimiz məna bizi narahat edir." - Epiktet.

### Nəzarət Dairəsi (Dichotomy of Control)

Biz xarici hadisələri, digər insanların reaksiyalarını və ya iqtisadi dalğalanmaları idarə edə bilmərik. Amma nəyi idarə edə bilərik?
- Öz düşüncələrimizi
- Öz reaksiyalarımızı
- Öz zəhmətimizi və dürüstlüyümüzü

Bu fərqi aydın dərk etdiyiniz an, gərəksiz təlaş və narahatlıq yerini daxili qətiyyətə verir. Şəxsi bloqumda bu mövzunu davamlı araşdırmağa və təcrübələrimi bölüşməyə davam edəcəyəm.`,
    coverImage: personalGrowthImg,
    readTimeMinutes: 3,
    author: {
      name: 'Camal Mənafov',
      role: 'Təsisçi & Müəllif',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      bio: 'Şəxsi müşahidələr, gündəlik qeydlər və fəlsəfi düşüncələr.',
    },
    publishedAt: '2026-10-06',
    views: 430,
    likes: 51,
    tags: ['Stoitsizm', 'Şəxsi Bloq', 'Fəlsəfə', 'Həyat Tərzi'],
    featured: false,
    trending: false,
    isPersonalBlog: true,
  },
];

export const INITIAL_VIDEOS: VideoItem[] = [
  {
    id: 'vid-1',
    title: 'Beynimizin Diqqət Mexanizmi və Dopamin Detoksu Necə İşləyir?',
    description: 'Rəqəmsal cihazların yaratdığı dopamin dalğalanmaları, fokuslanma çətinliyi və 7 günlük bərpa proqramı haqqında elmi təhlil.',
    youtubeId: 'p3JLaF_4Tz8',
    duration: '14:25',
    category: 'sexsi-inkisaf',
    speaker: 'Dr. Endryu Huberman təhlili',
    thumbnail: deepWorkImg,
    publishedAt: '2026-10-01',
    keyTakeaways: [
      'Dopamin baza səviyyəsini qorumaq iradəni gücləndirir.',
      'Səhər oyandıqdan sonrakı ilk 60 dəqiqə ekranlardan uzaq durmaq zəruridir.',
      'Dərin yuxu və təbii günəş işığı zehni bərpanın təməlidir.',
    ],
  },
  {
    id: 'vid-2',
    title: 'Gələcəyin Süni İntellekt Trendləri: AGI Nə Vaxt Reallığa Çevriləcək?',
    description: 'Böyük dil modellərindən avtonom agentlərə və ümumi süni intellektə (AGI) doğru inkişaf yolu.',
    youtubeId: '7xTGNNLPyMI',
    duration: '18:50',
    category: 'texnologiya',
    speaker: 'Sam Altman & Demis Hassabis müzakirəsi',
    thumbnail: heroTechFuture,
    publishedAt: '2026-09-25',
    keyTakeaways: [
      'Multi-modal intellekt və robototexnika birləşməsi sürətlənir.',
      'Təhsil sistemi əzbərçilikdən problem həlletmə qabiliyyətinə keçməlidir.',
      'İntellektin dəyəri ucuzlaşdıqca unikal baxış bucağı bahalaşır.',
    ],
  },
  {
    id: 'vid-3',
    title: 'Atomar Vərdişlər: Hər Gün 1% İnkişafın Psixologiyası',
    description: 'Ceyms Klirin məşhur metodologiyası əsasında vərdiş yaratma və pis vərdişləri sındırma addımları.',
    youtubeId: 'U_nzqnXWvSo',
    duration: '11:10',
    category: 'mehsuldarliq',
    speaker: 'Ceyms Klir təhlili',
    thumbnail: personalGrowthImg,
    publishedAt: '2026-09-18',
    keyTakeaways: [
      'Məqsədlər deyil, qurduğunuz sistemlər nəticəni təyin edir.',
      'Şəxsiyyət yönümlü vərdişlər daha uzunömürlü olur.',
      'Kiçik addımlar zamanla böyük fərqlər yaradır.',
    ],
  },
];

export const INITIAL_SUBSCRIBERS: Subscriber[] = [
  {
    id: 'sub-1',
    email: 'oxucu@intellektual.az',
    frequency: 'weekly',
    subscribedAt: '2026-10-01',
    status: 'active',
  },
  {
    id: 'sub-2',
    email: 'texno.azerbaycan@gmail.com',
    frequency: 'breaking',
    subscribedAt: '2026-10-03',
    status: 'active',
  },
  {
    id: 'sub-3',
    email: 'inkisaf.felsefe@mail.ru',
    frequency: 'all',
    subscribedAt: '2026-10-05',
    status: 'active',
  },
];
