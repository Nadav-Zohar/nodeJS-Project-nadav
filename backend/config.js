import JWT, { decode } from "jsonwebtoken";

export const getUserToken = (req, res) => {
  if (!req.headers.authorization) {
    return null;
  }
  const data = JWT.decode(req.headers.authorization, process.env.JWT_SECRET);

  return data;
};
