const db = require("../db.js");
const queries = require("../queries.js");

const { getThemes } = queries;

const getThemesList = async (req, res) => {
  const themesResult = await db.query(getThemes);

  return res.send(themesResult.rows);
};

module.exports = getThemesList;
