import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export async function updateSession(request: NextRequest) {
  if (!url || !key) {
    return NextResponse.next();
  }

  let response = NextResponse.next({ request });
  const supabase = createServerClient(url, key, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options)
        );
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;
  const isAuthRoute = pathname === "/sign-in" || pathname === "/sign-up";
  const isAuthCallback = pathname === "/auth/callback";
  const isProtected = pathname.startsWith("/dashboard");

  if (user && isAuthRoute && !isAuthCallback) {
    response = NextResponse.redirect(new URL("/dashboard", request.url));
    return response;
  }

  // Auth not wired yet: allow access to dashboard without signing in.
  // When you wire up auth, uncomment the block below to protect routes.
  // if (!user && isProtected && !isAuthCallback) {
  //   const signInUrl = new URL("/sign-in", request.url);
  //   signInUrl.searchParams.set("next", pathname === "/" ? "/dashboard" : pathname);
  //   response = NextResponse.redirect(signInUrl);
  //   return response;
  // }

  return response;
}
