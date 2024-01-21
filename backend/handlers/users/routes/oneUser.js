import { getUserToken } from "../../../config.js";
import { User } from "../schema/user.schema.js";

export const oneUser = (app) => {
  app.get("/users/:id", async (req, res) => {
    try {
      const userToken = getUserToken(req, res);

      if (!userToken) {
        return res.status(401).send("Unauthorized: you are not connected");
      }

      if (!userToken.isAdmin && req.params.id !== userToken._id) {
        return res.status(403).send("Forbidden: you don't have permission");
      }

      const user = await User.findOne({ _id: req.params.id });

      if (!user) {
        return res.status(404).send("Not Found: can't find the user");
      }

      res.send(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).send("Internal Server Error");
    }
  });
};
