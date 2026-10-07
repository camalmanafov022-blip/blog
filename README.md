# Fikir & Zəka | Texnologiya və Şəxsi İnkişaf Portalı

Bu layihə müasir dizaynlı, yüksək performanslı rəqəmsal jurnal və bloq platformasıdır. Layihə React + Vite + Tailwind CSS arxitekturasında qurulub və bütün statik hostinqlərdə (GitHub Pages, Vercel, Netlify, Cloudflare Pages və s.) 100% problemsiz işləmək üçün tam optimallaşdırılıb.

---

## 🚀 Saytı Pulsuz Hostinqlərdə Yayımlamaq (Deploy)

### Metod 1: Tək Əmrlə GitHub Pages-ə Yayımlamaq (Ən Asan Yol)
Terminalda bu əmri işə salmağınız kifayətdir:
```bash
npm run deploy
```
Bu əmr layihəni avtomatik yığacaq və GitHub-da `gh-pages` budağı yaradaraq saytınızı dərhal canlı yayıma buraxacaq!

---

### Metod 2: GitHub Actions ilə Avtomatik Deploy (CI/CD)
1. Kodu GitHub repozitoriyanıza göndərin:
   ```bash
   git add .
   git commit -m "Deploy Fikir & Zeka"
   git push origin main
   ```
2. GitHub-da repozitoriyanızın **Settings** &rarr; **Pages** bölməsinə keçin.
3. **Build and deployment &rarr; Source** menyusundan **GitHub Actions** seçimini seçin.
4. `.github/workflows/deploy.yml` faylı saytınızı avtomatik yığıb yayımlayacaq.

---

### Metod 3: GitHub Pages "/docs" Qovluğu ilə Deploy
Layihə hər build zamanı hazır faylları `docs/` qovluğuna kopyalayır:
1. GitHub repozitoriyanızda **Settings** &rarr; **Pages** bölməsinə keçin.
2. **Source**: "Deploy from a branch" seçin.
3. **Branch**: `main` və qovluq olaraq `/docs` seçib **Save** düyməsinə basın.

---

### Metod 4: Vercel və ya Netlify (1 Kliklə)
- **Vercel**: Layihəyə `vercel.json` daxildir. [vercel.com](https://vercel.com) saytında repozitoriyanı seçib dərhal "Deploy" edə bilərsiniz.
- **Netlify**: Layihəyə `netlify.toml` daxildir. [netlify.com](https://netlify.com) saytında repozitoriyanı seçib dərhal "Deploy" edə bilərsiniz.

---

## 🔐 Admin Paneli Girişi
- Saytın yuxarı sağ küncündəki **Admin Panel** düyməsinə klikləyin.
- Standart PIN kod: `admin123`
