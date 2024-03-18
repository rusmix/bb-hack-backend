const { analyticPool } = require("../db.js");
const queries = require("../queries.js");

const { insertGamblerClick } = queries;

const postGamblerClick = async (req, res) => {
    console.log('postGamblerClick');
  const { body } = req;
  if (
    !body.gamblerId ||
    !body.action ||
    !body.externalGameId ||
    !body.partnerId
  )
    return res.status(500).send({ error: "body validation fault" });

  await analyticPool.query(insertGamblerClick, [
    body.gamblerId,
    body.partnerId,
    body.externalGameId,
    body.action,
  ]);

  return res.status(200).send({message: 'click saved'});
};

module.exports = postGamblerClick;
