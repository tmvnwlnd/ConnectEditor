# Article editor — component audit

Branch `teamkpn`, 2026-11-20. Report only: nothing has been refactored. Line references are to the code as it was on that date.

## TL;DR

The block system has **three different implementations of "a block with chrome"**:

1. `Element` → `ElementWrapper` → `PositioningButtons` (single blocks)
2. `DoubleColumnElement` (double columns, with its own copy of the rail and header)
3. Hand-written markup inside `ArticleCanvas` (the fixed Header block)

Each one also stores its data in a different shape: `content`, `leftContent/rightContent/swapped`, and `articleSetupData` in localStorage. Almost every structural problem below comes from this. The fix is one generic `Block` shell that wraps a list of `ElementContent` children. Single blocks, double columns and the Header then become different configs of the same component.

---

## Findings, ranked by impact

### 1. Three copies of the block chrome (high)
- **Rail.** `DoubleColumnElement.jsx` (≈ lines 50–200) re-implements `PositioningButtons`: the same five tippy refs, the same Buttons, and swap added. It has no targeting button, no `dimmed` state and no `AudienceTab`, so double columns can't be targeted. That gap comes from the copy, not from a product decision.
- **Header row.** The icon + label row is written three times: `ElementWrapper` (`.element-header`), `DoubleColumnElement` (`.double-column-header`, which also colours the label green on focus while `ElementWrapper` doesn't), and `ArticleCanvas` (Header block, `ui-lock`). The three already look and behave slightly differently.
- **Focus colour.** `color={isFocused ? 'var(--kpn-green-500)' : 'var(--gray-400)'}` is repeated in 4 files.
- **Judith.** Only `ElementWrapper` can show Judith. `DoubleColumnElement` accepts `hasOtherText` and passes it to `ElementContent`, which then throws it away (`hasOtherText: _hasOtherText`). The Header block has no Judith at all. Whether combined blocks *should* have Judith is a design question. Right now the code can't support it either way.

### 2. Combined blocks aren't a model, they're special cases (high)
- The double-column data shape (`leftContent`, `rightContent`, `swapped`) is hard-coded to two slots. A Header with three inner blocks (image + kop + alinea) can't be expressed in it, so the Header lives outside `elements` altogether.
- `swapped` is a view flag that silently re-maps which handler writes which field (`onUpdateLeftActual = swapped ? onUpdateRight : …`). Swapping the stored order would be simpler and avoids that bug class.
- `elementHasText` in `ArticleCanvas` parses `element.type.split('-')` to find the inner types. It duplicates `DOUBLE_ELEMENT_TYPES[type].leftType/rightType` and breaks for `text-graphic` and for any future type name that contains a hyphen.
- `ArticleBuilder.addElement` and `addDoubleElement` are ~35 identical lines that differ only in the initial object. `updateElement(id, fieldOrData, value)` is overloaded: it replaces the whole object *or* patches one field, depending on whether `value` is undefined. `Element` uses the first form and targeting/double columns use the second.

### 3. Content editors copy props into state (high, causes stale UI)
`ImageContent`, `VideoContent`, `AudioContent`, `AttachmentContent`, `CarouselContent`, `TableContent` and `TextGraphicContent` all do `useState(content?.x)` and never re-sync. Any external change (docx import, Judith apply, duplicate, undo, swap) doesn't show up until the component remounts. `ArticleBuilder` works around this for the Header with a `_rev` counter used as a React `key` (line ~211). That workaround is the symptom. These editors should be controlled: read from `content`, write via `onChange({...content, x})`. Keep local state only for UI-only things (dragging, cell focus). `ParagraphContent`/`HeaderContent` (Trumbowyg) already re-sync through an effect and are fine.

### 4. localStorage scattered over 10+ files (medium-high)
`articleSetupData` is read or written directly in `ArticleBuilder`, `ArticlePlacement`, `ArticleSettings`, `ArticleSetup` (dead), `BlockTargetingModal`, `Layout` and `TeamkpnPreview`. `articleSettingsData`/`articleSettingsValid` are read or written in `ArticleSettings` and `Layout`. Every `JSON.parse(... || '{}')` is repeated inline, and some reads happen during render (for example `ArticleBuilder` line 17 parses on every render, not just the first). Several writers merge read-modify-write against localStorage instead of React state, which is how the Header and the docx import can race each other. Proposal: one `src/store/articleStore.js` (load/save/subscribe per key), plus a small `useArticleStore(key)` hook. `utils/errorReporter.js` and `utils/articleMode.js` already follow that kind of pattern.

### 5. Inconsistent props contract for content editors (medium)
| Editor | Accepts beyond `{content, onChange, isFocused}` |
|---|---|
| Header | `placeholder` |
| Paragraph | `placeholder` (frozen in `useState`, so changing the prop does nothing) |
| Image | `emptyLabel` |
| Table | `onDimPositioningButtons` (chrome concern leaking into content) |
| Faq | ignores `isFocused` |

`content` is a string for header/paragraph, an object everywhere else, and either one for citation (`Element.handleApplySuggestion` and `elementHasText` both branch on `typeof`). Proposal: one documented contract, `{ value, onChange, isFocused, slotProps }` where `slotProps` carries placeholder/emptyLabel. Each type also gets an `empty()` default and a `getText(value)` in `elementTypes.js`. That last one replaces `elementHasText` and the `switch(type)` blocks in `Element`.

### 6. Type-specific logic in the generic `Element` (medium)
`Element` hard-codes `showJudithButton = type === 'paragraph' || 'header' || 'citation'`, `getJudithContext()` and `handleApplySuggestion()` (h-level parsing, citation object shape). These belong in the type config (`judith: { context, apply(content, suggestion) }`). Then `Element` and a combined block could both use them.

### 7. Duplicate and dead components (medium, easy)
- **Icon.** Both `components/Icon.jsx` and `ds/Icon.jsx` are in use. `ImageContent` imports *both* (`Icon` and `Icon as DSIcon`). The root one is still used by `AIButton`, `ToggleButton`, `TextField`, `AIDropdown`, `IconButton`, `Tag`, `Button`, `ArticleSetup` and `AudioContent`.
- **TextField.** Content editors (`Image`, `Video`, `Audio`, `Attachment`, `Carousel`) import the **root** `TextField`, not `ds/TextField`. This conflicts with the "use DS field components" rule.
- **Button.** The root `Button.jsx` is only used by `Modal.jsx`. Everything else uses `ds/Button`.
- **Dropdown, Tag.** The root versions have no importers (`ds/index.js` imports its own).
- **No importers found** (simple grep on the basename; check before deleting): `TwoColumnWrapper` (+ its CSS), `ArticleSetup` (superseded by the Header block, but it still writes `articleSetupData`), `AIButton`, `AIDropdown`, `Dropdown`, `Tag`, `RadioGroup`, `TemplateListItem`, `TemplateModal`, `SaveStatus`.
- **Tooltips.** The tippy setup is copy-pasted in `PositioningButtons`, `DoubleColumnElement`, `TwoColumnWrapper` and `TableContent`. `TableContent` uses `document.querySelectorAll('.table-controls …')`, a global selector that also matches other tables' buttons. Proposal: one `useTooltip(ref, text)` hook or a `tooltip` prop on `ds/Button`.

### 8. Inline styles (low-medium)
The highest counts of `style={{…}}` are in `Showcase.jsx` (22, showcase only), `ImageContent`/`VideoContent` (7 each), `CarouselContent` (6) and `AudioContent` (4). Inside the editors these are mostly layout and colour values that belong in the CSS files next to them, using tokens.

### 9. Smaller notes
- `ArticleCanvas` defines `escapeHtml`/`htmlToText` and the `elementHasText` helper. These belong in `utils/`.
- `ArticleCanvas` still accepts `onImportDocx` (unused, `_onImportDocx`).
- `DoubleColumnElement` receives `elementId` but doesn't declare it.
- IDs are `Date.now()`, so a quick double-add can collide.

---

## Proposed target structure

```
config/blockTypes.js        // single source: per element type → label, icon, Editor, empty(), getText(), judith?
                             // per block type → { label, icon, slots: [elementType…], actions: {swap?, target?, locked?} }
store/articleStore.js        // all localStorage keys, load/save/subscribe; useArticle() hook
components/block/
  Block.jsx                  // the ONE shell: rail + header row (icon, label, Judith slot) + AudienceTab + body
  BlockRail.jsx              // today's PositioningButtons, actions driven by config (swap, target, locked = none)
  BlockHeader.jsx            // icon + label + right-side slot; focus colouring in CSS, not props
  BlockBody.jsx              // lays out slots: 'stack' | 'columns'
  ElementContent.jsx         // bare editor for one slot (already close to this)
components/content/*Editor   // controlled editors with a uniform contract
components/ds/               // only DS components; root duplicates removed
```

**Data model.** Every block is `{ id, type, slots: [{ type, value }], targeting? }`.
- Single block = one slot.
- Double column = two slots. Swap reorders the slots.
- Header = a block type `{ slots: [image, header, paragraph], actions: { locked: true } }`. It's pinned first and can't be moved or removed. A thin adapter maps its slots to `title`/`introduction`/`coverImage` for the TEAMKPN export, so `articleSetupData` can stay the storage format until `toTeamkpnArticle` is updated.

Existing saved articles get a `migrateBlock()` (the same pattern as `migrateVersions`): `content` becomes `slots:[…]`, and `leftContent`/`rightContent`/`swapped` become ordered `slots`.

*What chrome combined blocks show (Judith, targeting, swap on 3 slots, header label) is left to Tom. The structure above only makes each of those a config flag instead of a fork.*

## Incremental refactor steps
Each step is safe to ship on its own and shouldn't change any visible behaviour.

1. **Remove dead code.** Delete `TwoColumnWrapper`, `ArticleSetup`, and the root `Dropdown`, `Tag` and `Button` (move `Modal` to `ds/Button`), after confirming there are no other importers. Point all `Icon` and `TextField` imports at `ds/`.
2. **`useTooltip` hook.** Replace the 4 tippy copies. Fix the `TableContent` global selector.
3. **Controlled editors.** Make the 7 editors with copied state read from `content`. Then remove the `_rev` key hack.
4. **Move type knowledge into config.** Add `empty()`, `getText()` and `judith` to `elementTypes.js`. Remove `elementHasText`, the `type.split('-')` parsing and the switch in `Element`.
5. **Extract `BlockHeader` + `BlockRail`.** Use them in `ElementWrapper`, `DoubleColumnElement` and the Header block. Visual differences, such as label colour on focus, show up here. Tom decides which one is right.
6. **`articleStore`.** Route all localStorage access through it, one component at a time, starting with `articleSetupData`.
7. **Slots data model.** Add `migrateBlock()` and merge `addElement`/`addDoubleElement`/`updateElement` into `addBlock`/`updateSlot`. `DoubleColumnElement` becomes `<Block>` with `layout="columns"`.
8. **Header as a block type.** Render it through `<Block locked>` using the same slots, with an adapter to `articleSetupData`/export.
9. **Inline styles** move to CSS with tokens. Do this whenever an editor is touched anyway.

## Notes for CLAUDE.md
- CLAUDE.md says the fixed first block uses `SetupFields` from `ArticleSetup.jsx`, and that it collapses to `ArticleHeader` when unfocused. Neither one is imported anymore: the Header block now uses `ElementContent`. That section is out of date.
- Judith is switched off globally (`JUDITH_ENABLED = false` in `ds/JudithButton.jsx`). Finding 1's Judith gap is structural only and isn't visible today.
