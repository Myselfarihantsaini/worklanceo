import { NextResponse } from 'next/server';
import { env } from 'cloudflare:workers';

export const runtime = 'edge';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const requestedReturnTo = url.searchParams.get('return_to') || '/';
  const returnTo = requestedReturnTo.startsWith('/') && !requestedReturnTo.startsWith('//')
    ? requestedReturnTo
    : '/';

  const clientId = env.GOOGLE_CLIENT_ID;
  if (!clientId) {
    return NextResponse.json({ error: 'Google sign-in is not configured.' }, { status: 503 });
  }

  const redirectUri = new URL('/api/auth/callback/google', request.url).toString();

  const state = encodeURIComponent(JSON.stringify({ returnTo }));

  const authUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');
  authUrl.searchParams.set('client_id', clientId);
  authUrl.searchParams.set('redirect_uri', redirectUri);
  authUrl.searchParams.set('response_type', 'code');
  authUrl.searchParams.set('scope', 'openid email profile');
  authUrl.searchParams.set('state', state);
  if (returnTo.startsWith('/admin')) {
    authUrl.searchParams.set('prompt', 'select_account');
  }

  return NextResponse.redirect(authUrl);
}
