// TODO (учасник №5): business logic and database access

import { Article } from "../../../models/Article.js";
import { User } from "../../../models/User.js";

const mapUserResponse = (user, articlesAmount) => ({
  id: user._id.toString(),
  name: user.name,
  email: user.email,
  avatarUrl: user.avatarUrl ?? null,
  avatarPublicId: user.avatarPublicId ?? null,
  articlesAmount,
});

export const getUserMe = async (userId) => {
  const [user, articlesAmount] = await Promise.all([
    User.findById(userId).select("_id name email avatarUrl avatarPublicId"),

    Article.countDocuments({
      authorId: userId,
    }),
  ]);

  if (!user) {
    throw new Error("User not found");
  }

  return mapUserResponse(user, articlesAmount);
};

export const updateUserMe = async (userId, data) => {
  const allowedFields = ["name", "avatarUrl", "avatarPublicId"];

  const updateData = {};

  allowedFields.forEach((field) => {
    if (data[field] !== undefined) {
      updateData[field] = data[field];
    }
  });

  const user = await User.findByIdAndUpdate(userId, updateData, {
    new: true,
    runValidators: true,
  }).select("_id name email avatarUrl avatarPublicId");

  if (!user) {
    throw new Error("User not found");
  }

  const articlesAmount = await Article.countDocuments({
    authorId: userId,
  });

  return mapUserResponse(user, articlesAmount);
};
