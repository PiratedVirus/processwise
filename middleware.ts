// app/middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(req: NextRequest) {
  console.log(`Request received for path: ${req.nextUrl.pathname}`);

  const session = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  if (session) {
    // console.log('User is authenticated');
  } else {
    console.log('User is not authenticated');
  }

  // Paths that don't require authentication
  const publicPaths = ['/']; // Assuming '/page' is where your sign-in page is

  // If the user is authenticated, or the page is in the list of public paths, continue.
  if (session || publicPaths.includes(req.nextUrl.pathname)) {
    // console.log('Access allowed');
    return NextResponse.next();
  }

  // Redirect them to the sign-in page if they are not authenticated and trying to access a protected route
  console.log('Redirecting to sign-in page');
  const url = req.nextUrl.clone();
  url.pathname = '/'; // Set the pathname to your sign-in route
  return NextResponse.redirect(url);
}

export const config = {
  matcher: '/', // This will apply the middleware to all routes except '/page'
};
