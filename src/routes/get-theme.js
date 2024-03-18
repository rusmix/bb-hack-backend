const { pool } = require("../db.js");
const queries = require("../queries.js");

const { getTheme, getThemesList } = queries;

const getOneTheme = async (req, res) => {
  const theme = req.query.value;
  if (!theme || !theme.length) {
    const themeResult = await pool.query(getThemesList);

    return res.send(themeResult.rows);
  }

  const themeResult = await pool.query(getTheme, [theme]);

  return res.send(themeResult.rows);
};

module.exports = getOneTheme;
