import { query } from "./db"

export type ScoreRow = {
  id: string
  name: string
  score: number
  rounds: number
  created_at: string
}

export async function topScores(limit = 10): Promise<ScoreRow[]> {
  return query<ScoreRow>(
    `SELECT id, name, score, rounds, created_at
     FROM game_scores ORDER BY score DESC, id ASC LIMIT $1`,
    [limit],
  )
}

export async function insertScore(
  name: string,
  score: number,
  rounds: number,
): Promise<ScoreRow> {
  const rows = await query<ScoreRow>(
    `INSERT INTO game_scores (name, score, rounds)
     VALUES ($1, $2, $3)
     RETURNING id, name, score, rounds, created_at`,
    [name, score, rounds],
  )
  return rows[0]
}

export type GuestRow = { id: string; name: string; created_at: string }

export async function upsertGuest(name: string): Promise<GuestRow> {
  const rows = await query<GuestRow>(
    `INSERT INTO guestbook (name) VALUES ($1)
     ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name
     RETURNING id, name, created_at`,
    [name],
  )
  return rows[0]
}

export async function listGuests(): Promise<GuestRow[]> {
  return query<GuestRow>(
    `SELECT id, name, created_at FROM guestbook ORDER BY id DESC LIMIT 200`,
  )
}
