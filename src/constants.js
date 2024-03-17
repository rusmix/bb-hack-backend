require("dotenv").config();

const pgConfig = {
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  database: process.env.PG_DATABASE,
  password: process.env.PG_PASSWORD,
  port: process.env.PG_PORT,
};

const getFilters = (req) =>
  typeof req.query.filters === "string"
    ? JSON.parse(req.query.filters)
    : req.query.filters;

module.exports = {
  getFilters,
  pgConfig,
};
