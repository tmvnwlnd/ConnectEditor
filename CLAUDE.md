# Editor Project

## Overview

A partner newsroom article editor for KPN — a 3-step wizard (Setup → Editor → Settings) built with Vite + React. Pure JavaScript, no TypeScript. Uses Trumbowyg for WYSIWYG editing, localStorage for persistence, and no backend/API.

## TEAMKPN publishing prototype (branch `teamkpn`; the partner-platform version is branch `partner-nieuws`)

This branch is the publishing side of the TEAMKPN "Channel Feeds" prototype (repo `../Channel Personalisatie - TEAMKPN voor jou/teamkpn-voor-jou`).
- **Taxonomy = TEAMKPN's own.** `src/data/teamkpn/{taxonomy,feeds}.json` are COPIES synced by `node scripts/sync-teamkpn-data.mjs` (re-run when the
  taxonomy changes there; the copies are committed because this repo's Netlify build doesn't have the other repo). `config/publishingTargeting.js`
  builds on them: channels CCO / Monteurs / Zakelijke markt (taxonomy cs+retail → cco, cd → monteurs, zm → zakelijk), all doelgroepen, and the
  topic feeds (exported as `SKILLS` + `FEEDS`), plus `GROUPS` (channel group CCO + every doelgroep) and `PRIORITIES` (3 standaard / 2 belangrijk / 1 kritiek, SoW F3).
- **The publishing steps follow the client docs (brief + SoW) — THREE steps:** step 1 = group (preset CCO, J5), channels (≥1) and PER CHANNEL its
  feeds (≥1 each, G1; `feedsByChannel`, `feeds` = their union); step 2 = the editor; step 3 = Publiceren, two TABS: "Publiceren" (plaatsen,
  sluiten, AI-samenvatting on/off + editable text (E1, mock: starts as the intro), voorlezen on/off (E6), up to 3 related articles (B3, from
  `src/data/teamkpn/articles-index.json`)) and "Targeting" (`TargetingFields` in `ArticleTargeting.jsx`: organisatiebreed, doelgroepen within
  the step-1 channels, priority). `/targeting` redirects to `/settings`. Nieuw-vs-update (B4) was REMOVED (Tom: to be solved differently).
  "Vraag Judith" is switched off (`JUDITH_ENABLED` in `ds/JudithButton.jsx`). Field rule: fewer than 5 options → checkboxes/radios, otherwise a
  dropdown (`publishing/ChoiceField.jsx`). Teasers (`ArticleTeaser`: stacked / horizontal; the preview no longer shows the row) are ports of the prototype's ArticleTile.
  All partner-platform leftovers (RoutIT/KPN Excellence block visibility, the old preview, the icon picker) are removed from this branch.
- **Block targeting = one audience per block, no versions.** A block is for everyone, or for ONE group: `element.targeting =
  { doelgroepen, feeds }` (by NAME; `null`/absent = everyone). Within it everything is OR: in one of the doelgroepen OR following one of the
  feeds. The rail's people button / the green `AudienceTab` above the block open `BlockTargetingModal` straight on the two
  pickers; saving with nothing picked = everyone). Old `versions` data is migrated on load (`migrateVersions` in `config/targeting.js`: the first targeted version wins).
- **Voorvertoning = the TEAMKPN article page, rebuilt here.** `components/TeamkpnPreview.jsx` converts the editor's state with
  `utils/toTeamkpnArticle.js` (block mapping documented there) and renders it with `components/teamkpn/TeamkpnArticle.jsx` + `.css` —
  a port of the prototype's ArticleDetail on THIS app's design system (tokens, icons, KPN font): close, not pixel-identical. No
  other app is involved. Targeted blocks always show open with a green audience label. Publishing to the prototype is NOT planned — the apps stay separate.
- **FAQ block** (`faq`, `content/FaqContent.jsx`, under "Tekst"): optional title + question/answer pairs → a heading + accordion in TEAMKPN.
  Every editor block now maps to a matching TEAMKPN block (attachment, carousel, banner, video, audio, table — see `toTeamkpnArticle.js`).

## Architecture

- **State management**: React `useState` only, no Context or Redux
- **Data owner**: `ArticleBuilder.jsx` holds the `elements[]` array and passes handlers down through `ArticleCanvas` → `Element`/`DoubleColumnElement` → `ElementWrapper` → content components
- **Element type system**: `src/config/elementTypes.js` is the single source of truth mapping element types to their config and React components
- **Persistence**: Four `localStorage` keys — `articleSetupData`, `articleElements`, `articleTargetingData`, `articleSettingsData`
- **Styling**: Pure CSS with design tokens in `src/styles/tokens.css`. No CSS-in-JS or Tailwind.
- **AI feature ("Judith")**: Fully designed UX with mock responses. No real LLM/API connected.
- **Deployment**: Netlify (SPA redirect in `netlify.toml`)

