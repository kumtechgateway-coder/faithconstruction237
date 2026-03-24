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
|-- index.js
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
- The repository still includes an optional Firebase function entrypoint in the repository root (`index.js`) with its deployment metadata in `package.json`.

## Contact Methods

The live site currently uses direct contact methods on the contact page:

- Phone
- Email
- WhatsApp

If you later decide to re-enable a website contact form, the optional Firebase function `submitContactForm` is already in the repository.

Before deploying that optional function, configure the mail credentials:

```bash
firebase functions:config:set email.user="youraddress@gmail.com" email.pass="your-app-password"
```

You can inspect the saved config with:

```bash
firebase functions:config:get
```

## Deploy

Deploy hosting only:

```bash
firebase deploy --only hosting
```

Deploy functions only:

```bash
firebase deploy --only functions
```

Deploy both hosting and functions together:

```bash
firebase deploy --only hosting,functions
```

If PowerShell blocks `firebase` script execution, use `firebase.cmd` instead of `firebase`.
