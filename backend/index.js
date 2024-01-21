import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import chalk from "chalk";
import morgan from "morgan";
import path from "path";
import dotenv from "dotenv";

import { myCards } from "./handlers/cards/routes/myCards.js";
import { addCard } from "./handlers/cards/routes/addCard.js";
import { allCards } from "./handlers/cards/routes/allCards.js";
import { deleteCard } from "./handlers/cards/routes/deleteCard.js";
import { editCard } from "./handlers/cards/routes/editCard.js";
import { likeCard } from "./handlers/cards/routes/likeCard.js";
import { oneCard } from "./handlers/cards/routes/oneCard.js";
import { changeBiz } from "./handlers/cards/routes/changeBiz.js";

import { signUp } from "./handlers/users/routes/signUp.js";
import { login } from "./handlers/users/routes/login.js";
import { allUsers } from "./handlers/users/routes/allUsers.js";
import { oneUser } from "./handlers/users/routes/oneUser.js";
import { editUser } from "./handlers/users/routes/editUser.js";
import { deleteUser } from "./handlers/users/routes/deleteUser.js";
import { updateUser } from "./handlers/users/routes/updateUser.js";
import {
  addInitialCards,
  addInitialUsers,
} from "./initialData/initialDataService.js";

const __dirname = path.resolve();
dotenv.config();

async function main() {
  try {
    await mongoose.connect(process.env.REMOTE_URL);
    console.log(chalk.green("MongoDB connection established on port 27017"));

    const db = mongoose.connection.db;
    const collection1DataCount = await db.collection("users").countDocuments();
    const collection2DataCount = await db.collection("cards").countDocuments();

    if (collection1DataCount === 0 || collection2DataCount === 0) {
      await addInitialUsers();
      await addInitialCards();
      startExpressApp();
    } else {
      console.log(
        chalk.green(
          "Data found in both collections. Continue with your app logic."
        )
      );

      startExpressApp();
    }
  } catch (err) {
    console.log(chalk.red(err));
  }
}

function startExpressApp() {
  const app = express();

  app.listen(process.env.PORT);

  app.use(morgan(":date[iso] :method :url :status :response-time ms"));

  app.use(express.json());

  app.use(express.static("public"));

  app.use(
    cors({
      origin: true,
      credentials: true,
      methods: "GET,PUT,POST,DELETE,OPTION",
      allowedHeaders: "Content-Type, Accept, Authorization",
    })
  );

  app.get("/", (req, res) => res.send("Hello world, your app is up!"));

  myCards(app);
  addCard(app);
  allCards(app);
  deleteCard(app);
  editCard(app);
  likeCard(app);
  oneCard(app);
  changeBiz(app);

  signUp(app);
  login(app);
  allUsers(app);
  oneUser(app);
  editUser(app);
  deleteUser(app);
  updateUser(app);

  app.get("*", (req, res) => {
    res.sendFile(`${__dirname}/index.html`);
  });
}

main();
