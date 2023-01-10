// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { MongoClient, ServerApiVersion } from "mongodb";

const MONGODB_URI = process.env.MONGO_URI;
const MONGODB_DB = process.env.MONGO_DB;

if (!MONGODB_URI) {
  throw new Error("Add Mongo URI to .env.local");
}

if (!MONGODB_DB) {
  throw new Error("Define the MONGODB_DB environmental variable");
}

const opts = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
};

const client = new MongoClient(MONGODB_URI, opts);
const clientPromise = client.connect();

export default clientPromise;
