import { NextRequest } from "next/server";
import { revalidatePath } from "next/cache";
import { proxyToBackend } from "@/lib/api-proxy";

export async function GET(
	request: NextRequest,
	{ params }: { params: Promise<{ id: string }> },
) {
	const { id } = await params;
	return proxyToBackend(request, `/api/services/${id}`);
}

export async function PUT(
	request: NextRequest,
	{ params }: { params: Promise<{ id: string }> },
) {
	const { id } = await params;
	const response = await proxyToBackend(request, `/api/services/${id}`);
	if (response.status >= 200 && response.status < 300) {
		revalidatePath("/services");
		revalidatePath(`/services/${id}`);
		revalidatePath("/");
	}
	return response;
}

export async function DELETE(
	request: NextRequest,
	{ params }: { params: Promise<{ id: string }> },
) {
	const { id } = await params;
	const response = await proxyToBackend(request, `/api/services/${id}`);
	if (response.status >= 200 && response.status < 300) {
		revalidatePath("/services");
		revalidatePath(`/services/${id}`);
		revalidatePath("/");
	}
	return response;
}
