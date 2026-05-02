import { NextRequest, NextResponse } from "next/server";

const API_URL = (process.env.API_URL || "http://localhost:5000").replace(
	/\/$/,
	"",
);

export async function GET(request: NextRequest) {
	const token = request.cookies.get("admin_token")?.value;

	if (!token) {
		return NextResponse.json({ message: "Non autorisé" }, { status: 401 });
	}

	const res = await fetch(`${API_URL}/api/auth/me`, {
		headers: { Authorization: `Bearer ${token}` },
	});

	const data = await res.json();
	return NextResponse.json(data, { status: res.status });
}
