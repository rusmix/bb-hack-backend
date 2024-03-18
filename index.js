const express = require("express");
require("dotenv").config();
const path = require("path");
const app = express();
const cors = require("cors");
const {
  postGames,
  insertGamblerTransaction,
  updateGameState,
  getRandomGame,
  getGamesList,
  getTag,
  getTheme,
  postGamblerClick,
} = require("./src/routes");

const { gameMock } = require("./src/constants.js");

const port = process.env.EXPRESS_PORT || 3000;

app.use(express.json());
app.use(cors());
app.use("./src/images", express.static("images"));

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

app.post("/games", postGames);

app.put("/games/state", updateGameState);

app.post("/gamblers-transactions", insertGamblerTransaction);

app.get("/random-game", getRandomGame);

app.get("/random-game/mock", (req, res) => {
  return res.send(gameMock);
});

app.get("/random-games/list", getGamesList);

app.get("/image/:name", (req, res) => {
  const imageName = req.params.name;
  const imagePath = path.join(__dirname, "src/images", imageName);

  console.log(imagePath);

  res.sendFile(imagePath, (err) => {
    if (err) {
      console.log(err);
      res.status(404).send("Image not found");
    }
  });
});

app.get("/tags", getTag);

app.get("/themes", getTheme);

app.post("/gambler-click", postGamblerClick);
