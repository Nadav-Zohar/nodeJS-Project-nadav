import { getUserToken } from "../../../config.js";
import { cardValidation } from "../helpers/cardValidation.joi.js";
import { Card } from "../schema/card.schema.js";

export const editCard = (app) => {
  app.put("/cards/:id", async (req, res) => {
    try {
      const editedCardForm = req.body;

      const validate = cardValidation.validate(editedCardForm, {
        abortEarly: false,
      });

      if (validate.error) {
        return res.status(400).send(`Unauthorized: ${validate.error}`);
      }

      const userToken = getUserToken(req, res);

      if (!userToken) {
        return res.status(401).send("Unauthorized: you are not connected");
      }

      const currentCard = await Card.findOne({ _id: req.params.id });

      if (!currentCard) {
        return res.status(404).send("Not Found: card not found");
      }

      if (currentCard.user_id != userToken._id) {
        return res.status(403).send("Forbidden: you don't have permission");
      }

      currentCard.set(editedCardForm);

      const savedCard = await currentCard.save();

      res.send(savedCard);
    } catch (error) {
      console.error("Error editing card:", error);
      res.status(500).send("Internal Server Error");
    }
  });
};
