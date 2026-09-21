# KaamSetu

A recruitment and workforce website based on research into TeamLease, Quess, AxureOne, CIEL HR, Randstad India, Adecco India, WorkIndia, Apna, Job Hai and Taskmo.

## Included
- Responsive home, service catalogue, sample jobs, employer intake, resources, tools, workspace, about, privacy and terms pages.
- Filterable sample roles with salary, skills, shifts, experience and education.
- Authenticated, account-scoped hiring briefs, candidate profiles and onboarding checklists in D1.
- Private PDF résumé uploads to R2, with owner-scoped downloads and attached-document deletion.
- Editable recruitment fee, workforce budget and shift coverage calculators.
- Downloadable hiring brief, estimate and checklist; exportable workspace records.
- Native Sites/ChatGPT sign-in, server-side validation, same-origin writes and prepared queries.
- Progressive WebMCP catalogue-search tool when supported by the browser.

## Operating boundaries
KaamSetu is a working brand. Jobs and salary ranges are illustrative, not live vacancies. Saved records remain private to the signed-in user; they are not dispatched to a recruiter or employer. No client metrics, testimonials, affiliations or hiring guarantees are claimed. Payroll, statutory filing, background verification, messaging, job-board syndication and payment systems are not integrated.

Before a public commercial launch, configure legal company information, domain/contact details, approved service contracts and privacy/retention policies; import real vacancies; define recruiter and employer access roles; connect operational notifications and payroll/compliance providers as required.

## Development
- Install: `npm ci`
- Preview: `npm run dev`
- Build: `npm run build`
- Type check: `npx tsc --noEmit`
- Database schema: `db/schema.ts`; migration: `drizzle/0000_fair_mongoose.sql`.
- Local D1: `node --import ./scripts/sites-env.mjs ./node_modules/wrangler/bin/wrangler.js d1 execute DB --local --config dist/server/wrangler.json --persist-to .wrangler/state --file drizzle/0000_fair_mongoose.sql`

Deployment uses the Site ID already saved in `.openai/hosting.json`; do not create another Site. Keep authentication credentials and local runtime data out of version control.

## Sources
All ten source links and the photo credit are available on `/resources`.
Photo: EqualStock IN, Pexels, https://www.pexels.com/photo/indian-textile-workers-in-factory-setting-32399720/ (Pexels licence).
