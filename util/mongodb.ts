// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { MongoClient } from "mongodb";

const MONGODB_URI = process.env.MONGO_URI;
const MONGODB_DB = process.env.MONGO_DB;

if (!MONGODB_URI) {
  throw new Error("Add Mongo URI to .env.local");
}

if (!MONGODB_DB) {
  throw new Error("Define the MONGODB_DB environmental variable");
}

let client
let clientPromise: Promise<MongoClient>

client = new MongoClient(MONGODB_URI, {});
clientPromise = client.connect();

export default clientPromise;
