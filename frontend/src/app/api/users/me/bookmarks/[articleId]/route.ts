import { NextRequest } from 'next/server';
import { proxyToBackend } from '@/lib/api/proxy';

type RouteContext = { params: Promise<{ articleId: string }> };

export async function DELETE(request: NextRequest, context: RouteContext) {
  const { articleId } = await context.params;
  return proxyToBackend(request, `/api/users/me/bookmarks/${articleId}`);
}
