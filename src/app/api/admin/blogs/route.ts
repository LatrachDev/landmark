import { NextRequest } from "next/server";
import { proxyToBackend } from "@/lib/api-proxy";

export async function GET(request: NextRequest) {
	console.log("[BLOGS ROUTE] GET /api/admin/blogs hit");
	return proxyToBackend(request, "/api/blogs");
}

export async function POST(request: NextRequest) {
	console.log("[BLOGS ROUTE] POST /api/admin/blogs hit");
	return proxyToBackend(request, "/api/blogs");
}
