import { NextResponse, type NextRequest } from "next/server"

import { isMobileRequest } from "@/lib/is-mobile"
import { routes } from "@/lib/routes"

export function middleware(request: NextRequest) {
  if (isMobileRequest(request)) {
    return NextResponse.redirect(new URL(routes.portfolio, request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/"],
}
