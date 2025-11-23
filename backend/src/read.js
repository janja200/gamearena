// read.js
import { MongoClient } from "mongodb";

const uri = "mongodb+srv://karanjarobert19_db_user:bM4XWcdJ23FyA0ci@cluster0.nsfyibc.mongodb.net/test2";
const client = new MongoClient(uri);

async function run() {
  try {
    await client.connect();
    console.log("🔗 Connected to MongoDB!");

    // Fetch all games
    const games = await client.db("test2").collection("games").find({}).toArray();

    if (games.length === 0) {
      console.log("ℹ️ No games found in the database.");
    } else {
      console.log("🎮 Games in database:");
      games.forEach((game, index) => {
        console.log(`${index + 1}. ${game.name} - ${game.description}`);
      });
    }
  } catch (err) {
    console.error("❌ Error:", err);
  } finally {
    await client.close();
  }
}

run();
