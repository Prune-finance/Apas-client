import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const AUTH_CACHE_SECONDS = 300; // 5 minutes

async function verifyAuth(url: string, token: string | undefined): Promise<boolean> {
  if (!token) return false;
  try {
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.ok;
  } catch {
    return false;
  }
}

function cachedNext(request: NextRequest, cookieName: string): NextResponse {
  const response = NextResponse.next();
  response.cookies.set(cookieName, "1", {
    maxAge: AUTH_CACHE_SECONDS,
    httpOnly: true,
    sameSite: "strict",
    path: "/",
  });
  return response;
}

export async function middleware(request: NextRequest) {
  const token = request.cookies.get("auth")?.value;

  try {
    // Handles admin
    if (request.nextUrl.pathname.startsWith("/admin")) {
      if (request.cookies.get("admin-auth-ok")) return NextResponse.next();

      const ok = await verifyAuth(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/admin/me`,
        token
      );
      if (!ok) return NextResponse.redirect(new URL("/auth/admin/login", request.url));

      return cachedNext(request, "admin-auth-ok");
    }

    // Handles onboarding
    if (request.nextUrl.pathname.startsWith("/onboarding")) {
      // Invite pages (/onboarding/[id]) use token-based auth — let them through
      const segments = request.nextUrl.pathname.split("/").filter(Boolean);
      if (segments.length > 1) return NextResponse.next();

      if (request.cookies.get("onboarding-auth-ok")) return NextResponse.next();

      const ok = await verifyAuth(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/business/onboarding/auth/me`,
        token
      );
      if (!ok) return NextResponse.redirect(new URL("/auth/login", request.url));

      return cachedNext(request, "onboarding-auth-ok");
    }

    // Handles business
    if (request.cookies.get("business-auth-ok")) return NextResponse.next();

    const ok = await verifyAuth(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/auth/me`,
      token
    );
    if (!ok) return NextResponse.redirect(new URL("/auth/login", request.url));

    return cachedNext(request, "business-auth-ok");
  } catch (error) {
    console.error("[middleware] catch error for path:", request.nextUrl.pathname, error);
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
    "/((?!api|_next/static|_next/image|favicon.ico|auth|404|pdf.worker.min.mjs|questionnaire).*)",
  ],
};
