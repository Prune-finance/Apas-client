import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  try {
    // Handles admin
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

    // Handles onboarding
    if (request.nextUrl.pathname.startsWith("/onboarding")) {
      const req = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/onboarding/me`,
        {
          headers: { Authorization: `Bearer ${cookies().get("auth")?.value}` },
        }
      );
      if (!req.ok) {
        return NextResponse.redirect(
          new URL("/auth/onboarding/login", request.url)
        );
      }

      return;
    }

    // Handles business
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

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - pdf.worker.min.mjs (PDF worker file)
     * - questionnaire (questionnaire pages)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|auth|404|pdf.worker.min.mjs|pre-onboarding).*)",
  ],
};
