import { query } from "./db"

export type SupportRow = {
  id: string
  name: string
  message: string
  hearts: number
  anonymous: boolean
  created_at: string
}

export async function listSupport(): Promise<SupportRow[]> {
  return query<SupportRow>(
    `SELECT id, name, message, hearts, anonymous, created_at
     FROM support_messages ORDER BY id DESC LIMIT 200`,
  )
}

export async function insertSupport(
  name: string,
  message: string,
  anonymous: boolean,
): Promise<SupportRow> {
  const rows = await query<SupportRow>(
    `INSERT INTO support_messages (name, message, anonymous)
     VALUES ($1, $2, $3)
     RETURNING id, name, message, hearts, anonymous, created_at`,
    [name, message, anonymous],
  )
  return rows[0]
}

export async function heartSupport(id: string): Promise<SupportRow | null> {
  const rows = await query<SupportRow>(
    `UPDATE support_messages SET hearts = hearts + 1
     WHERE id = $1
     RETURNING id, name, message, hearts, anonymous, created_at`,
    [id],
  )
  return rows[0] ?? null
}
