import { getUserToken } from "../../../config.js";
import { editUserValidation } from "../helpers/editUserValidation.joi.js";
import { User } from "../schema/user.schema.js";

export const editUser = (app) => {
  app.put("/users/:id", async (req, res) => {
    try {
      const validate = editUserValidation.validate(req.body, {
        abortEarly: false,
      });

      if (validate.error) {
        return res.status(400).send(`Unauthorized: ${validate.error}`);
      }

      const userToken = getUserToken(req, res);

      if (!userToken) {
        return res.status(401).send("Unauthorized: you are not connected");
      }

      if (req.params.id !== userToken._id) {
        return res.status(403).send("Forbidden: you don't have permission");
      }

      const editedUserForm = req.body;

      const currentUser = await User.findOne({ _id: req.params.id });

      if (!currentUser) {
        return res.status(404).send("Not Found: user not found");
      }

      currentUser.set(editedUserForm);

      const savedUser = await currentUser.save();

      res.send(savedUser);
    } catch (error) {
      console.error("Error editing user:", error);
      res.status(500).send("Internal Server Error");
    }
  });
};
