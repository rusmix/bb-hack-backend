const { pool } = require("../db.js");
const queries = require("../queries.js");
const { getFilters } = require("../constants.js");

const { getRandomGames: getRandomGamesQuery } = queries;

const getRandomGames = async (req, res) => {
  const filters = getFilters(req);

  console.log(filters);

  if (!filters || !filters.partnerId) {
    return res.status(400).send("Invalid filters");
  }

  const { partnerId, country } = filters;

  const result = await pool.query(getRandomGamesQuery, [partnerId]);

  return res.send(result.rows);
};

module.exports = getRandomGames;
