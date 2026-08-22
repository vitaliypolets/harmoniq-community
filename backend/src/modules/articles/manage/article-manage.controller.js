// TODO (учасник №12): controllers

import { deleteArticle, updateArticle } from "./article-manage.service.js";

export const updateArticleController = async (req, res) => {
  const { articleId } = req.params;

  const article = await updateArticle({
    articleId,
    data: req.body,
    file: req.file,
    userId: req.user._id,
  });

  res.status(200).json({
    data: article,
    message: "Success",
  });
};

export const deleteArticleController = async (req, res) => {
  const { articleId } = req.params;

  await deleteArticle({
    articleId,
    userId: req.user._id,
  });

  res.status(204).send();
};
