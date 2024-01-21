import { Card } from "../schema/card.schema.js";

export const allCards = (app) => {
  app.get("/cards", async (req, res) => {
    try {
      const cards = await Card.find();

      res.send(cards);
    } catch (error) {
      console.error("Error fetching all cards:", error);
      res.status(500).send("Internal Server Error");
    }
  });
};
