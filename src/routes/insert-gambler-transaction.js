const Joi = require("joi");
const db = require("../db.js");
const queries = require("../queries.js");

const { insertGamblerTransaction: insertGamblerTransactionQuery } = queries;

const transactionSchema = Joi.object({
  gambler_id: Joi.number().integer().positive().required(),
  partner_id: Joi.number().integer().positive().required(),
  external_game_id: Joi.number().integer().positive().required(),
  type: Joi.string().valid("bet_in", "bet_out").required(),
  usd_amount: Joi.number().positive().required(),
  end_datetime: Joi.date().iso().required(),
});

function validateTransaction(data) {
  const { error } = transactionSchema.validate(data, { abortEarly: false });
  if (error) {
    const message = error.details.map((detail) => detail.message).join(", ");
    return { isValid: false, message };
  }
  return { isValid: true };
}

const insertGamblerTransaction = async (req, res) => {
  const { isValid, message } = validateTransaction(req.body);

  if (!isValid) {
    return res.status(400).send(message);
  }

  const {
    gambler_id,
    partner_id,
    external_game_id,
    type,
    usd_amount,
    end_datetime,
  } = req.body;

  try {
    const { rows } = await db.query(insertGamblerTransactionQuery, [
      gambler_id,
      partner_id,
      external_game_id,
      type,
      usd_amount,
      end_datetime,
    ]);

    res.status(201).json({
      message: "Transaction created",
      transactionId: rows[0].transaction_id,
    });
  } catch (error) {
    console.error("Error creating transaction:", error);
    res.status(500).send("Internal Server Error");
  }
};

module.exports = insertGamblerTransaction;
