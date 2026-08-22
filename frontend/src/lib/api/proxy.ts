
import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_URL ?? process.env.NEXT_PUBLIC_API_URL;

export async function proxyToBackend(
  request: NextRequest,
  backendPath: string,
): Promise<NextResponse> {
  if (!BACKEND_URL) {
    return NextResponse.json(
      { status: 500, message: 'BACKEND_URL is not configured' },
      { status: 500 },
    );
  }

  const url = new URL(backendPath, BACKEND_URL);
  url.search = request.nextUrl.search;

  const headers = new Headers(request.headers);
  headers.delete('host');
  headers.delete('content-length');

  const method = request.method;
  const hasBody = !['GET', 'HEAD'].includes(method);
  const body = hasBody ? await request.arrayBuffer() : undefined;

  const response = await fetch(url, {
    method,
    headers,
    body,
    redirect: 'manual',
    cache: 'no-store',
  });

  const responseHeaders = new Headers(response.headers);
  responseHeaders.delete('content-encoding');
  responseHeaders.delete('content-length');

  return new NextResponse(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: responseHeaders,
  });
}
