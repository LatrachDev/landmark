import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const secret = new TextEncoder().encode(process.env.JWT_SECRET ?? "");

export async function middleware(request: NextRequest) {
	const { pathname } = request.nextUrl;

	if (!pathname.startsWith("/admin")) {
		return NextResponse.next();
	}

	const token = request.cookies.get("admin_token")?.value;

	if (!token) {
		return NextResponse.rewrite(new URL("/not-found-page", request.url));
	}

	try {
		const { payload } = await jwtVerify(token, secret, {
			algorithms: ["HS256"],
		});

		if (payload["role"] !== "LK-ADMIN") {
			return NextResponse.rewrite(new URL("/not-found-page", request.url));
		}
	} catch {
		// Expired, tampered, or malformed token
		const response = NextResponse.rewrite(
			new URL("/not-found-page", request.url),
		);
		response.cookies.delete("admin_token");
		return response;
	}

	return NextResponse.next();
}

export const config = {
	matcher: "/admin/:path*",
};
