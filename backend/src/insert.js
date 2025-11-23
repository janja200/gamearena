// insert.js
import { MongoClient } from "mongodb";

const uri = "mongodb+srv://karanjarobert19_db_user:bM4XWcdJ23FyA0ci@cluster0.nsfyibc.mongodb.net/test2";
const client = new MongoClient(uri);

async function run() {
  try {
    await client.connect();

    const game = {
      name: "Dino Dash",
      description: "Endless runner dinosaur game where players jump over obstacles and compete for the highest score.",
      gameType: "ARCADE",
      level: "BEGINNER",
      minPlayers: 1,
      maxPlayers: 2,
      minPlayTime: 10,
      maxPlayTime: 20,
      minEntryFee: 100,
      isPopular: true,
      imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3b/Chromium_T-Rex-error-offline.svg/230px-Chromium_T-Rex-error-offline.svg.png",
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
      competitions: []
    };

    await client.db("test2").collection("game").insertOne(game);
    console.log("✅ Game added successfully!");
  } catch (err) {
    console.error("❌ Error:", err);
  } finally {
    await client.close();
  }
}

run();

