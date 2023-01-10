import { NextApiResponse, NextApiRequest } from "next";
import clientPromise from "./mongodb";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const client = await clientPromise;
    const db = client.db("URLDATA").collection("shortenUrl");
    const url = await db.findOne({ uid: req.query.redirect });
    if (url) {
      res.send(url.defaultUrl);
    } else {
      res.status(404).json("No such Url found");
    }
  } catch (err) {
    res.status(500).json("Server Error");
  }
}
