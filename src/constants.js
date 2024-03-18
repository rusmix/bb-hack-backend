require("dotenv").config();

const pgConfig = {
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  database: process.env.PG_DATABASE,
  password: process.env.PG_PASSWORD,
  port: process.env.PG_PORT,
};

const pgAnalyticConfig = {
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  database: 'xaxaton_analytics',
  password: process.env.PG_PASSWORD,
  port: process.env.PG_PORT,
};

const getFilters = (req) =>
  typeof req.query.filters === "string"
    ? JSON.parse(req.query.filters)
    : req.query.filters;

const gameMock = JSON.parse(`{
      "game_id": "166",
      "provider_id": "19",
      "label": "The Cipollino",
      "config": null,
      "scatter": true,
      "bonus_game": null,
      "bonus_game_purchase": null,
      "free_spins": true,
      "wild_symbol": true,
      "wild_multiplier": true,
      "gamble_feature": true,
      "auto_play": true,
      "rtp_percentage": null,
      "volatility": "low",
      "max_win_multiplier": 5000,
      "min_bet": 0.15,
      "max_bet": 45,
      "coins_per_line": 1,
      "number_of_reels": 5,
      "number_of_lines": 243,
      "imgSrc": "http://localhost:8082/image/guse.jpeg",
      "gameHref": "http://google.com"
    }`);

module.exports = {
  getFilters,
  pgConfig,
  pgAnalyticConfig,
  gameMock,
};
