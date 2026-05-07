import { NextRequest } from "next/server";
import { revalidatePath } from "next/cache";
import { proxyToBackend } from "@/lib/api-proxy";

export async function GET(request: NextRequest) {
	return proxyToBackend(request, "/api/team");
}

export async function POST(request: NextRequest) {
	const response = await proxyToBackend(request, "/api/team");
	if (response.status >= 200 && response.status < 300) {
		revalidatePath("/about");
	}
	return response;
}
