import { MongoClient } from "mongodb";

// MONGODB_URI .env.local se aayega. Yahan kuch hardcode mat karna.
export function getClient() {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("MONGODB_URI is missing. Add it to .env.local and restart the server.");
  if (!global._mongoPromise) {
    // 8 sec mein fail ho jaye, 30 sec latka na rahe (Atlas IP block hone par yahi hota hai)
    global._mongoPromise = new MongoClient(uri, { serverSelectionTimeoutMS: 8000 }).connect().catch((e) => {
      global._mongoPromise = null; // agli baar fresh try ho
      throw e;
    });
  }
  return global._mongoPromise;
}

export async function getLeads() {
  const client = await getClient();
  return client.db(process.env.MONGODB_DB || "citeo").collection("leads");
}
