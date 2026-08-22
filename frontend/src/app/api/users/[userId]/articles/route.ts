import { NextRequest } from 'next/server';
import { proxyToBackend } from '@/lib/api/proxy';

type RouteContext = { params: Promise<{ userId: string }> };

export async function GET(request: NextRequest, context: RouteContext) {
  const { userId } = await context.params;
  return proxyToBackend(request, `/api/users/${userId}/articles`);
}
