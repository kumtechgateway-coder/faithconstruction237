# FAITH Construction Website

## Project Structure

```
faithconstruction237/
├─ public/
│  ├─ index.html
│  ├─ about.html
│  ├─ contact.html
│  ├─ services.html
│  ├─ projects.html
│  ├─ project-detail.html
│  ├─ privacy-policy.html
│  ├─ cookie-policy.html
│  ├─ terms-of-service.html
│  ├─ robots.txt
│  ├─ sitemap.xml
│  └─ assets/
│     ├─ css/
│     │  └─ style.css
│     ├─ js/
│     │  ├─ navbar.js
│     │  ├─ app-footer.js
│     │  └─ script.js
│     ├─ data/
│     │  ├─ data.json
│     │  └─ reviews.json
│     └─ images/
├─ firebase.json
├─ index.js
└─ package.json
```

## Maintenance Rules

- Keep all website files under `public/`.
- Keep shared static files under `public/assets/`.
- Use absolute asset paths in pages and scripts, for example:
  - `/assets/css/style.css`
  - `/assets/js/script.js`
  - `/assets/data/data.json`
  - `/assets/images/logo.png`
- Keep backend function files (`index.js`, `package.json`) at repository root.

## Deploy

```bash
firebase deploy --only hosting
```

If PowerShell blocks `firebase` script execution, use:

```bash
firebase.cmd deploy --only hosting
```
