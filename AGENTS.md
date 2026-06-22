# AGENTS.md — elsaiot-semhas-web

Web Tugas Akhir (TanStack Start + shadcn, pixel theme). Parallel-agent build.

## CONTRACT (WAJIB semua agent)

1. **HANYA edit file di folder ownership-mu.** Dilarang sentuh file agent lain.
2. **JANGAN edit**: `src/styles.css`, `package.json`, `src/routeTree.gen.ts`,
   `src/lib/*` (shared, read-only), `src/data/*` (shared, read-only).
3. **NO COMMENTS** di kode. Sama sekali. Self-documenting names.
4. Lapor progres ke `PROGRESS.md` (append section-mu, jangan overwrite section lain).
5. Pakai token + helper dari `styles.css` + komponen `src/components/ui/*`.
6. State global lewat `src/lib/store.ts` (Zustand). Jangan bikin store baru.
7. Bunyi lewat `useSfx()` dari `src/lib/sfx.ts`.

## SHARED (read-only, sudah jadi)

- `src/lib/types.ts` — semua tipe
- `src/lib/store.ts` — Zustand `useAppStore`
- `src/lib/sfx.ts` — `useSfx()`
- `src/lib/session.ts` — `validateName`, `loadSession`, `saveSession`
- `src/lib/config.ts` — `getConfig()`
- `src/data/qa.ts` — data tanya-jawab
- `src/data/game.ts` — data game
- `src/styles.css` — token + helper (`.pixel-card`, `.pixel-press`,
  `.pixel-hover`, `.scanline`, `.blink`, anim `pixel-*`)

## OWNERSHIP MAP (Wave 1)

| Agent | Owns |
|-------|------|
| Shell | `src/routes/__root.tsx`, `src/components/shell/*` |
| Home | `src/routes/index.tsx`, `src/routes/berkas/index.tsx`, `src/routes/tanya/index.tsx`, `src/routes/interaktif/index.tsx`, `src/components/home/*` |
| Berkas | `src/routes/berkas/paparan.tsx`, `src/routes/berkas/makalah.tsx`, `src/routes/berkas/laporan.tsx`, `src/components/berkas/*` |
| Tanya | `src/routes/tanya/forum.tsx`, `src/routes/tanya/chatbot.tsx`, `src/components/tanya/*` |
| Interaktif | `src/routes/interaktif/game.tsx`, `src/routes/interaktif/dukungan.tsx`, `src/components/game/*`, `src/components/dukungan/*` |
| Onboarding | `src/components/onboarding/*` |

## ROUTE TREE

```
/                       home (3 grup card + zoom)
/berkas                 submenu berkas
/berkas/paparan         deck PPT embed + fullscreen
/berkas/makalah         PDF viewer (react-pdf)
/berkas/laporan         PDF viewer + LOCK (config.laporanUnlocked)
/tanya                  submenu tanya-jawab
/tanya/forum            accordion QA (search/filter/tandai siap)
/tanya/chatbot          QA-pairing palsu (pilih Q, no ketik)
/interaktif             submenu interaktif
/interaktif/game        beri makan diskus + leaderboard
/interaktif/dukungan    wall + modal/drawer (anonim opsi)
```

## STYLE

- Light pixel, biru muda. Font `--font-pixel` (judul/label), `--font-body` (teks).
- Centered shell max ~780px. Card-hub nav (bukan navbar). Wipe transition.
- Tiap subhalaman ada tombol back ke home/submenu.
- Responsive + `prefers-reduced-motion` dihormati (sudah di css global).

## VERIFY

- `bun run dev` jalan, `bun run build` lolos, 0 TS error.
- No comments. Ownership dipatuhi.

## SYNC QUALITY RULES (anti AI-slop, WAJIB)

Ini situs pribadi Naufal. Harus terasa buatan manusia, bukan AI.

1. **DILARANG emoji.** Semua ikon pakai `lucide-react` (sudah terpasang). Tidak ada emoji di teks/UI/data.
2. **DILARANG em-dash (—).** Pakai koma, titik, atau tanda hubung biasa "-".
3. **No AI-slop phrasing.** Hindari "Selamat datang di dunia...", "Mari kita jelajahi", "tingkatkan pengalaman", kalimat marketing kosong, exclamation berlebih. Bahasa lugas, personal, secukupnya.
4. **Konsistensi layout.** Semua halaman: shell tengah, back button posisi sama, judul pixel, spacing sama, card style sama (`.pixel-card`). Submenu pakai komponen Home (`SubMenu`/`HubCard`).
5. **Copy Indonesia, nada pribadi** ("saya", "punya saya"), bukan korporat.
6. **Halaman not-found + error = stylized pixel** (foundation sediakan `NotFound` + `ErrorState`). Jangan bikin versi sendiri yang beda gaya.
7. Angka/loading/empty/error state semua bergaya pixel konsisten.
