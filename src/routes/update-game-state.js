const db = require("../db.js");
const queries = require("../queries.js");

const { updateGameState: updateGameStateQuery } = queries;

const updateGameState = async (req, res) => {
  try {
    const { partnerId, externalGameId } = req.body;

    await db.query(updateGameStateQuery, [partnerId,, externalGameId]);

    res.status(201).send("Game state updated");
  } catch (error) {
    console.error("Error updating games: ", error);
    res.status(500).send("Internal Server Error");
  }
};

module.exports = updateGameState;
