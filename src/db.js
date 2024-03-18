const { pgConfig, pgAnalyticConfig } = require("./constants.js");
const { Pool } = require("pg");


const pool = new Pool(pgConfig);

const analyticPool = new Pool(pgAnalyticConfig);

module.exports = {
  pool,
  analyticPool,
};
