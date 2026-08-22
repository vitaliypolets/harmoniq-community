// TODO (учасник №7): controllers
import { getUserDetails } from "./user-details.service.js";

export const getUserDetailsController = async (req, res) => {
  const { userId } = req.params;

  const user = await getUserDetails(userId);

  res.status(200).json({
    data: user,
    message: "Success",
  });
};
