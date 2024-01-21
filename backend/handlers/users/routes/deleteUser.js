import { getUserToken } from "../../../config.js";
import { User } from "../schema/user.schema.js";

export const deleteUser = (app) => {
  app.delete("/users/:id", async (req, res) => {
    try {
      const userToken = getUserToken(req, res);

      if (!userToken) {
        return res.status(401).send("Unauthorized: you are not connected");
      }

      if (!userToken.isAdmin && req.params.id !== userToken._id) {
        return res.status(403).send("Forbidden: you don't have permission");
      }

      const deletedUser = await User.findByIdAndDelete(req.params.id);

      if (!deletedUser) {
        return res.status(404).send("Not Found: user not found");
      }

      res.send("User deleted");
    } catch (error) {
      console.error("Error deleting user:", error);
      res.status(500).send("Internal Server Error");
    }
  });
};
