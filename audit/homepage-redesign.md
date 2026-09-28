# Homepage redesign implementation

## New files
- app/homepage.tsx: Navbar, Hero, HeroWorkforceCollage, StatsBar, industry grid, process, solutions, reasons to hire, employer CTA, HiringRequirementForm, candidate CTA, FAQ and Footer.
- app/homepage.css: scoped responsive styles and reduced-motion treatment.
- public/workforce-collage.webp: generated illustrative multi-profession image, ~100 KB.
- design-qa.md: explicit verification status and remaining visual checks.

## Modified
- app/site.tsx: integrates new homepage/shared navigation/footer, exposes existing candidate form, updates all-sector about positioning.
- app/[section]/page.tsx: enables /candidates; existing routes preserved.
- app/page.tsx and app/layout.tsx: homepage metadata and EmploymentAgency JSON-LD.
- cloudflare-env.d.ts and Google callback: missing existing environment type declarations, typed response, avoids logging token response.
- legacy github-pages files/build script: old builder-service links replaced with worklanceo.com. No Shambhavaa site changes.

## Functionality
Existing Google authentication, session cookie, account-scoped records, résumé uploads, administrator routes, calculator and existing hiring form are retained. The homepage employer form submits to the existing authenticated /api/records endpoint, including all server-required fields. Signed-out form drafts stay in session storage through Google continuation. Success appears only after an accepted API response. /candidates uses the existing application/profile form and backend. No real test leads submitted.

## Content and limitations
No fabricated customer totals, ratings or improvement percentages are published. companyMetrics is an editable unpublished configuration until verified. Workforce imagery and hiring pipeline cards are illustrative. No backend migration is required for the homepage form. A real-account OAuth and end-to-end notification/storage smoke test is still needed; secrets and production records were not inspected or changed. Browser QA is pending permission, as detailed in design-qa.md.

## Domain
All current app navigation is root-relative on worklanceo.com. The old Shambhavaa WorkLanceo banner is absent. The separately requested payroll referral remains a distinct external service. This implementation has not been published while visual QA is blocked.
