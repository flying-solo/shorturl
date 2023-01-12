import clientPromise from "./mongodb";
import { NextApiResponse, NextApiRequest } from "next";
import { customAlphabet } from "nanoid";
import validateUrl from "./utils/urlValidate";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const client = await clientPromise;
  const db = client.db("URLDATA").collection("shortenUrl");

  const defaultUrl = req.body.url;
  const alphabett = "abcdefghijklmnopqrstuvwxyz";
  const urlId = customAlphabet(alphabett, 6);
  const random = urlId();

  if (validateUrl(defaultUrl)) {
    try {
      const findUrl = await db.findOne({ defaultUrl });
      if (findUrl) {
        res.status(200).send(findUrl.shortUrl);
      } else {
        const shortUrl = `${process.env.BASE}/${random}`;
        const urlObject = {
          uid: random,
          defaultUrl,
          shortUrl,
        };
        const insert = await db.insertOne(urlObject);
        if (insert.acknowledged) {
          res.send(shortUrl);
        }else{
          res.send("unable to shorten link");
        }
      }
    } catch (err) {
      res.status(500).json(err);
    }
  } else {
    res.status(500).json("Invalid url");
  }
}
