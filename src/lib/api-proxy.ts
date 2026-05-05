import { NextRequest, NextResponse } from "next/server";

const NEXT_PUBLIC_API_URL = (process.env.NEXT_PUBLIC_API_URL || "https://api.landmark.ma").replace(/\/$/, "");

export async function proxyToBackend(
	request: NextRequest,
	backendPath: string,
): Promise<NextResponse> {
	const token = request.cookies.get("admin_token")?.value;

	if (!token) {
		return NextResponse.json({ message: "Non autorisé" }, { status: 401 });
	}

	const headers: Record<string, string> = {
		Authorization: `Bearer ${token}`,
		Accept: "application/json",
	};

	let body: BodyInit | null = null;
	const contentType = request.headers.get("content-type") ?? "";

	if (request.method !== "GET" && request.method !== "HEAD") {
		if (contentType.includes("multipart/form-data")) {
			body = await request.formData();
		} else if (contentType.includes("application/json")) {
			headers["Content-Type"] = "application/json";
			body = await request.text();
		}
	}

	let res: Response;
	try {
		res = await fetch(`${NEXT_PUBLIC_API_URL}${backendPath}`, {
			method: request.method,
			headers,
			body,
		});
	} catch {
		return NextResponse.json(
			{ message: "Backend unreachable" },
			{ status: 502 },
		);
	}

	// 204 No Content — no body to parse
	if (res.status === 204) {
		return new NextResponse(null, { status: 204 });
	}

	let data: unknown;
	try {
		data = await res.json();
	} catch {
		data = { message: "Upstream returned non-JSON response" };
	}

	return NextResponse.json(data, { status: res.status });
}
