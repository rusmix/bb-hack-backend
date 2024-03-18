const getGamesList = require("./get-games-list.js");
const getRandomGame = require("./get-random-game.js");
const postGames = require("./post-games.js");
const insertGamblerTransaction = require("./insert-gambler-transaction.js");
const updateGameState = require("./update-game-state.js");

const getTag = require("./get-tag.js");
const getTagsList = require("./get-tags-list.js");
const getTheme = require("./get-theme.js");
const getThemeList = require("./get-themes-list.js");

const postGamblerClick = require("./post-gambler-click.js");

module.exports = {
  postGames,
  getGamesList,
  getRandomGame,
  insertGamblerTransaction,
  updateGameState,
  getTag,
  getTagsList,
  getTheme,
  getThemeList,
  postGamblerClick,
};
