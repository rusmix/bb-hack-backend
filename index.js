const express = require("express");
require("dotenv").config();
const app = express();
const {
  postGames,
  insertGamblerTransaction,
  updateGameState,
} = require("./src/routes");

const port = process.env.EXPRESS_PORT || 3000;

app.use(express.json());

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

app.post("/games", postGames);

app.put("/games/state", updateGameState);

app.post("/gamblers-transactions", insertGamblerTransaction);

app.get("/random-game", (req, res) => {
  // Logic to fetch a random game
  res.send("Random game details");
});

app.get("/random-games/list", (req, res) => {
  // Logic to fetch a list of random games
  res.send("List of random games");
});
