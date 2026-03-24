# FAITH Construction Website

## Project Structure

```text
faithconstruction237/
|-- public/
|   |-- index.html
|   |-- about.html
|   |-- contact.html
|   |-- services.html
|   |-- projects.html
|   |-- project-detail.html
|   |-- privacy-policy.html
|   |-- cookie-policy.html
|   |-- terms-of-service.html
|   |-- robots.txt
|   |-- sitemap.xml
|   `-- assets/
|       |-- css/
|       |   `-- style.css
|       |-- js/
|       |   |-- navbar.js
|       |   |-- app-footer.js
|       |   `-- script.js
|       |-- data/
|       |   |-- data.json
|       |   `-- reviews.json
|       `-- images/
|-- firebase.json
`-- package.json
```

## Maintenance Rules

- Keep all website pages under `public/`.
- Keep shared assets under `public/assets/`.
- Use absolute asset paths in pages and scripts, for example:
  - `/assets/css/style.css`
  - `/assets/js/script.js`
  - `/assets/data/data.json`
  - `/assets/images/logo.png`

## Contact Methods

The live site currently uses direct contact methods on the contact page:

- Phone
- Email
- WhatsApp

## Deploy

Deploy hosting only:

```bash
firebase deploy --only hosting
```

If PowerShell blocks `firebase` script execution, use `firebase.cmd` instead of `firebase`.
