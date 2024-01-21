import JWT from "jsonwebtoken";
import { User } from "../schema/user.schema.js";
import bcrypt from "bcryptjs";
import { loginValidation } from "../helpers/loginValidation.joi.js";

export const login = (app) => {
  app.post("/users/login", async (req, res) => {
    const validate = loginValidation.validate(req.body, { abortEarly: false });

    if (validate.error) {
      return res.status(400).send(`Unauthorized: ${validate.error}`);
    }

    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).send("Bad Request: required fields empty");
      }

      const user = await User.findOne({ email });

      if (!user) {
        return res
          .status(404)
          .send("Not Found: email or password are incorrect");
      }

      const passwordMatch = await bcrypt.compare(password, user.password);

      if (!passwordMatch) {
        return res
          .status(403)
          .send("Forbidden: email or password are incorrect");
      }

      const token = JWT.sign(
        {
          _id: user._id,
          isBusiness: user.isBusiness,
          isAdmin: user.isAdmin,
        },
        process.env.JWT_SECRET,
        {
          expiresIn: "1h",
        }
      );

      res.send(token);
    } catch (error) {
      console.error("Error during login:", error);
      res.status(500).send("Internal Server Error");
    }
  });
};
