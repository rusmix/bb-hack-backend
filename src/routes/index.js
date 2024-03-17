const getGamesList = require("./get-games-list.js");
const getRandomGame = require("./get-random-game.js");
const postGames = require("./post-games.js");
const insertGamblerTransaction = require("./insert-gambler-transaction.js");
const updateGameState = require("./update-game-state.js");

module.exports = {
  postGames,
  getGamesList,
  getRandomGame,
  insertGamblerTransaction,
  updateGameState,
};
