import { getUserToken } from "../../../config.js";
import { Card } from "../schema/card.schema.js";

export const myCards = (app) => {
  app.get("/cards/my-cards", async (req, res) => {
    try {
      const userToken = getUserToken(req, res);

      if (!userToken) {
        return res.status(401).send("Unauthorized: you are not connected");
      }

      const cards = await Card.find({ user_id: userToken._id });

      if (!cards || cards.length === 0) {
        return res
          .status(404)
          .send("Not Found: can't find any cards for the user");
      }

      res.send(cards);
    } catch (error) {
      console.error("Error fetching user cards:", error);
      res.status(500).send("Internal Server Error");
    }
  });
};
