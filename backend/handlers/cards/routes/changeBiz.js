import { getUserToken } from "../../../config.js";
import { bizNumberValidate } from "../helpers/bizNumberChange.joi.js";
import { Card } from "../schema/card.schema.js";

export const changeBiz = (app) => {
  app.patch("/cards/biz/:id", async (req, res) => {
    try {
      const validate = bizNumberValidate.validate(req.body, {
        abortEarly: false,
      });

      if (validate.error) {
        return res.status(400).send(`Unauthorized: ${validate.error}`);
      }

      const userToken = getUserToken(req, res);

      if (!userToken) {
        return res.status(401).send("Unauthorized: you are not connected");
      }

      const card = await Card.findOne({ _id: req.params.id });

      if (!card) {
        return res.status(404).send("Not Found: card not found");
      }

      if (!userToken.isAdmin) {
        return res.status(403).send("Forbidden: you don't have permission");
      }

      const newBizNumber = req.body.bizNumber;

      const existingCardWithBizNumber = await Card.findOne({
        bizNumber: newBizNumber,
        _id: { $ne: req.params.id },
      });

      if (existingCardWithBizNumber) {
        return res
          .status(400)
          .send("Bad Request: bizNumber already in use by another card");
      }

      card.bizNumber = newBizNumber;

      await card.save();

      res.send(card);
    } catch (error) {
      console.error("Error changing bizNumber:", error);
      res.status(500).send("Internal Server Error");
    }
  });
};
