// backend/src/modules/articles/list/articles-list.service.js

import { Article } from "../../../models/Article.js";
import { User } from "../../../models/User.js";

export const getArticlesListService = async (query, userId) => {
  const page = Math.max(1, Number(query.page) || 1);
  const perPage = Math.max(1, Number(query.limit || query.perPage) || 8);
  const skip = (page - 1) * perPage;

  const filter = {};

  if (query.authorId) {
    filter.authorId = query.authorId;
  }

  if (query.excludeId) {
    filter._id = { $ne: query.excludeId };
  }

  const sort =
    query.filter === "popular" ? { viewsCount: -1, publicationDate: -1 } : { publicationDate: -1 };

  const [totalItems, rawArticles, user] = await Promise.all([
    Article.countDocuments(filter),

    Article.find(filter)
      .populate("authorId", "_id name avatarUrl")
      .sort(sort)
      .skip(skip)
      .limit(perPage)
      .lean(),

    userId ? User.findById(userId).select("savedArticles").lean() : Promise.resolve(null),
  ]);

  const savedArticlesSet = new Set(
    user?.savedArticles ? user.savedArticles.map((id) => id.toString()) : [],
  );

  const articles = rawArticles.map((article) => {
    const { _id, authorId, ...rest } = article;

    return {
      ...rest,
      id: _id.toString(),
      isBookmarked: savedArticlesSet.has(_id.toString()),
      author:
        typeof authorId === "object" && authorId !== null
          ? {
              id: authorId._id.toString(),
              name: authorId.name || "Unknown Author",
              avatarUrl: authorId.avatarUrl || null,
            }
          : {
              id: authorId ? String(authorId) : "",
              name: "Unknown Author",
              avatarUrl: null,
            },
    };
  });

  const totalPages = Math.ceil(totalItems / perPage) || 1;
  const hasNextPage = page < totalPages;
  const hasPreviousPage = page > 1;

  return {
    data: {
      items: articles,
      meta: {
        page,
        perPage,
        totalItems,
        totalPages,
        hasNextPage,
        hasPreviousPage,
      },
    },
    message: "Success",
  };
};
