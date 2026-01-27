# Development Guidelines

## CSS Styling Guidelines

### Trumbowyg Editor Customization

**CRITICAL: Always use `!important` flags when customizing Trumbowyg styles**

The Trumbowyg WYSIWYG editor library applies its own CSS with high specificity. When adding or modifying custom styles in `/src/styles/Trumbowyg.css`, you **MUST** include `!important` flags on all properties that override Trumbowyg defaults.

#### Why `!important` is Required

- Trumbowyg's library CSS uses specific selectors that take precedence over our custom styles
- Without `!important`, custom styles will not be visible in the browser
- This is the standard approach for overriding third-party library styles

#### Example

```css
/* ❌ WRONG - Will not work */
.trumbowyg-box {
  border: 2px solid var(--gray-200);
  border-radius: 16px;
}

/* ✅ CORRECT - Will override Trumbowyg defaults */
.trumbowyg-box {
  border: 2px solid var(--gray-200) !important;
  border-radius: 16px !important;
}
```

#### Files Affected

- `/src/styles/Trumbowyg.css` - Main Trumbowyg customization file
- `/src/styles/TrumbowygEditor.css` - Old architecture styles
- `/src/styles/ContentEditor.css` - New architecture styles

### CSS Variable Usage

All colors should use design tokens from `/src/styles/tokens.css`. Never use hardcoded color values.

```css
/* ✅ CORRECT */
color: var(--gray-500);
border: 1px solid var(--gray-200);

/* ❌ WRONG */
color: #333;
border: 1px solid #d3d3d3;
```

## Component Architecture

### Trumbowyg Integration

The project uses Trumbowyg in two architectures:

1. **Old Architecture**: `TrumbowygEditor.jsx` component with wrapper styling
2. **New Architecture**: Content editors (`HeaderContent.jsx`, `ParagraphContent.jsx`, `CitationContent.jsx`) with `ElementWrapper`

When making changes to Trumbowyg styling, ensure both architectures are considered.

### Tooltips

All tooltips use **tippy.js** library. Never create custom CSS tooltips.

Configuration:
```javascript
tippy(element, {
  theme: 'translucent',
  arrow: true,
  animation: 'fade',
  placement: 'top' // or 'left' for positioning buttons
})
```
