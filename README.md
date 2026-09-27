# WorkLanceo

Recruitment website, hiring planning tools, customer workspace and administration application.

This repository contains the React/Vinext application source and the GitHub Pages build source. It does not contain customer records, production databases or login secrets.

## Development

Requires Node.js 22.13 or later.

```sh
npm ci
npm run dev
```

```sh
npm run build
node scripts/build-github-pages.mjs
```

The second build creates static output in `work/pages-build`. GitHub Pages can serve this output but cannot run authentication or database APIs.

## Structure

- `app/`: pages, workspace, admin UI and server APIs.
- `app/chatgpt-auth.ts`: current ChatGPT Sites authentication integration.
- `app/admin-auth.ts`: server-side administrator authorization.
- `db/`: database schema and access helpers.
- `github-pages/`: static frontend entry points.
- `scripts/build-github-pages.mjs`: prerendered public-site build.
- `.openai/hosting.json`: existing Sites project and logical storage bindings.

## Deployment status

The public website currently runs at https://shambhavaa.com/worklanceo/. The existing backend runs on ChatGPT Sites. Shambhavaa and OrdinHR are separate brands and deployments.

The requested new domain is https://worklanceo.com. A hosting domain association has been created, but DNS verification and TLS activation have not yet been confirmed. Do not switch production links or redirects until the new domain is active.

Direct Google sign-in is not implemented or live. A Google OAuth client has been created separately; its credentials must remain outside this repository. Production still uses ChatGPT authentication. The Google callback needs updating for the final domain when the authentication backend is implemented. Existing record ownership must be preserved through an explicit migration.

## Secrets and access

Configure runtime secrets through the hosting provider. `.env.example` contains names and placeholders only. Never commit OAuth secrets, access tokens, downloaded credential JSON, customer exports, or database files. Keep authorization checks on the server.

This repository starts private and has no automatic deployment workflow. Creating it does not change the existing live websites.
