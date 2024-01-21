import { Card } from "../schema/card.schema.js";

export const oneCard = (app) => {
  app.get("/cards/:id", async (req, res) => {
    try {
      const card = await Card.findOne({ _id: req.params.id });

      if (!card) {
        return res.status(404).send("Not Found: can't find the card");
      }

      res.send(card);
    } catch (error) {
      console.error("Error fetching card:", error);
      res.status(500).send("Internal Server Error");
    }
  });
};
