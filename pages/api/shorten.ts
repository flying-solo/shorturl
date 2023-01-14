import clientPromise from "../../util/mongodb";
import { NextApiResponse, NextApiRequest } from "next";
import { customAlphabet } from "nanoid";
import { urlValidate } from "../../util/validate";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const defaultUrl = req.body.url;
  try {
    const ifTrue = await urlValidate.isValid({ url: defaultUrl });
    if (ifTrue) {
      const client = await clientPromise;
      const db = client.db("URLDATA").collection("shortenUrl");

      const alphabets = "abcdefghijklmnopqrstuvwxyz";
      const urlId = customAlphabet(alphabets, 6);
      const random = urlId();

      const findUrl = await db.findOne({ defaultUrl });
      if (findUrl) {
        res.status(200).send(findUrl.shortUrl);
      } else {
        const ifShort = await db.findOne({ shortUrl: defaultUrl });
        if (ifShort) {
          res.send(defaultUrl);
        } else {
          const shortUrl = `${process.env.BASE}/${random}`;
          const urlObject = {
            uid: random,
            defaultUrl,
            shortUrl,
          };
          await db.insertOne(urlObject);
          res.status(200).send(shortUrl);
        }
      }
    } else {
      throw { stausCode: 500, message: "Invalid Url" };
    }
  } catch (err) {
    res.status(500).json(err);
  }
}
