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

  //   getRandomGames: `
  //     SELECT DISTINCT ON (g.game_id)
  //         g.*
  //     FROM games g
  //         INNER JOIN partner_games pg ON g.game_id = pg.game_id AND pg.state = 'enabled'
  //         INNER JOIN providers p ON g.provider_id = p.provider_id
  //     WHERE pg.partner_id = $1
  //     ORDER BY g.game_id, RANDOM()
  //     LIMIT 20;`,

  getRandomGames: `
    SELECT
        g.*,
        pg.img_src AS "imgSrc",
        pg.game_href AS "gameHref"
    FROM main.games g
        INNER JOIN main.partner_games AS pg ON g.game_id = pg.game_id AND pg.partner_id = $1 AND pg.state = 'enabled'
    ORDER BY RANDOM()
    LIMIT 20;`,

  getTag: `
        SELECT
            t.tag_id AS id,
            t.label
        FROM main.tags t
        WHERE
            LOWER(t.label) ~* LOWER($1);`,

  getTagsList: `
        SELECT
            t.tag_id AS id,
            t.label
        FROM main.tags t;`,

  getTheme: `
        SELECT
            t.theme_id AS id,
            t.label
        FROM main.themes AS t
        WHERE
            LOWER(t.label) ~* LOWER($1);`,

  getThemesList: `
        SELECT
            t.theme_id AS id,
            t.label
        FROM main.themes t;`,

  getRandomGame: `
        SELECT
            gambler_id,
            external_game_id AS "externalGameId",
            MAX(value) AS value
        FROM
            xaxaton_analytics.main.gamblers_preference
        LEFT JOIN
            xaxaton_analytics.main.games
        ON
            game_id = external_game_id
        LEFT JOIN
            (
                SELECT
                    gambler_id,
                    external_game_id,
                    MAX(end_datetime) AS end_datetime
                FROM
                    xaxaton_analytics.main.gamblers_clicks
                GROUP BY
                    1, 2
            ) AS t
        USING
            (gambler_id, external_game_id)
        WHERE
            gambler_id = $1
            /*tagIds*/
            /*themeIds*/
            AND (end_datetime IS NULL OR CURRENT_TIMESTAMP - end_datetime >= '10 days')
        GROUP BY
            1, 2
        ORDER BY
            3 DESC
        LIMIT 2;
    `,

  getGame: `
        SELECT
            g.*,
            pg.external_game_id AS "externalGameId",
            pg.img_src AS "imgSrc",
            pg.game_href AS "gameHref"
        FROM main.games g
            INNER JOIN main.partner_games pg USING (game_id)
        WHERE
            pg.external_game_id = $1;`,

  insertGamblerClick: `
    INSERT INTO main.gamblers_clicks(gambler_id, partner_id, external_game_id, action)
    VALUES ($1, $2, $3, $4);`,

  getPopularGame: `
    WITH aggregated_data AS (
        SELECT 
            external_game_id,
            COUNT(DISTINCT gambler_id) AS gamblers_cnt,
            AVG(time) AS time
        FROM 
            xaxaton_analytics.main.df_agg
        GROUP BY 
            external_game_id
    ), ranked_games AS (
        SELECT 
            external_game_id,
            ROW_NUMBER() OVER(ORDER BY gamblers_cnt DESC) AS r1,
            ROW_NUMBER() OVER(ORDER BY time DESC) AS r2
        FROM 
            aggregated_data
    ), last_gambler_click AS (
        SELECT 
            gambler_id,
            external_game_id,
            MAX(end_datetime) AS end_datetime
        FROM 
            xaxaton_analytics.main.gamblers_clicks
        GROUP BY 
            gambler_id, external_game_id
    )
    SELECT 
        rg.external_game_id,
        rg.r1 + rg.r2 AS summary
    FROM 
        ranked_games rg
    LEFT JOIN 
        last_gambler_click lgc ON rg.external_game_id = lgc.external_game_id
    LEFT JOIN 
        xaxaton_analytics.main.games g ON rg.external_game_id = g.game_id
    WHERE 
        (lgc.end_datetime IS NULL OR CURRENT_TIMESTAMP - lgc.end_datetime >= INTERVAL '10 days')
        /*tagIds*/
        /*themeIds*/
    ORDER BY 
        summary
    LIMIT 1;`,

  getCompletelyRandomGame: `
    SELECT
        pg.external_game_id AS "externalGameId"
    FROM
        main.games AS g
        INNER JOIN main.partner_games AS pg ON g.game_id = pg.game_id AND pg.partner_id = $1
    LIMIT 1;`,
};
