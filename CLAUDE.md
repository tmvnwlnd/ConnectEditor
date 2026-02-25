# Editor Project

## Overview

A partner newsroom article editor for KPN — a 3-step wizard (Setup → Editor → Settings) built with Vite + React. Pure JavaScript, no TypeScript. Uses Trumbowyg for WYSIWYG editing, localStorage for persistence, and no backend/API.

## Architecture

- **State management**: React `useState` only, no Context or Redux
- **Data owner**: `ArticleBuilder.jsx` holds the `elements[]` array and passes handlers down through `ArticleCanvas` → `Element`/`DoubleColumnElement` → `ElementWrapper` → content components
- **Element type system**: `src/config/elementTypes.js` is the single source of truth mapping element types to their config and React components
- **Persistence**: Three `localStorage` keys — `articleSetupData`, `articleElements`, `articleSettingsData`
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
- Required fields: title (Step 1), at least one element (Step 2), doelgroepen + partners (Step 3)
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
- Icon suggestions in `IconPicker` ("Judith adviseert") is also mocked
