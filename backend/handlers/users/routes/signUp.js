import { signUpValidation } from "../helpers/signUpValidation.joi.js";
import { User } from "../schema/user.schema.js";
import bcrypt from "bcryptjs";

export const signUp = (app) => {
  app.post("/users", async (req, res) => {
    const userForm = req.body;

    const validate = signUpValidation.validate(userForm, { abortEarly: false });

    if (validate.error) {
      return res.status(400).send(`Unauthorized: ${validate.error}`);
    }

    const { password } = userForm;

    try {
      const newUser = await User({
        ...userForm,
        password: await bcrypt.hash(password, 10),
      });

      const obj = await newUser.save();

      res.send(obj);
    } catch (error) {
      if (error.code === 11000 && error.keyPattern && error.keyPattern.email) {
        return res
          .status(409)
          .send(
            "Conflict: Email already in use. Please choose a different email."
          );
      } else {
        console.error("Error during user registration:", error);
        return res.status(500).send("Internal Server Error");
      }
    }
  });
};
