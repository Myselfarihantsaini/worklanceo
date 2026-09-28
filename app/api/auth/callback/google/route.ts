import { NextResponse } from 'next/server';
import { createRemoteJWKSet, jwtVerify, SignJWT } from 'jose';
import { env } from 'cloudflare:workers';

export const runtime = 'edge';
const googleKeys = createRemoteJWKSet(new URL('https://www.googleapis.com/oauth2/v3/certs'));

function safeReturnPath(value: unknown) {
  return typeof value === 'string' && value.startsWith('/') && !value.startsWith('//')
    ? value
    : '/';
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get('code');
  const state = url.searchParams.get('state');

  if (!code) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // Parse state for return_to
  let returnTo = '/';
  if (state) {
    try {
      const parsed = JSON.parse(decodeURIComponent(state));
      returnTo = safeReturnPath(parsed.returnTo);
    } catch {}
  }

  const clientId = env.GOOGLE_CLIENT_ID;
  const clientSecret = env.GOOGLE_CLIENT_SECRET;
  if (!clientId || !clientSecret) {
    return NextResponse.json({ error: 'Google sign-in is not configured.' }, { status: 503 });
  }

  const redirectUri = new URL('/api/auth/callback/google', request.url).toString();

  const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      code,
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: redirectUri,
      grant_type: 'authorization_code',
    }),
  });

  const tokens = await tokenResponse.json() as { id_token?: string };

  if (!tokens.id_token) {
    console.error('Google token exchange failed:', tokenResponse.status);
    return NextResponse.redirect(new URL('/', request.url));
  }

  let payload;
  try {
    ({ payload } = await jwtVerify(tokens.id_token, googleKeys, {
      audience: clientId,
      issuer: ['https://accounts.google.com', 'accounts.google.com'],
    }));
  } catch (error) {
    console.error('Google ID token verification failed:', error);
    return NextResponse.redirect(new URL('/?auth_error=invalid_google_token', request.url));
  }

  if (!payload.sub || typeof payload.email !== 'string' || payload.email_verified !== true) {
    return NextResponse.redirect(new URL('/?auth_error=unverified_google_email', request.url));
  }

  const user = {
    userId: String(payload.sub),
    email: payload.email,
    displayName: typeof payload.name === 'string' ? payload.name : payload.email,
    fullName: typeof payload.name === 'string' ? payload.name : null,
  };

  if (returnTo.startsWith('/admin')) {
    const allowedAdmin = env.ADMIN_EMAIL?.trim().toLowerCase();
    if (!allowedAdmin || user.email.toLowerCase() !== allowedAdmin) {
      const denied = NextResponse.redirect(new URL('/admin?auth_error=unauthorized', request.url));
      denied.cookies.set('worklanceo_session', '', { path: '/', maxAge: 0 });
      return denied;
    }
  }

  if (!env.SESSION_SECRET) {
    return NextResponse.json({ error: 'Session signing is not configured.' }, { status: 503 });
  }
  const secretKey = new TextEncoder().encode(env.SESSION_SECRET);
  const jwt = await new SignJWT(user)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('30d')
    .sign(secretKey);

  const response = NextResponse.redirect(new URL(returnTo, request.url));
  
  response.cookies.set({
    name: 'worklanceo_session',
    value: jwt,
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 30 * 24 * 60 * 60,
  });

  return response;
}
