module.exports = {
  findGameId: `
        SELECT
            g.game_id
        FROM main.games g
            INNER JOIN main.providers p ON g.provider_id = p.provider_id
        WHERE g.label = $1 AND p.label = $2;`,
  insertPartnerGames: `
        INSERT INTO main.partner_games
            (partner_id, game_id, external_game_id, img_src, game_href, state)
        VALUES
          ($1, $2, $3, $4, $5, 'enabled');`,
  updateGameState: `
    UPDATE
        main.partner_games
    SET
        state = CASE
            WHEN
                state = 'enabled'::main.GAME_STATE
            THEN
                'disabled'::main.GAME_STATE
            ELSE
                'enabled'::main.GAME_STATE
            END
        WHERE
            partner_id = $1
            AND external_game_id = $2;`,

  insertGamblerTransaction: `
    INSERT INTO gamblers_transactions
     (gambler_id, partner_id, game_id, external_game_id, type, usd_amount, end_datetime)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING transaction_id;`,

  getRandomGames: `
    SELECT DISTINCT ON (g.game_id)
        g.*
    FROM games g
        INNER JOIN partner_games pg ON g.game_id = pg.game_id AND pg.state = 'enabled'
        INNER JOIN providers p ON g.provider_id = p.provider_id
        INNER JOIN providers_countries pc ON p.provider_id = pc.provider_id AND pc.country = $1
    WHERE pg.partner_id = $2
    ORDER BY g.game_id, RANDOM()
    LIMIT 20;`,
};
