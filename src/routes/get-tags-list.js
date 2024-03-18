const db = require("../db.js");
const queries = require("../queries.js");

const { getTags } = queries;

const getTagsList = async (req, res) => {
  const tagsResult = await db.query(getTags);

  return res.send(tagsResult.rows);
};

module.exports = getTagsList;
