import mongoose from 'mongoose';
import { Article } from '../../../models/Article.js';
import { User } from '../../../models/User.js';

const getArticleDetails = async (articleId, userId = null, skipView) => {
  if (!skipView) {
    await Article.findByIdAndUpdate(articleId, { $inc: { viewsCount: 1 } });
  }
  
  const preArticle = await Article.findByIdAndUpdate(
    articleId,
    { new: true }
  ).lean();

  if (!preArticle) return null;

  const { _id, ...articleData } = preArticle;
  const article = {
    id: _id.toString(),
    ...articleData,
  };

  const author = await User.findById(preArticle.authorId, 'name').lean();

  let isBookmarked = false;
  if (userId) {
    const userHasBookmark = await User.exists({
      _id: userId,
      savedArticles: articleId,
    });

    isBookmarked = Boolean(userHasBookmark);
  };

  const currentObjectId = new mongoose.Types.ObjectId(article.id);
  const recommendations = await Article.aggregate([
    { $match: { 
        _id: { $ne: currentObjectId },
        title: { $ne: article.title }
      }
    },
    { $sample: { size: 3 } },
    {
      $lookup: {
        from: 'users',
        localField: 'authorId',
        foreignField: '_id',
        as: 'author'
      }
    },
    {
      $unwind: {
        path: '$author',
        preserveNullAndEmptyArrays: true
      }
    },
    {
      $project: {
        _id: 0,
        id: { $toString: '$_id' },
        title: 1,
        description: 1,
        imageUrl: 1,
        publicationDate: 1,
        category: 1,
        viewsCount: 1,
        author: {
          $cond: {
            if: { $ifNull: ['$author._id', false] },
            then: {
              id: '$author._id',
              name: '$author.name'
            },
            else: null
          }
        }
      }
    },
  ]);
  
  return {
    article,
    author: author? {
        id: author._id.toString(),
        name: author.name,
      }: null,
    isBookmarked,
    recommendations,
  };
}

export { getArticleDetails };
