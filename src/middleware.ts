import { NextResponse, type NextRequest } from "next/server";

import { updateSession } from "@/lib/supabase/middleware";
import { DEMO_MODE } from "@/lib/demo-mode";

export async function middleware(request: NextRequest) {
  // Demo mode: skip the Supabase session refresh entirely so requests
  // never make a network call to a project that may not be configured.
  if (DEMO_MODE) return NextResponse.next();
  return updateSession(request);
}

export const config = {
  matcher: [
    /*
     * Match all request paths except static assets and image optimization,
     * so the auth cookie stays fresh across the whole app.
     */
    "/((?!_next/static|_next/image|favicon.ico|placeholders/).*)",
  ],
};
