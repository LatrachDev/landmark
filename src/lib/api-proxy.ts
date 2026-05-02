import { NextRequest, NextResponse } from 'next/server';

const API_URL = (process.env.API_URL || 'http://localhost:5000').replace(/\/$/, '');

export async function proxyToBackend(
  request: NextRequest,
  backendPath: string,
): Promise<NextResponse> {
  const token = request.cookies.get('admin_token')?.value;

  if (!token) {
    return NextResponse.json({ message: 'Non autorisé' }, { status: 401 });
  }

  const headers: Record<string, string> = {
    Authorization: `Bearer ${token}`,
    Accept: 'application/json',
  };

  let body: BodyInit | null = null;
  const contentType = request.headers.get('content-type') ?? '';

  if (request.method !== 'GET' && request.method !== 'HEAD') {
    if (contentType.includes('multipart/form-data')) {
      body = await request.formData();
    } else if (contentType.includes('application/json')) {
      headers['Content-Type'] = 'application/json';
      body = await request.text();
    }
  }

  const res = await fetch(`${API_URL}${backendPath}`, {
    method: request.method,
    headers,
    body,
  });

  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}
