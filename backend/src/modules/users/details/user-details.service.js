// TODO (учасник №7): business logic and database access
import { Article } from '../../../models/Article.js';
import { User } from '../../../models/User.js';
import { HttpError } from '../../../utils/HttpError.js';

export const getUserDetails = async (userId) => {
  const [user, articlesAmount] = await Promise.all([
    User.findById(userId).select('_id name avatarUrl'),

    Article.countDocuments({
      authorId: userId,
    }),
  ]);

  if (!user) {
    throw new HttpError(404, 'User not found');
  }

  return {
    id: user._id.toString(),
    name: user.name,
    avatarUrl: user.avatarUrl ?? null,
    articlesAmount,
  };
};
