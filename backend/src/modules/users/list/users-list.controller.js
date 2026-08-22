import { controllerWrapper } from "../../../middlewares/controllerWrapper.js";
import { parseGetUsersQuery } from "./users-list.validation.js";
import { getUsersListService } from "./users-list.service.js";

export const getUsersListController = controllerWrapper(async (req, res) => {
  const parsedQuery = parseGetUsersQuery(req.query);
  const result = await getUsersListService(parsedQuery);

  res.status(200).json({
    data: result,
    message: "Success",
  });
});
