const { pool } = require("../db.js");
const queries = require("../queries.js");

const { getTag, getTagsList } = queries;

const getOneTag = async (req, res) => {
  console.log("getOneTag");
  const tag = req.query.value;
  if (!tag || !tag.length) {
    const tagResult = await pool.query(getTagsList);

    return res.send(tagResult.rows);
  }

  const tagResult = await pool.query(getTag, [tag]);

  console.log("getOneTag res", tagResult.rows);
  return res.send(tagResult.rows);
};

module.exports = getOneTag;
