import { Schema, model } from "mongoose";
import { Name } from "./name.schema.js";
import { Image } from "./image.schema.js";
import { Address } from "./address.schema.js";

const schema = Schema({
  name: Name,
  phone: {
    type: String,
    required: true,
    match: RegExp(/0[0-9]{1,2}\-?\s?[0-9]{3}\s?[0-9]{4}/),
  },
  email: {
    type: String,
    required: true,
    match: RegExp(/^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/),
    lowercase: true,
    trim: true,
    unique: true,
  },
  password: { type: String, required: true, trim: true },
  image: Image,
  address: Address,
  isBusiness: { type: Boolean, default: false },
  isAdmin: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

export const User = model("users", schema);
