import { NextResponse } from 'next/server';

export const runtime = 'edge';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const returnTo = url.searchParams.get('return_to') || '/';

  const response = NextResponse.redirect(new URL(returnTo, request.url));
  
  response.cookies.delete('worklanceo_session');

  return response;
}
