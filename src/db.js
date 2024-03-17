const { pgConfig } = require("./src/constants");
const { Pool } = require("pg");

const pool = new Pool(pgConfig);

module.exports = pool;