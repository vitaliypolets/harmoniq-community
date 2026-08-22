import {
  addBookmark,
  getBookmarks,
  removeBookmark,
} from './bookmarks.service.js';

export const getBookmarksController = async (req, res) => {
  const result = await getBookmarks(
    req.user._id,
    res.locals.bookmarksQuery,
  );

  res.status(200).json({
    data: result,
    message: 'Bookmarks retrieved successfully',
  });
};

export const addBookmarkController = async (req, res) => {
  const article = await addBookmark(
    req.user._id,
    res.locals.bookmarkBody.articleId,
  );

  res.status(201).json({
    data: article,
    message: 'Article bookmarked successfully',
  });
};

export const removeBookmarkController = async (req, res) => {
  const result = await removeBookmark(req.user._id, req.params.articleId);

  res.status(200).json({
    data: result,
    message: 'Bookmark removed successfully',
  });
};
