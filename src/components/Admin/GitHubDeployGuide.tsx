import React, { useState } from 'react';
import { Github, Check, Copy, Terminal, ExternalLink, Sparkles, Globe } from 'lucide-react';

export const GitHubDeployGuide: React.FC = () => {
  const [copiedWorkflow, setCopiedWorkflow] = useState(false);
  const [copiedGitCmds, setCopiedGitCmds] = useState(false);

  const workflowYaml = `name: Deploy to GitHub Pages

on:
  push:
    branches: ["main"]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout repository
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Build production applet
        run: npm run build

      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: ./dist

  deploy:
    environment:
      name: github-pages
      url: \${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
`;

  const gitCommands = `# 1. Layihə qovluğunda Git başlat:
git init
git add .
git commit -m "İlk buraxılış: Fikir & Zəka portalı"

# 2. GitHub-da yaratdığınız yeni repozitoriyanı bağlayın:
git branch -M main
git remote add origin https://github.com/istifadeci-adiniz/fikir-ve-zeka.git

# 3. Kodu GitHub-a göndərin (Push):
git push -u origin main`;

  const copyToClipboard = (text: string, type: 'workflow' | 'git') => {
    try {
      navigator.clipboard.writeText(text);
      if (type === 'workflow') {
        setCopiedWorkflow(true);
        setTimeout(() => setCopiedWorkflow(false), 2500);
      } else {
        setCopiedGitCmds(true);
        setTimeout(() => setCopiedGitCmds(false), 2500);
      }
    } catch {
      // ignore
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Intro Banner */}
      <div className="p-4 sm:p-5 bg-stone-100 dark:bg-stone-950/70 rounded-xl border border-stone-200 dark:border-stone-800">
        <div className="flex items-center gap-2 mb-2 text-stone-900 dark:text-stone-100 font-bold text-base">
          <Github className="w-5 h-5 text-stone-900 dark:text-white" />
          <span>GitHub Pages Avtomatik Deploy (CI/CD) Təlimatı</span>
        </div>
        <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 leading-relaxed">
          Bu layihə tam statik veb arxitekturasına uyğundur. Layihəni GitHub-a göndərdiyiniz zaman avtomatik olaraq yığılır və pulsuz GitHub Pages ünvanında yayımlanır.
        </p>
      </div>

      {/* Step 1 */}
      <div className="p-4 bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-mono font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider">
            Addım 1: GitHub Action Workflow Faylını Yaradın
          </span>
          <button
            onClick={() => copyToClipboard(workflowYaml, 'workflow')}
            className="px-2.5 py-1 text-xs font-mono bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 rounded transition-colors flex items-center gap-1"
          >
            {copiedWorkflow ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedWorkflow ? 'Kopyalandı!' : 'YAML Kodu Kopyala'}</span>
          </button>
        </div>
        <p className="text-xs text-stone-500 dark:text-stone-400 mb-3">
          Layihənizin kökündə <code className="font-mono text-stone-800 dark:text-stone-200 bg-stone-100 dark:bg-stone-800 px-1 py-0.5 rounded">.github/workflows/deploy.yml</code> adlı fayl yaradın və bu konfiqurasiyanı yapışdırın:
        </p>
        <pre className="p-3 bg-stone-950 text-stone-200 font-mono text-[11px] rounded-lg overflow-x-auto max-h-56 leading-relaxed border border-stone-800">
          {workflowYaml}
        </pre>
      </div>

      {/* Step 2 */}
      <div className="p-4 bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-mono font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider">
            Addım 2: Terminal Əmrləri ilə GitHub-a Yükləmə
          </span>
          <button
            onClick={() => copyToClipboard(gitCommands, 'git')}
            className="px-2.5 py-1 text-xs font-mono bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 rounded transition-colors flex items-center gap-1"
          >
            {copiedGitCmds ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedGitCmds ? 'Kopyalandı!' : 'Əmrləri Kopyala'}</span>
          </button>
        </div>
        <pre className="p-3 bg-stone-950 text-stone-200 font-mono text-[11px] rounded-lg overflow-x-auto leading-relaxed border border-stone-800">
          {gitCommands}
        </pre>
      </div>

      {/* Step 3 */}
      <div className="p-4 bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800">
        <span className="text-xs font-mono font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider block mb-2">
          Addım 3: GitHub Repozitoriyasında Pages Mənbəyini Aktiv Edin
        </span>
        <ol className="space-y-2 text-xs text-stone-600 dark:text-stone-400 list-decimal list-inside leading-relaxed">
          <li>GitHub-da layihənizin səhifəsinə daxil olun: <strong>Settings &rarr; Pages</strong> bölməsinə keçin.</li>
          <li><strong>Build and deployment &rarr; Source</strong> menyusundan <strong>GitHub Actions</strong> seçimini seçin.</li>
          <li>Artıq hər dəfə <code>main</code> budağına kod göndərəndə (push) saytınız bir neçə saniyə içində avtomatik yenilənəcək!</li>
        </ol>
      </div>

    </div>
  );
};
