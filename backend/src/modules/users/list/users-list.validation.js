const createError = (msg) => Object.assign(new Error(msg), { status: 400, statusCode: 400 });

export const parseGetUsersQuery = (query = {}) => {
  const page = query.page !== undefined ? Number(query.page) : 1;
  const perPage = query.perPage !== undefined ? Number(query.perPage) : 20;

  const allowedSortValues = ['articlesAmount', 'createdAt', 'name', 'popular'];

  if (!Number.isInteger(page) || page < 1) throw createError('Invalid query parameter "page"');
  if (!Number.isInteger(perPage) || perPage < 1 || perPage > 100)
    throw createError('Invalid query parameter "perPage"');
  if (query.sort !== undefined && !allowedSortValues.includes(query.sort)) {
    throw createError('Invalid query parameter "sort"');
  }

  const sort = query.sort;

  return {
    page,
    perPage,
    sort,
  };
};
