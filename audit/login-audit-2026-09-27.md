# WorkLanceo login audit

Date: 2026-09-27

Scope: signed-out workspace, Google OAuth entry/callback, session cookie verification, sign-out, and admin entry.

## Verdict

Login is not release-ready. The live local flow is blocked by a Google `redirect_uri_mismatch`, and the authentication implementation contains critical secret-management and session-integrity failures.

## Flow evidence

1. Workspace signed-out state — healthy presentation, blocked journey.
   - The page explains why an account is needed and exposes one clear sign-in action.
   - The action says only “Sign in”; it does not identify Google or set expectations about leaving WorkLanceo.

2. Google authorization redirect — failed.
   - Following `/signin-with-google?return_to=%2Fworkspace` reaches Google's `Error 400: redirect_uri_mismatch` screen.
   - The request uses `https://localhost:5173/api/auth/callback/google`, created by replacing `http://` with `https://` in code.

3. OAuth callback and error recovery — unhealthy.
   - Missing authorization codes and failed token exchanges redirect silently to `/`.
   - OAuth errors are not carried back to a WorkLanceo error state, so users receive no explanation or retry path.

4. Session verification — critically unsafe when configuration is absent.
   - The current runtime accepted a forged JWT signed with the source-code fallback key and returned an authenticated user from `/api/session`.

5. Sign-out — unsafe redirect behavior.
   - `/signout-with-google?return_to=https://example.com/` returned a redirect to the external origin.
   - Sign-out is a state-changing GET request, so another site can log a user out.

6. Admin entry — functional layout, misleading copy.
   - The screen says to use the owner’s “ChatGPT account,” but the implementation sends users to Google OAuth.
   - It has a clear back path and a single admin sign-in action.

## Findings

### Critical

1. A Google OAuth client secret is hard-coded in the callback source. Treat it as exposed: revoke/rotate it immediately, remove it from source/history where appropriate, and require a deployment secret.

2. The session signing secret has a public fallback. The current runtime was proven forgeable. Remove the fallback and fail startup/request handling closed when `SESSION_SECRET` is unavailable.

### High

3. Google ID tokens are decoded without cryptographic verification. Verify signature, issuer, audience, expiry, subject, and `email_verified` with Google's supported verifier/JWKS.

4. OAuth `state` is only URL-encoded JSON. It is neither random nor tied to a browser cookie, and there is no nonce/PKCE protection. This leaves the flow open to login CSRF/session swapping and state tampering.

5. `return_to` is accepted raw by the sign-in, callback, and sign-out routes. The sign-out open redirect is directly confirmed; the callback can perform the same redirect after a successful code exchange. Reuse one strict same-origin relative-path validator at every boundary.

6. Redirect URI construction is brittle. The forced HTTPS replacement breaks local login and can diverge behind proxies or alternate hosts. Use an explicit, allowlisted public auth origin and register exact development/production callbacks in Google Cloud.

### Medium

7. OAuth failures are silent. Handle `error`, `error_description`, missing code, and token exchange failures on a first-party error page with retry/back actions and a non-sensitive support reference.

8. Naming is inconsistent: internal types and admin copy say ChatGPT while the provider is Google. This weakens trust at the most sensitive step.

9. Sessions last 30 days with no visible revocation/version strategy. Add a shorter idle/absolute lifetime or server-side session versioning for sensitive/admin access.

10. Configuration is undocumented. `.env.example` contains only `ADMIN_EMAIL`; it omits Google credentials, the session secret, and the canonical auth origin/callback setup.

### Engineering gaps

11. `npm run build` succeeds, but `npx tsc --noEmit` fails in the authentication routes and other app code. The build does not provide type-safety assurance.

12. The repository-wide lint command includes generated `build/` output and reports 1,143 problems. Scoping lint to app source still reports 83 problems. This makes meaningful auth regressions easier to miss.

13. No automated authentication tests were found. Add coverage for callback allowlists, state/nonce validation, invalid/expired tokens, missing secrets, cookie attributes, logout CSRF, provider cancellation, and admin authorization.

## Recommended order

1. Rotate the exposed Google secret and remove all secret fallbacks.
2. Fail closed when required authentication configuration is missing.
3. Replace the callback with verified Google OIDC handling plus random state, nonce, and preferably PKCE.
4. Centralize and enforce same-origin return-path validation.
5. Configure exact local and production redirect URIs.
6. Add a first-party error/retry screen and correct Google/ChatGPT copy.
7. Gate releases on typecheck, scoped lint, and authentication integration tests.

## Evidence limits

The Google error prevented completion of a legitimate signed-in flow, so authenticated workspace/admin UI behavior and assistive-technology behavior after login were not fully testable. Production could not be opened from the audit browser because the domain did not resolve in that environment; no claim is made about production availability from that signal alone.
