# PROGRESS.md

Tracking parallel-agent build. Wave 0 + Wave 1 selesai (orchestrator finalize).

## Wave 0 - Foundation (DONE)

- deps: react-pdf, pdfjs-dist, zustand, @fontsource/press-start-2p, @fontsource/vt323
- styles.css: token pixel biru + font + helper (.pixel-card/.pixel-press/.pixel-hover/.scanline/.blink)
- lib: types, store (Zustand), sfx, session, config
- data: qa, game
- feedback: NotFound + ErrorState (wired ke router.tsx)
- shadcn ui: button dialog drawer accordion input textarea badge sonner scroll-area separator
- AGENTS.md kontrak + anti-slop rules

## Wave 1 - Features (DONE)

### Shell
- __root.tsx wired ke AppShell
- AppShell, AquariumBg, BootGate, NameGate, FloatingDock
- status: done

### Home
- index.tsx (3 grup card + zoom + data-tour attrs)
- berkas/index, tanya/index, interaktif/index (SubMenu)
- HubCard, HubGrid, SubMenu, lib/transition
- status: done

### Berkas
- berkas/paparan (deck embed), makalah + laporan (PDF react-pdf, lock)
- PdfViewer, DeckEmbed, LockScreen
- status: done

### Tanya
- tanya/forum (accordion QA search/filter/siap)
- tanya/chatbot (QA-pairing, no ketik, typewriter)
- QaAccordion, FilterChips, ChatBubble (emoji -> lucide), useTypewriter
- status: done

### Interaktif
- interaktif/game (beri makan diskus + leaderboard)
- interaktif/dukungan (wall + modal/drawer + anonim)
- useFeedGame, Tank, Leaderboard, GamePageBody
- SupportWall, SupportComposer, useMediaQuery
- status: done

### Onboarding
- OnboardingTour (portal spotlight), useTour, steps
- wired di AppShell, target data-tour di home
- status: done

## Verify
- bunx tsc --noEmit: 0 error
- bunx vite build: exit 0
- next: dev smoke test + copy PDF/deck assets + responsive sync review

## Wave 3 - Backend (DONE + verified)

- server/: validation, db, support.repo, game.repo, bus (SSE pub/sub), rateLimit, index (Hono)
- frontend: lib/api, lib/useRealtime (SSE), store realtime methods, dukungan/game/chat wired to API
- vite proxy /api -> :8080
- Dockerfile.api + docker-compose.yml (web + api + postgres)
- nginx proxies /api -> api:8080 (SSE-safe: buffering off)

### Verified (local docker, manual QA)
- validation: gibberish/keyboard-mash/profanity/angka rejected; anon ok
- anti-cheat: score >100000 rejected
- race: 10 concurrent hearts -> atomic SQL + rate-cap = 3 (no race)
- rate-limit: 8 rapid posts -> 201,201,429x6
- SSE: chat:new + presence events stream live
- guestbook upsert: dup name no error
- full stack via nginx (web->api->db) all 200, support post/list/config/pdf/ppt OK

## Wave 4 - Deploy (PENDING - needs user infra)
- Dokploy: 3 services (web/api/db) or compose stack, env, domain semhas-nau.nrflabs.net + HTTPS
- Umami tracking

## Umami tracking (DONE + verified local)

- compose: umami + umami-db (own postgres) added
- entrypoint config.js now injects umamiSrc + umamiWebsiteId from env
- main.tsx loads umami script if config present (lib/config + AppConfig type extended)
- verified local: full stack (web+api+db+umami+umami-db) all Up
  - login admin/umami OK, website created (id d58a977f-...)
  - config.js injects umamiSrc + websiteId
  - script.js 200, /api/send pageview ingest 200
- prod env needed: UMAMI_SRC, UMAMI_WEBSITE_ID, UMAMI_APP_SECRET, UMAMI_DB_PASSWORD
