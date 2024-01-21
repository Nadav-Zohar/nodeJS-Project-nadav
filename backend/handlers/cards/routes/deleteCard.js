import { getUserToken } from "../../../config.js";
import { Card } from "../schema/card.schema.js";

export const deleteCard = (app) => {
  app.delete("/cards/:id", async (req, res) => {
    try {
      const userToken = getUserToken(req, res);

      if (!userToken) {
        return res.status(401).send("Unauthorized: you are not connected");
      }

      const card = await Card.findById(req.params.id);

      if (!userToken.isAdmin && card.user_id != userToken._id) {
        return res.status(403).send("Forbidden: you don't have permission");
      }

      await Card.findByIdAndDelete(req.params.id);

      res.send("Card deleted");
    } catch (error) {
      console.error("Error deleting card:", error);
      res.status(500).send("Internal Server Error");
    }
  });
};
