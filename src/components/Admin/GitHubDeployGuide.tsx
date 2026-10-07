import React, { useState } from 'react';
import { Github, Check, Copy, Terminal, ExternalLink, Sparkles, Globe, Rocket, Shield } from 'lucide-react';

export const GitHubDeployGuide: React.FC = () => {
  const [copiedWorkflow, setCopiedWorkflow] = useState(false);
  const [copiedDeployCmd, setCopiedDeployCmd] = useState(false);
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

      - name: Install dependencies
        run: npm ci

      - name: Build production site
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

  const copyToClipboard = (text: string, type: 'workflow' | 'deploy' | 'git') => {
    try {
      navigator.clipboard.writeText(text);
      if (type === 'workflow') {
        setCopiedWorkflow(true);
        setTimeout(() => setCopiedWorkflow(false), 2500);
      } else if (type === 'deploy') {
        setCopiedDeployCmd(true);
        setTimeout(() => setCopiedDeployCmd(false), 2500);
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
      
      {/* Universal Host Ready Notice */}
      <div className="p-4 sm:p-5 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl border border-emerald-200 dark:border-emerald-800">
        <div className="flex items-center gap-2 mb-2 text-emerald-900 dark:text-emerald-200 font-bold text-base">
          <Rocket className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
          <span>Bütün Hostinqlər Üçün Tam Hazırdır</span>
        </div>
        <p className="text-xs sm:text-sm text-emerald-800 dark:text-emerald-300 leading-relaxed">
          Saytın bütün JavaScript, CSS və media yolları nisbi (<code className="font-mono bg-white/70 dark:bg-black/40 px-1 py-0.5 rounded">base: './'</code>) konfiqurasiya edilib və <code className="font-mono bg-white/70 dark:bg-black/40 px-1 py-0.5 rounded">gh-pages</code>, <code className="font-mono bg-white/70 dark:bg-black/40 px-1 py-0.5 rounded">vercel.json</code>, <code className="font-mono bg-white/70 dark:bg-black/40 px-1 py-0.5 rounded">netlify.toml</code> inteqrasiya edilib.
        </p>
      </div>

      {/* Option 1: 1-Click NPM RUN DEPLOY */}
      <div className="p-4 bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-mono font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
            <Terminal className="w-4 h-4" /> Seçim 1: Tək Əmrlə Canlı Yayımlama (Ən Asan)
          </span>
          <button
            onClick={() => copyToClipboard('npm run deploy', 'deploy')}
            className="px-2.5 py-1 text-xs font-mono bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 rounded transition-colors flex items-center gap-1"
          >
            {copiedDeployCmd ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedDeployCmd ? 'Kopyalandı!' : 'Əmri Kopyala'}</span>
          </button>
        </div>
        <p className="text-xs text-stone-500 dark:text-stone-400 mb-2">
          Terminalda bu əmri işə salın:
        </p>
        <pre className="p-3 bg-stone-950 text-amber-300 font-mono text-sm rounded-lg border border-stone-800">
          npm run deploy
        </pre>
        <p className="text-[11px] text-stone-500 mt-2">
          Bu əmr layihəni avtomatik build edib GitHub-da <code className="font-mono text-stone-300">gh-pages</code> budağı açaraq saytınızı dərhal aktivləşdirir.
        </p>
      </div>

      {/* Option 2: GitHub Actions (CI/CD) */}
      <div className="p-4 bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-mono font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
            <Github className="w-4 h-4" /> Seçim 2: GitHub Actions ilə Avtomatik Deploy (CI/CD)
          </span>
          <button
            onClick={() => copyToClipboard(workflowYaml, 'workflow')}
            className="px-2.5 py-1 text-xs font-mono bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 rounded transition-colors flex items-center gap-1"
          >
            {copiedWorkflow ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedWorkflow ? 'Kopyalandı!' : 'YAML Kopyala'}</span>
          </button>
        </div>
        <p className="text-xs text-stone-500 dark:text-stone-400 mb-2">
          Layihədə <code className="font-mono text-stone-800 dark:text-stone-200 bg-stone-100 dark:bg-stone-800 px-1 py-0.5 rounded">.github/workflows/deploy.yml</code> faylı artıq mövcuddur. GitHub repozitoriyanızda:
        </p>
        <div className="text-xs text-stone-600 dark:text-stone-400 space-y-1 bg-stone-50 dark:bg-stone-950 p-3 rounded-lg border border-stone-200 dark:border-stone-800 font-mono">
          <p>1. GitHub &rarr; Settings &rarr; Pages bölməsinə keçin.</p>
          <p>2. Source: <strong>GitHub Actions</strong> seçin.</p>
          <p>3. Artıq hər 'git push' etdikdə saytınız avtomatik yenilənəcək!</p>
        </div>
      </div>

      {/* Option 3: Vercel & Netlify */}
      <div className="p-4 bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800">
        <span className="text-xs font-mono font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider flex items-center gap-1.5 mb-2">
          <Globe className="w-4 h-4" /> Seçim 3: Vercel / Netlify / Cloudflare Pages
        </span>
        <p className="text-xs text-stone-500 dark:text-stone-400 leading-relaxed">
          Layihədə <code className="font-mono text-stone-800 dark:text-stone-200 bg-stone-100 dark:bg-stone-800 px-1 py-0.5 rounded">vercel.json</code> və <code className="font-mono text-stone-800 dark:text-stone-200 bg-stone-100 dark:bg-stone-800 px-1 py-0.5 rounded">netlify.toml</code> faylları hazır olduğu üçün, layihəni Vercel və ya Netlify-a bağladığınızda heç bir əlavə parametr yazmadan 1 kliklə canlı yayımlanır.
        </p>
      </div>

    </div>
  );
};