## Key Data Shapes

Element content is **polymorphic** — the shape depends on the element `type`:
- Text types (`header`, `paragraph`): raw HTML string
- `citation`: `{ quote: string, person: string }`
- `image`: `{ image: string, altText: string, caption: string, sourceType?: string }`
- `table`: `{ rows: number, columns: number, data: string[][], hasColumnHeader: boolean, hasRowHeader: boolean }`
- `audio`: `{ audio: string, title: string, fileName: string, fileType: string, sourceType: string }`
- `video`: `{ video: string, caption: string, sourceType?: string }`
- `attachment`: `{ attachment: string, fileName: string, originalFileName: string, fileSize: string, fileType: string, sourceType: string }`
- `carousel`: `{ images: Array<{ id: number, image: string, altText?: string, caption: string }> }`

Double-column elements use `leftContent` / `rightContent` instead of `content`, plus a `swapped` boolean.

## Development Rules

- Always use `!important` when overriding Trumbowyg CSS (see `.claude/DEVELOPMENT_GUIDELINES.md`)
- All colors must use design tokens from `src/styles/tokens.css` — no hardcoded values
- Tooltips use tippy.js exclusively — no custom CSS tooltips

---

## Backlog

### 1. TypeScript Migration — Phase 1 Complete (type layer)
**Status**: Type foundation is in place. All existing `.js`/`.jsx` files continue to work unchanged.

**What's done**:
- `tsconfig.json` with `allowJs: true` — `.ts` and `.jsx` coexist
- `src/types/` — complete type definitions:
  - `content.ts` — all 9 content block shapes (Header, Paragraph, Citation, Image, Table, Audio, Video, Attachment, Carousel)
  - `elements.ts` — discriminated union for single + double column elements, with type guards
  - `article.ts` — full Article model (Setup + Content + Settings), database-agnostic
  - `elementConfig.ts` — element type registry types
  - `validation.ts` — validation function signatures + file upload constraints
  - `index.ts` — barrel export

**Next steps (Phase 2)**:
- Convert data-heavy files first: `elementTypes.js`, `ArticleBuilder.jsx`, content components
- Convert remaining components incrementally (design system components are lower priority)

**Open questions (backend)**:
- Backend technology choice (Node.js? Next.js?) — determines if types can be shared across frontend/backend
- Database choice (PostgreSQL vs MongoDB vs other) — affects data model normalization
- API design (REST vs GraphQL)
- Authentication model
- Media storage strategy (S3, Cloudflare R2, etc.) for images/audio/attachments (currently blob URLs)

### 2. Optimize JSON Output
**Goal**: Ensure the article JSON that the editor produces is clean, minimal, and suitable for consumption by a CMS or rendering pipeline.

**Considerations**:
- Strip unnecessary/transient fields (e.g., `sourceType` for browser-only blob URLs)
- Normalize HTML content from Trumbowyg (strip empty tags, normalize whitespace)
- Define a stable, versioned output schema
- Consider whether double-column `swapped` should be represented differently
- Validate output conforms to schema before export

### 3. Form Validation
**Goal**: Add consistent, accessible form validation across all three wizard steps.

**Current state**: Validation is ad-hoc — `alert()` for file errors, `try/catch new URL()` for URL inputs, a localStorage check at publish time. No required-field validation on Step 1, no validation library, no accessible error announcements.

**Considerations**:
- Decide on approach: custom validation vs library (e.g., Zod for schema validation)
- Required fields: title (Step 1), at least one element (Step 2), channels + feeds (Step 1)
- Inline validation on text fields with error states
- Step-transition guards (prevent moving to next step with invalid data)
- Accessible error announcements (`aria-live`)
- Consolidate the `TextField` component situation (two versions exist: `src/components/TextField.jsx` and `src/components/ds/TextField.jsx`)

### 4. Functioning AI Feature (Judith)
**Goal**: Connect the Judith AI assistant to a real LLM backend so it produces actual writing suggestions.

**Current state**: Fully designed UI/UX with hardcoded mock responses in `JudithButton.jsx`. The `getAIResponse()` function returns from a static lookup table after a fake delay.

**Considerations**:
- Choose LLM provider and model (OpenAI, Anthropic, etc.)
- Design the API layer — the frontend needs an endpoint that accepts the article context + question type and returns a suggestion
- Context window strategy: what article content to send as context for each question type
- Streaming vs non-streaming responses
- Error handling and rate limiting
- Alt-text generation in `ImageContent` and `CarouselContent` is also mocked and needs the same treatment
