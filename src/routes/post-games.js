const db = require("../db.js");
const queries = require("../queries.js");

const {
    findGameId,
    insertPartnerGames,
} = queries;


async function getGameIdByLabelAndProvider(label, providerLabel) {

  const values = [label, providerLabel];

  const res = await db.query(findGameId, values);
  if (res.rows.length > 0) {
    return res.rows[0].game_id;
  } else {
    return null;
  }
}

const postGames = async (req, res) => {
  try {
    const { partnerId, games } = req.body;

    await db.query("BEGIN");

    for (const game of games) {
      const { externalGameId, label, provider, imgSrc, gameHref} = game;

      const gameId = await getGameIdByLabelAndProvider(label, provider);
      if (!gameId) {
        throw new Error(
          `Game not found for label ${label} and provider ${provider}`
        );
      }

      await db.query(insertPartnerGames, [partnerId, gameId, externalGameId, imgSrc, gameHref ]);
    }

    await db.query("COMMIT");

    res.status(201).send("Games created");
  } catch (error) {
    await db.query("ROLLBACK");
    console.error("Error inserting games: ", error);
    res.status(500).send("Internal Server Error");
  }
};

module.exports = postGames;