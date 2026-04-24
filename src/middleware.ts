export { default } from "next-auth/middleware";

export const config = {
  matcher: [
    /*
     * Match all routes except:
     * - /login, /register (auth pages)
     * - /api/auth/* (NextAuth endpoints)
     * - /_next/* (static files)
     * - /favicon.ico, /public files
     */
    "/((?!login|register|api/auth|_next/static|_next/image|favicon.ico).*)",
  ],
};
