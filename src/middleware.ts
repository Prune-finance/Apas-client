import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  try {
    // if (request.nextUrl.pathname.startsWith("/_next/")) {
    //   return NextResponse.next();
    // }

    // if (request.nextUrl.pathname.startsWith("/auth")) {
    //   return NextResponse.next();
    // }

    if (request.nextUrl.pathname.startsWith("/admin")) {
      const req = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/admin/me`,
        {
          headers: { Authorization: `Bearer ${cookies().get("auth")?.value}` },
        }
      );
      if (!req.ok) {
        return NextResponse.redirect(new URL("/auth/admin/login", request.url));
      }

      return;
    }

    const req = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/auth/me`, {
      headers: { Authorization: `Bearer ${cookies().get("auth")?.value}` },
    });

    if (!req.ok) {
      return NextResponse.redirect(new URL("/auth/login", request.url));
    }
  } catch (error) {
    if (request.nextUrl.pathname.startsWith("/admin"))
      return NextResponse.redirect(new URL("/auth/admin/login", request.url));
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }
}

// export const config = {
//   matcher: [
//     /*
//      * Match all request paths except for the ones starting with:
//      * - api (API routes)
//      * - _next/static (static files)
//      * - _next/image (image optimization files)
//      * - favicon.ico (favicon file)
//      */
//     "/((?!api|_next/static|_next/image|favicon.ico|auth|404).*)",
//   ],
// };

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - pdf.worker.min.mjs (PDF worker file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|auth|404|pdf.worker.min.mjs).*)",
  ],
};
