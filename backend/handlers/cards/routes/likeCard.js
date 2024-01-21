import { getUserToken } from "../../../config.js";
import { Card } from "../schema/card.schema.js";

export const likeCard = (app) => {
  app.patch("/cards/:id", async (req, res) => {
    try {
      const userToken = getUserToken(req, res);

      if (!userToken) {
        return res.status(401).send("Unauthorized: you are not connected");
      }

      const card = await Card.findOne({ _id: req.params.id });

      if (!card) {
        return res.status(404).send("Not Found: card not found");
      }

      card.likes.push(userToken._id);

      await card.save();

      res.send(card);
    } catch (error) {
      console.error("Error liking card:", error);
      res.status(500).send("Internal Server Error");
    }
  });
};
