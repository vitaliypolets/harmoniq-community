// TODO (учасник №11): request validation

export const parseGetArticlesQuery = (query) => {
  const page = Math.max(1, Number(query.page) || 1);
  const perPage = Math.min(100, Math.max(1, Number(query.perPage) || 8));
  const limit = query.limit ? Math.max(1, Number(query.limit)) : undefined;
  const filter = query.filter === 'popular' ? 'popular' : 'all';
  const authorId = query.authorId || undefined;
  const excludeId = query.excludeId || undefined;

  return {
    page,
    perPage,
    limit,
    filter,
    authorId,
    excludeId,
  };
};
