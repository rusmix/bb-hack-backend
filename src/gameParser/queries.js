module.exports = {
  insertGame: `
  INSERT INTO main.games
    (label, rtp_percentage, volatility, max_win_multiplier, min_bet, max_bet, coins_per_line, number_of_reels, number_of_lines, scatter, bonus_game, bonus_game_purchase, free_spins, wild_symbol, wild_multiplier, gamble_feature, auto_play)
  VALUES
    ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)
  RETURNING game_id;`,

  insertTags: `INSERT INTO main.tags (label)
  SELECT * FROM unnest($1::text[])
  ON CONFLICT (label) DO UPDATE SET label=EXCLUDED.label
  RETURNING tag_id;`,

  insertThemes: `INSERT INTO main.themes (label)
  SELECT * FROM unnest($1::text[])
  ON CONFLICT (label) DO UPDATE SET label=EXCLUDED.label
  RETURNING theme_id;`,

  insertProviders: `
  INSERT INTO main.providers (label)
  VALUES ($1)
  ON CONFLICT (label) DO UPDATE SET label=EXCLUDED.label
  RETURNING provider_id;
  `,

  insertTagsGames: `INSERT INTO main.games_tags (game_id, tag_id)
  VALUES ($1, unnest($2::bigint[]))
  ON CONFLICT DO NOTHING;`,

  insertThemesGames: `INSERT INTO main.games_themes (game_id, theme_id)
  VALUES ($1, unnest($2::bigint[]))
  ON CONFLICT DO NOTHING;`,
};
