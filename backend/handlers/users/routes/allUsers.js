import { getUserToken } from "../../../config.js";
import { User } from "../schema/user.schema.js";

export const allUsers = (app) => {
  app.get("/users", async (req, res) => {
    try {
      const userToken = getUserToken(req, res);

      if (!userToken) {
        return res.status(401).send("Unauthorized: you are not connected");
      }

      if (!userToken.isAdmin) {
        return res.status(403).send("Forbidden: you don't have permission");
      }

      const users = await User.find();

      res.send(users);
    } catch (error) {
      console.error("Error fetching all users:", error);
      res.status(500).send("Internal Server Error");
    }
  });
};
