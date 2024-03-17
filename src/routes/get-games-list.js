const db = require("../db.js");
const queries = require("../queries.js");
const {getFilters} = require("../constants.js");

const {getRandomGames: getRandomGamesQuery} = queries;

const getRandomGames = async (req, res) => {
  const filters = getFilters(req);

  if (!filters || !filters.partnerId || !filters.country) {
    return res.status(400).send("Invalid filters");
  }

  const {partnerId, country} = filters;

  db.query(getRandomGamesQuery, [country, partnerId])

};

module.exports = getRandomGames;
