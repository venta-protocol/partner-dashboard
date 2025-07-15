// import NextAuth from 'next-auth';
// import { authConfig } from './auth';

// export default NextAuth(authConfig).auth;

// export const config = {
//   // https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher
//   matcher: ['/((?!api|_next/static|_next/image|.png).*)'],
// };

import { NextResponse, NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // Exclude NextAuth routes and other specific routes from your custom logic
  const excludedPaths = ["/api/auth", "/_next/static", "/_next/image"];
  if (excludedPaths.some((path) => request.nextUrl.pathname.startsWith(path))) {
    return NextResponse.next();
  }

  // Custom logic for other paths
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-url", request.url);

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

export const config = {
  // Apply the middleware to all routes except the excluded ones
  matcher: ["/((?!api/auth|_next/static|_next/image).*)"],
};
