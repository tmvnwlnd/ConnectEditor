# Showcase Page Generator

Generate minimalist showcase pages for design review and iteration.

## When to Use

Use this skill when:
- Iterating on component designs and need to compare states side-by-side
- Reviewing UI variations before implementing in the main app
- Need a scratchpad to collect design feedback while reviewing

## Showcase Page Structure

Create a standalone page at `/{feature}-showcase` with:

### 1. Page Layout
- Full viewport, light gray background (`var(--gray-100)`)
- Header with component name and description
- Sections grouped by state category
- Horizontal rows of component variations

### 2. Static Component Displays
- Render components in static form (no animations, no portals)
- Show all states: default, hover, active, disabled, loading, error, etc.
- Include edge cases: empty, overflow, minimal content
- Add small labels above each variation

### 3. Floating Notepad (Required)
Add a draggable, floating notepad for collecting design feedback:

```jsx
function FloatingNotepad() {
  const [notes, setNotes] = useState('')
  const [position, setPosition] = useState({ x: 20, y: 20 })
  const [isDragging, setIsDragging] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)

  // Draggable header, resizable textarea
  // Copy button to copy notes to clipboard
  // Minimize/expand toggle
  // Persists position in localStorage
}
```

Notepad features:
- Draggable by header bar
- Minimize to small floating button
- Copy all notes with one click
- Auto-save to localStorage
- Semi-transparent when not focused
- Always on top (high z-index)

### 4. Route Registration
Add to `App.jsx`:
```jsx
const isShowcaseRoute = [..., '/{feature}-showcase'].includes(location.pathname)
// Add Route in showcase routes section
```

## File Structure

```
src/components/
  {Feature}Showcase.jsx    # Main showcase page
  {Feature}Showcase.css    # Showcase-specific styles
```

## CSS Pattern

```css
.{feature}-showcase {
  min-height: 100vh;
  background: var(--gray-100);
  padding: var(--s-xlarge);
}

.{feature}-showcase-section {
  margin-bottom: var(--s-xlarge);
}

.{feature}-showcase-row {
  display: flex;
  gap: var(--s-large);
  flex-wrap: wrap;
  align-items: flex-start;
}

/* Override animations for static display */
.showcase-panel [class*="animation"] {
  animation: none !important;
  opacity: 1 !important;
}
```

## Example Prompt

"Create a showcase page for the Button component showing: primary, secondary, tertiary variants in default/hover/disabled states, plus icon buttons and loading states. Include the floating notepad."

## Notes Format

When user provides notes from the notepad, they will be formatted as:
```
- [component/state]: observation or change request
- [component/state]: observation or change request
```

Apply each note as a specific edit to the component's CSS or JSX.
