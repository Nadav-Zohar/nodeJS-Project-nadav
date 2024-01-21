import { createBizNumber } from "../handlers/cards/routes/addCard.js";
import { Card } from "../handlers/cards/schema/card.schema.js";
import { User } from "../handlers/users/schema/user.schema.js";
import { users, cards } from "./initialData.js";
import bcrypt from "bcryptjs";

const userIds = [];

export const addInitialUsers = async () => {
  for (const userForm of users) {
    const { password } = userForm;

    try {
      const newUser = await User({
        ...userForm,
        password: await bcrypt.hash(password, 10),
      });

      const obj = await newUser.save();

      if (obj.isBusiness || obj.isAdmin) {
        userIds.push(obj._id);
        console.log(userIds);
      }
    } catch (error) {
      console.log(error + " here");
    }
  }
};

export const addInitialCards = async () => {
  for (const cardForm of cards) {
    cardForm.bizNumber = await createBizNumber();

    const randomUserIdIndex = Math.floor(Math.random() * userIds.length);
    cardForm.user_id = userIds[randomUserIdIndex];

    const card = new Card(cardForm);

    try {
      const obj = await card.save();
      console.log(obj);
    } catch (error) {
      console.log(error + " here");
    }
  }
};
