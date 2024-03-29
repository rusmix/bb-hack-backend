const fs = require("fs");
const queries = require("./queries.js");
const db = require("../db.js");

const {
  insertGame: insertGameQuery,
  insertTagsGames,
  insertTags,
  insertThemesGames,
  insertThemes,
  insertProvider,
} = queries;

const convertBoolean = {
  Да: true,
  Нет: false,
};

const convertVolatility = {
  Высокая: "high",
  "Средне-высокая": "mid-high",
  Средняя: "mid",
  "Средне-низкая": "mid-low",
  Низкая: "low",
};

const readGamesFromFile = (filePath) => {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, (err, data) => {
      if (err) reject(err);
      else resolve(JSON.parse(data));
    });
  });
};

const floatType = "FLOAT";
const intType = "INT";

const parseNumbers = (value, type) => {
  if (type === floatType && !isNaN(value)) return parseFloat(value);

  if (type === intType && !isNaN(value)) return parseInt(value);

  return "";
};

const insertGame = async (client, gameData, providerId) => {
  const rtpPercentage = parseNumbers(
    gameData.details["Отдача (%):"].replace(" %", ""),
    "float"
  );
  const volatility = convertVolatility[gameData.details["Волатильность:"]];
  const maxWinMultiplier = parseNumbers(
    gameData.details["Макс выигрыш:"].replace(" xB", ""),
    floatType
  );
  const minBet = parseNumbers(
    gameData.details["Минимальная ставка ($€£₽):"],
    floatType
  );
  const maxBet = parseNumbers(
    gameData.details["Максимальная ставка ($€£₽):"],
    floatType
  );
  const coinsPerLine = parseNumbers(
    gameData.details["Монет на линию:"].split(" - ")[0],
    intType
  );
  const numberOfReels = parseNumbers(
    gameData.details["Количество барабанов:"],
    intType
  );
  const numberOfLines = parseNumbers(
    gameData.details["Количество Линий:"],
    intType
  );

  const scatter = convertBoolean[gameData.features["Скаттер:"]];
  const bonusGame = convertBoolean[gameData.features["Бонусная игра:"]];
  const bonusGamePurchase =
    convertBoolean[gameData.features["Покупка бонусной игры:"]];
  const freeSpins = convertBoolean[gameData.features["Фри спины:"]];
  const wildSymbol = convertBoolean[gameData.features["Дикий символ:"]];
  const wildMultiplier =
    convertBoolean[gameData.features["Множитель для Wild:"]];
  const gambleFeature =
    convertBoolean[gameData.features["Риск/Гембл/Удвоение:"]];
  const autoPlay = convertBoolean[gameData.features["Автоматическая игра:"]];

  const values = [
    gameData.name,
    rtpPercentage || null,
    volatility || null,
    maxWinMultiplier || null,
    minBet || null,
    maxBet || null,
    coinsPerLine || null,
    numberOfReels || null,
    numberOfLines || null,
    scatter || null,
    bonusGame || null,
    bonusGamePurchase || null,
    freeSpins || null,
    wildSymbol || null,
    wildMultiplier || null,
    gambleFeature || null,
    autoPlay || null,
    providerId,
  ];

  console.log(values);
  try {
    const res = await client.query(insertGameQuery, values);
    console.log(`game inserted: ${res.rows[0].game_id}\n`);
    return res.rows[0].game_id;
  } catch (err) {
    console.error("Error inserting game:", err.stack);
  }
};

const main = async () => {
  const client = await db.connect();
  try {
    const gamesData = await readGamesFromFile(
      "./src/gameParser/parsedData/games.json"
    );
    for (let i = 0; i < gamesData.length; i++) {
      const game = gamesData[i];

      const providerResult = await client.query(insertProvider, [
        game.details["Производитель автомата:"],
      ]);

      const providerId = providerResult.rows[0].provider_id;

      const gameId = await insertGame(client, game, providerId);
      if (!gameId) continue;

      const tagLabels = game.features["Тема игрового автомата:"];
      const tagIdsResult = await client.query(insertTags, [tagLabels]);
      const tagIds = tagIdsResult.rows.map((row) => row.tag_id);

      await client.query(insertTagsGames, [gameId, tagIds]);

      const themeLabels = game.features["Специальные функции (бонуски):"];
      const themeIdsResult = await client.query(insertThemes, [themeLabels]);
      const themeIds = themeIdsResult.rows.map((row) => row.theme_id);

      await client.query(insertThemesGames, [gameId, themeIds]);
    }
  } catch (err) {
    console.error("Failed to process games:", err);
  } finally {
    client.release();
  }
};

main();
