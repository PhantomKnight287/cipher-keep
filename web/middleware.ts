import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  if (request.nextUrl.pathname === "/")
    return NextResponse.redirect(new URL("/home", request.url));

  if (request.cookies.get("cipher_token")?.value) {
    if (
      request.nextUrl.pathname === "/login" ||
      request.nextUrl.pathname === "/register"
    ) {
      return NextResponse.redirect(new URL("/projects", request.url));
    }
  } else {
    if (request.nextUrl.pathname === "/projects")
      return NextResponse.redirect(new URL("/login", request.url));
  }
}
