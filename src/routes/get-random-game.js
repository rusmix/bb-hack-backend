const { analyticPool, pool } = require("../db.js");
const queries = require("../queries.js");
const { getFilters } = require("../constants.js");

const {
  getRandomGame: getRandomGameQuery,
  getGame,
  getPopularGame,
  getCompletelyRandomGame,
} = queries;

const replaceQueryStub = (query, stub, realCode) => {
  return query.replace(`/*${stub}*/`, realCode);
};

const getRandomGame = async (req, res) => {
  const filters = getFilters(req);

  console.log(filters);

  if (!filters || !filters.partnerId || !filters.gamblerId) {
    return res.status(400).send("Invalid filters");
  }

  const tagIds = filters.tagIds || [];
  const themeIds = filters.themeIds || [];

  const preparedValues = [filters.gamblerId];
  let preparedQuery = getRandomGameQuery;

  if (tagIds.length) {
    preparedQuery = replaceQueryStub(
      getRandomGameQuery,
      "tagIds",
      `AND tag_id = ANY($2::integer[])`
    );
    preparedValues.push(tagIds);
  }

  if (themeIds.length) {
    preparedQuery = replaceQueryStub(
      preparedQuery,
      "themeIds",
      `AND theme_id = ANY($3::integer[])`
    );
    preparedValues.push(themeIds);
  }

  console.log(preparedQuery, preparedValues);

  const selectedGameRes = await analyticPool.query(
    preparedQuery,
    preparedValues
  );
  const selectedGame = selectedGameRes.rows[0];

  console.log("selgame is", selectedGame);

  let gameInfo;
  let externalGameId;
  if (selectedGame) {
    externalGameId = selectedGame.externalGameId;
  } else {
    let preparedQuery = getPopularGame;
    const preparedValues = [];

    if (tagIds.length) {
      preparedQuery = replaceQueryStub(
        getPopularGame,
        "tagIds",
        `AND tag_id = ANY($1::integer[])`
      );
      preparedValues.push(tagIds);
    }

    if (themeIds.length) {
      preparedQuery = replaceQueryStub(
        preparedQuery,
        "themeIds",
        `AND theme_id = ANY($2::integer[])`
      );
      preparedValues.push(themeIds);
    }

    const popularGameRes = await analyticPool.query(
      preparedQuery,
      preparedValues
    );
    const popularGame = popularGameRes.rows[0];

    if (popularGame) {
      externalGameId = popularGame.externalGameId;
    } else {
      const randomGameRes = await analyticPool.query(getCompletelyRandomGame);
      const randomGame = randomGameRes.rows[0];
      externalGameId = randomGame.externalGameId;
    }
  }

  gameInfo = await pool.query(getGame, [externalGameId]);
  console.log(gameInfo.rows[0]);

  return res.send(gameInfo.rows[0]);
};

module.exports = getRandomGame;
