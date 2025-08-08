const { MongoClient } = require("mongodb");

const url =
  "mongodb+srv://prashant:GxVj1c43rG1NjtOq@appbuilder.phgfylh.mongodb.net/";

const client = new MongoClient(url);

const dbName = "Test";

async function main() {
  await client.connect();
  console.log("Connect successfully to MongoDB");
  const db = client.db(dbName);
  const collection = db.collection("User");

  // INSERT
  const data = {
    firstname: "Nidhi",
    lastname: "Gupta",
    city: "Banaras",
  };

  const insertResult = await collection.insertMany([data]);
  console.log("Inserted document ->", insertResult);

  // READ
  const findResult = await collection.find({}).toArray();
  console.log("Found documents ->", findResult);

  return "Done.";
}

main()
  .then(console.log)
  .catch(console.error)
  .finally(() => client.close());
