import { apiRequest } from '@/lib/api/client';
import { ArticleDetailsResponse } from './article-details.types';

export type ArticleDetailsData = ArticleDetailsResponse['data'];

const getBaseUrl = () => {
  if (typeof window !== 'undefined') return '';
  return process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
};

export const fetchArticleById = async (articleId: string, skipView = false, cookieHeader?: string): Promise<ArticleDetailsData> => {
  const headers: Record<string, string> = skipView
    ? { 'x-skip-view': 'true' }
    : {};
  
  if (typeof window === 'undefined') {
    if (cookieHeader) {
      headers['cookie'] = cookieHeader;
    }

    const baseUrl = getBaseUrl();
    const res = await fetch(`${baseUrl}/api/articles/${articleId}`, {
      headers,
      cache: 'no-store',
    });
    
    if (!res.ok) {
      const error = new Error(`Failed to fetch article: ${res.status}`) as Error & { status?: number };
      error.status = res.status;
      throw error;
    }

    const json: ArticleDetailsResponse = await res.json();
    return json.data;
  }
  const response = await apiRequest<ArticleDetailsResponse>(
    `/articles/${articleId}`,
    { headers },
  );
  return response.data;
};
