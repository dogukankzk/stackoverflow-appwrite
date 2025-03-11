import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Middleware de base sans Appwrite (évite les erreurs avec Edge Runtime)
export async function middleware(request: NextRequest) {
    console.log("✅ Middleware exécuté :", request.nextUrl.pathname);
    return NextResponse.next();
}

// Exclure certaines routes
export const config = {
    matcher: [
        "/((?!api|_next/static|_next/image|favicon.ico|login|signup).*)"
    ],
};
