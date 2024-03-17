const db = require("../db.js");
const queries = require("../queries.js");
const {getFilters} = require("../constants.js");

const {} = queries;

const getRandomGame = async (req, res) => {
  const filters = getFilters(req);

  if (!filters || !filters.partnerId || !filters.gamblerId) {
    return res.status(400).send("Invalid filters");
  }
// send to analytics service
};

module.exports = getRandomGame;
