import clientPromise from "./mongodb";
import { NextApiResponse, NextApiRequest } from "next";
import { nanoid } from "nanoid";
import validateUrl from "./utils/urlValidate";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const client = await clientPromise;
  const db = client.db("URLDATA").collection("shortenUrl");

  const defaultUrl = req.body.url;
  const urlId = nanoid();

  if (validateUrl(defaultUrl)) {
    try {
      const findUrl = await db.findOne({ defaultUrl });
      if (findUrl) {
        res.status(200).send(findUrl.shortUrl);
      } else {
        const shortUrl = `${process.env.BASE}/${urlId}`;
        const urlObject = {
          uid: urlId,
          defaultUrl,
          shortUrl,
        };
        const insert = await db.insertOne(urlObject);
        if (insert.acknowledged) {
          res.send(shortUrl);
        }
      }
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  } else {
    res.status(500).json("Invalid url");
  }
}
