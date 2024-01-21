import { getUserToken } from "../../../config.js";
import { cardValidation } from "../helpers/cardValidation.joi.js";
import { Card } from "../schema/card.schema.js";
import lodash from "lodash";

export const createBizNumber = async () => {
  try {
    const random = lodash.random(1_000_000, 9_999_999);
    const card = await Card.findOne({ bizNumber: random });
    if (card) return createBizNumber();
    return random;
  } catch (error) {
    return console.log(error);
  }
};

export const addCard = (app) => {
  app.post("/cards", async (req, res) => {
    try {
      const cardForm = req.body;

      const validate = cardValidation.validate(cardForm, { abortEarly: false });

      if (validate.error) {
        return res.status(400).send(`Unauthorized: ${validate.error}`);
      }

      const userToken = getUserToken(req, res);

      if (!userToken) {
        return res.status(401).send("Unauthorized: you are not connected");
      }

      if (!userToken.isBusiness) {
        return res.status(403).send("Forbidden: you don't have permission");
      }

      cardForm.user_id = userToken._id;

      cardForm.bizNumber = await createBizNumber();

      const card = new Card(cardForm);

      const obj = await card.save();

      res.send(obj);
    } catch (error) {
      console.error("Error adding card:", error);
      res.status(500).send("Internal Server Error");
    }
  });
};
