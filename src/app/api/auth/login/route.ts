import { NextRequest, NextResponse } from "next/server";

const NEXT_PUBLIC_API_URL = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000").replace(
	/\/$/,
	"",
);

export async function POST(request: NextRequest) {
	const body = await request.json();

	let res: Response;
	try {
		res = await fetch(`${NEXT_PUBLIC_API_URL}/api/auth/login`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(body),
		});
	} catch {
		return NextResponse.json(
			{ message: "Service indisponible" },
			{ status: 503 },
		);
	}

	const data = await res.json();

	if (!res.ok) {
		return NextResponse.json(data, { status: res.status });
	}

	// Return only email + role — the token goes into an httpOnly cookie, never the response body
	const response = NextResponse.json({ email: data.email, role: data.role });

	response.cookies.set("admin_token", data.token, {
		httpOnly: true,
		secure: process.env.NODE_ENV === "production",
		sameSite: "strict",
		maxAge: 8 * 60 * 60, // 8 h — matches backend JWT expiry
		path: "/",
	});

	return response;
}
