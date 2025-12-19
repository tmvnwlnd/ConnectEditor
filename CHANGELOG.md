# Changelog

## Session - November 24, 2025

### Features Built

#### 1. Article Builder Interface
- **Full Page Layout**: Created a complete article builder interface with floating header and footer
- **Header Section**: Title "Nieuwsartikel maken", step indicator (Stap 2 van 3), and preview button
- **Footer Navigation**: Previous/next step buttons positioned on the right with 16px gap
- **Responsive Canvas**: Article canvas spans full viewport height from top to bottom

#### 2. Element Sidebar
- **Floating Panel Design**: White background with border, shadow, and rounded corners
- **Category Organization**: Separated elements into "Standaard" and "Multimedia" categories
- **Interactive Elements**:
  - Enabled: Kop, Alinea, Afbeelding, Tabel, Citaat
  - Hover state shows green plus icon
  - Disabled elements shown with reduced opacity
- **Fixed Width**: 250px width with auto-fit height
- **Icon Styling**: All icons properly colored in green (#00c300)

#### 3. Text Elements (Header, Paragraph, Citation)
- **Trumbowyg Integration**: Rich text editor with custom toolbar
- **Focus States**:
  - Unfocused: 2px transparent border
  - Focused: Green border (#00c300), light green background (#F0FCF0), slight lift effect
- **Icon Behavior**: Icons turn green when element is focused
- **Label Behavior**: Element labels turn green when focused
- **Positioning Buttons**: Up/down arrows, duplicate, and delete buttons
  - Visible only when element is focused
  - Dimmed when textarea is being edited
  - Disabled appropriately (up for first element, down for last element)

#### 4. Image Element
- **Empty State**:
  - Blue photo icon
  - Instructional text for drag-and-drop
  - Three action buttons: Browse computer (functional), Beeldbank (disabled), URL (disabled)
  - File type and size validation (.jpeg, .png, .gif, max 10MB)
- **Filled State**:
  - Image preview with max-height of 600px
  - Aspect ratio toolbar with 4 options:
    - Vertical 9:16
    - Horizontal 16:9
    - Small square
    - Large square
  - Crop preview overlay showing which parts will be cropped with 50% black overlay
  - "vervang" dropdown menu for replacing image
  - Alt text input field with label, info icon, and "(optioneel)" indicator
- **File Upload**: Functional browse and upload from computer with validation

#### 5. Table Element
- **Dynamic Grid**: Starts with 3x4 table, fully editable cells
- **Row Controls**: +/- buttons to add/remove rows (minimum 1)
- **Column Controls**: +/- buttons to add/remove columns (minimum 1)
- **Header Toggles**:
  - Column header toggle: Makes first row bold with emphasized border
  - Row header toggle: Makes first column bold with emphasized border
  - Toggle buttons turn green when active
- **Cell Editing**: Click to edit any cell, focus state with blue outline
- **Visual Styling**: Clean borders, gray background for headers

#### 6. Element Management
- **Add Elements**: Click sidebar items to add to canvas
- **Auto-Scroll**: Newly added elements automatically scroll into view
- **Reordering**: Move elements up/down with smooth animations
- **Duplication**: Duplicate any element with one click
- **Deletion**: Remove elements with confirmation
- **Focus Management**: Click element to focus, click outside to unfocus

### Styling & Design

#### Typography
- **Custom Font**: KPN Extended v2 with variable optical sizing
  - Body text: 16px, weight 400, opsz 16 (min)
  - Headers: 40px, weight 900, opsz 48 (max)
  - Sidebar title: 18px, weight 900, opsz 48 (max)

#### Color Palette
- **Primary Green**: #00c300 (focus states, active elements)
- **Primary Blue**: #0066EE (buttons, links)
- **Gray Scale**:
  - #737373 (text, icons)
  - #d0d0d0 (borders)
  - #f5f5f5 (backgrounds)
  - #F0FCF0 (light green background for focused elements)

#### Button Styling
- **Rounded Pills**: 24px border-radius for primary buttons
- **Outlined Style**: 2px solid border with transparent background
- **Filled Primary**: Blue background for primary actions
- **Hover States**: Smooth transitions on all interactive elements

#### Layout
- **Floating Panels**: Header and footer float over content
- **Sidebar Positioning**: Padded from top (140px) and bottom (100px) to avoid overlapping
- **Canvas Scrolling**: Full-height scrollable area with proper padding

### Problems Solved

#### 1. Icon Color Issues
- **Problem**: SVG icons imported via React had inline fill styles causing white color
- **Solution**: Used `!important` in CSS to override inline styles, specifically targeting path elements while preserving transparent layers

#### 2. Font Variable Settings
- **Problem**: Variable font wasn't applying correct optical sizing
- **Solution**: Used `font-variation-settings: 'opsz' X` instead of font-stretch properties

#### 3. Focus State Management
- **Problem**: Needed different behavior for element focus vs textarea focus
- **Solution**: Implemented dual state system (element-focused, textarea-focused) with appropriate styling for each

#### 4. Canvas Layout
- **Problem**: Canvas wasn't spanning full viewport height
- **Solution**: Removed padding from content area, applied padding to individual children (sidebar and canvas)

#### 5. Image Crop Preview
- **Problem**: Crop overlay needed to work with resized images (max-height 600px)
- **Solution**: Changed from pseudo-element approach to actual div overlay, made image preview inline-block to fit actual image size

#### 6. Element Scrolling
- **Problem**: Newly added elements could be off-screen
- **Solution**: Implemented ref-based scrollIntoView with smooth animation and center positioning

#### 7. Positioning Button Visibility
- **Problem**: Buttons needed to be visible when element focused but dimmed during text editing
- **Solution**: Implemented visibility logic based on both focus states with opacity transitions

#### 8. Animation System
- **Problem**: Needed smooth transitions when reordering elements
- **Solution**: Created CSS keyframe animations (moveUp/moveDown) triggered by state changes

### Technical Stack

- **React 18**: Component architecture with hooks (useState, useRef, useEffect)
- **Vite**: Fast development and build tooling
- **Trumbowyg**: Rich text editor for text elements
- **Custom CSS**: No CSS framework, all styling from scratch
- **SVG Icons**: Imported as React components via vite-plugin-svgr

### Code Architecture

- **Component Structure**:
  - ArticleBuilder: Main orchestrator component
  - ElementSidebar: Sidebar for adding elements
  - ArticleCanvas: Renders element list
  - Element Components: HeaderElement, ParagraphElement, CitationElement, ImageElement, TableElement
  - TrumbowygEditor: Shared wrapper for Trumbowyg integration
  - PositioningButtons: Reusable positioning controls

- **State Management**:
  - Elements array with unique IDs
  - Focused element tracking
  - Animation state for transitions
  - Scroll-to tracking for new elements

- **Styling Approach**:
  - Modular CSS files per component
  - Shared styles in App.css
  - BEM-like naming conventions
  - Transition animations using cubic-bezier easing

---

## Next Steps (TODO)

### 1. Build Preview Feature
**Description**: Add functionality to the "Preview artikel" button to transform the article canvas into a fully styled HTML article based on user input.

**Requirements**:
- Click preview button to toggle preview mode
- Generate clean HTML from all element types (headers, paragraphs, citations, images, tables)
- Apply article styling that matches final publication format
- Allow toggle back to edit mode
- Preserve all element data during preview

**Technical Considerations**:
- HTML generation from Trumbowyg content
- Image display with selected crop ratios
- Table rendering with headers if enabled
- Responsive article layout
- Print-friendly styles

### 2. Support Two-Column Layouts
**Description**: Add feature to place elements side-by-side in a two-column layout.

**Requirements**:
- Button to group two elements into side-by-side layout (50% width each)
- Button to ungroup and return to full-width layout
- Visual indication of grouped elements
- Maintain element independence (still individually editable, moveable, deletable)
- Support all element types in columns
- Proper spacing and alignment

**Technical Considerations**:
- Grouping mechanism in element array structure
- CSS Grid or Flexbox for column layout
- Positioning button modifications for grouped elements
- Drag-and-drop or button-based grouping UI
- Ungrouping logic and element position restoration

### 3. Deploy to Netlify
**Description**: Deploy the prototype to Netlify for sharing with colleagues.

**Requirements**:
- Set up Netlify deployment configuration
- Build production-ready bundle
- Configure custom domain (if needed)
- Test all features in production environment
- Set up continuous deployment from Git repository
- Share link with team

**Technical Considerations**:
- Build optimization
- Environment variables (if any)
- Routing configuration for SPA
- Asset optimization
- Browser compatibility testing
- Mobile responsiveness check

---

---

## Session - November 25, 2025

### Major Features Implemented

#### 1. Two-Column Layout Feature
- **Link Button**: Added link button to positioning controls (between move down and duplicate)
- **Linking Mode**:
  - Click link button to enter linking mode
  - Link button stays active (blue background, white icon) during linking
  - Source element shows solid blue border (#0066EE) and blue background
  - Other linkable elements show dotted blue border (#B3D4FF) with subtle background
  - Hover on linkable elements shows solid border and brighter background
- **Visual Feedback**:
  - Tooltip at bottom: "klik op element om een twee-koloms layout te maken"
  - Hover overlay on linkable elements with link icon (32px) and text "link met dit element"
  - All headers and icons change color to match border states (blue for linking)
- **Cancellation**: Cancel linking by blurring the source element (clicking elsewhere)
- **Paired Element**:
  - Two elements combined into side-by-side layout with 20px gap
  - Special buttons: Swap (exchange left/right) and Break Link (ungroup)
  - Both elements remain independently editable
  - Shared green border when pair is focused

#### 2. Preview Mode Implementation
- **Preview Button**: Toggle between edit and preview modes
- **Article Rendering**:
  - Clean HTML preview without editor chrome
  - Proper typography and spacing for publication
  - Two-column layouts rendered correctly side-by-side
  - Images displayed with selected aspect ratios
  - Tables with proper header formatting
- **Image Cropping**: Implemented canvas-based image cropping for preview
  - Crops images to selected aspect ratio
  - Maintains quality with max dimensions (300px for small, 600px for others)
  - Cached cropped images for performance

#### 3. Header Color System
- **Linking States**:
  - Source element: Headers turn blue (#0066EE) with solid border
  - Linkable targets: Headers turn light blue (#B3D4FF) with dotted border
  - Hover on targets: Headers turn darker blue (#0066EE)
- **Focus States**:
  - Focused elements: Headers turn green (#00c300)
  - Two-column pairs: Both headers turn green when pair is focused
- **SVG Icon Coloring**: Proper handling of SVG paths with inline styles using CSS specificity

#### 4. Git Repository & Netlify Deployment
- **Git Setup**:
  - Initialized git repository
  - Created .gitignore for node_modules, dist, etc.
  - Initial commit with full codebase
  - Pushed to GitHub: https://github.com/tmvnwlnd/ConnectEditor.git
- **Netlify Configuration**:
  - Created netlify.toml with build settings
  - Configured SPA redirects
  - Connected GitHub repository for continuous deployment
  - Deployed to: https://connect-editor.netlify.app
- **Trumbowyg Icons Fix**:
  - Moved Trumbowyg icons.svg to public folder
  - Fixed SVG path from /node_modules/ to /trumbowyg-icons.svg
  - Icons now work in production build

### Problems Solved

#### 1. Click Outside to Blur
- **Problem**: No way to deselect all elements
- **Solution**: Added click handler on canvas that clears focus when clicking empty space

#### 2. Auto-Scroll Issues
- **Problem**: Canvas scrolled on every element edit, not just when adding new elements
- **Solution**: Removed `elements` from useEffect dependency array, only scroll on new bottom elements

#### 3. Elements Disappearing Bug
- **Problem**: Editing first element caused all other elements to disappear
- **Root Cause**: Stale closure in updateElement - using old elements array reference
- **Solution**: Changed to functional setState: `setElements(prevElements => ...)`

#### 4. Link Button Not Working
- **Problem**: onLink prop not passed through component hierarchy
- **Solution**: Added onLink prop to all element components and passed through to PositioningButtons

#### 5. Linking Mode UX Issues
- **Problem**: Link button icon turned blue after hover instead of staying white when active
- **Solution**: Added comprehensive CSS rules for active state including SVG path targeting

#### 6. Paired Element Content Loss
- **Problem**: First element in two-column layout lost content when switching to preview
- **Root Cause**: Spreading entire element object in update handler caused property overwrites
- **Solution**: Only pass `leftElement` and `rightElement` properties to updateElement

#### 7. Trumbowyg Icons Missing in Production
- **Problem**: SVG icons in Trumbowyg toolbar didn't load on Netlify
- **Root Cause**: Path pointed to /node_modules/ which doesn't exist in production build
- **Solution**: Copied icons.svg to public folder, updated path to /trumbowyg-icons.svg

### Technical Improvements

#### State Management Enhancements
- **Linking State**: Added `linkingElementId` to track linking mode
- **Auto-Cancel**: useEffect to cancel linking when focus changes away from source
- **Functional Updates**: Consistent use of functional setState to avoid stale closures

#### Component Architecture
- **TwoColumnWrapper**: New component for rendering paired elements
- **renderSingleElement**: Helper function to render elements without positioning buttons
- **ArticlePreview**: Separate component for preview mode with proper content rendering

#### CSS Organization
- **TwoColumnWrapper.css**: Styles for paired elements and linking states
- **ArticlePreview.css**: Styles for preview mode including two-column layout
- **Linking Mode Styles**: Comprehensive color system for all linking states

#### Build Configuration
- **netlify.toml**: Build command and publish directory
- **public folder**: Static assets that need to be served in production
- **.gitignore**: Proper exclusions for node_modules, dist, .netlify

### Code Quality
- **Consistent Prop Passing**: All element components receive same prop structure
- **SVG Coloring Pattern**: Standardized approach to override inline SVG fills:
  - Target `svg path` for all paths
  - Exclude `svg path[data-name="Transparante laag"]` for transparent layers
  - Override `svg path[style]` with !important for inline styles
- **Error Prevention**: Avoided common pitfalls like stale closures and prop drilling issues

## Known Limitations

1. **No Persistence**: Element data is lost on page refresh (no database or local storage)
2. **Image Storage**: Images stored as base64 in memory (not scalable for production)
3. **Limited Image Manipulation**: Crop preview only, no actual cropping implemented
4. **No Undo/Redo**: No history management for element changes
5. **Single Article**: No support for multiple articles or article management
6. **No User Authentication**: No user accounts or permissions
7. **Desktop Only**: Not yet optimized for mobile/tablet devices

---

## Session - December 19, 2025

### Major Refactoring: Element Architecture Standardization

#### ElementWrapper Pattern
- **Unified Architecture**: Consolidated all six element types (header, paragraph, citation, image, table, audio) into standardized wrapper pattern
- **ElementWrapper Component**: Provides consistent border, title with icon, positioning buttons, and focus behavior for all elements
- **Element Component**: Maps element types to content components via configuration object
- **Headless Content Components**: Pure renderers (HeaderContent, ParagraphContent, CitationContent, ImageContent, TableContent, AudioContent) without wrappers

#### Three-Tier Focus System
- **Unselected**: No border, gray (#737373) title and icon
- **Selected**: Green border (#00c300), green title/icon, toolbar hidden, positioning buttons visible
- **Editing**: Wrapper border hides, green outline on inner content, toolbar shows, positioning buttons hide

#### Design System Improvements
- **variables.css**: Centralized color system with CSS custom properties (primary colors, text colors, state colors, border colors, transitions)
- **Consistent Styling**: All elements follow same visual patterns for borders, spacing, and state transitions

#### Text Editor Enhancements
- **Pure Trumbowyg**: Direct jQuery initialization without wrapper divs in HeaderContent, ParagraphContent, CitationContent
- **Toolbar Improvements**: Removed default underline, added thin 1px border (#d8d8d8), toolbar only shows when editing
- **Editor Buttons**:
  - HeaderContent: H1, H2, H3, Link
  - ParagraphContent: Bold, Italic, Underline, Strikethrough, Remove Format, Link, Lists
  - CitationContent: Bold, Italic, Link
- **Focus Styling**: Green outline (#00c300) on editor when focused

#### Element-Specific Improvements
- **Image Element**: Converted buttons to use Button component, proper aspect ratio controls, replace dropdown
- **Table Element**:
  - Toolbar only appears when cell is focused (not when element selected)
  - Green focus outline on cells (#00c300, was blue)
  - Prevent toolbar blur with onMouseDown preventDefault
  - Dynamic rows/columns with +/- controls
- **Audio Element**: Empty/filled states, native controls, button stacking in two-column

#### Two-Column Layout Integration
- **Width Constraint**: Two-column wrapper constrained to 900px matching single elements
- **Border Behavior**: Wrapper border hides when inner content is being edited
- **Responsive Toolbars**: Table controls and image/audio buttons wrap/stack in narrow layouts
- **Clean Integration**: Inner elements remove borders when inside two-column wrapper

#### Spacing Optimization
- **Smart Toolbar Space**: Trumbowyg box padding removed when toolbar hidden
- **Reduced Gaps**: Space between title and content only appears when toolbar is needed
- **Consistent Margins**: Standardized spacing across all element types

### Problems Solved

#### 1. Double Border Issue
- **Problem**: Text elements showed double borders when selected (ElementWrapper + TrumbowygEditor wrappers)
- **Solution**: Rebuilt content components as headless - only Trumbowyg initialization, ElementWrapper provides all chrome

#### 2. Toolbar Underline
- **Problem**: Ugly horizontal line underneath Trumbowyg toolbar buttons
- **Solution**: Aggressive CSS overrides targeting all possible sources (borders, box-shadows, pseudo-elements)

#### 3. Table Toolbar Blur
- **Problem**: Clicking table toolbar buttons caused cell to blur, hiding the toolbar mid-interaction
- **Solution**: Added `onMouseDown={(e) => e.preventDefault()}` to all toolbar buttons

#### 4. Inconsistent Focus Colors
- **Problem**: Table cells used blue focus (#0066EE) while rest of app used green
- **Solution**: Changed table cell focus to green (#00c300) with light green background (#E5F9E5)

#### 5. Linking Visual Feedback
- **Problem**: Linking mode needed to work with new element architecture
- **Solution**: Updated CSS selectors to target `.element-wrapper` instead of individual element classes

### Technical Architecture

#### Component Structure
```
Element (unified)
  └─ ElementWrapper (border, title, icon, positioning)
      └─ ContentComponent (headless renderer)
          └─ Trumbowyg/Image/Table/Audio logic
```

#### File Organization
- `/src/components/Element.jsx` - Unified element component with type mapping
- `/src/components/ElementWrapper.jsx` - Standardized wrapper with chrome
- `/src/components/content/` - Headless content components (6 files)
- `/src/styles/variables.css` - Centralized design tokens
- `/src/styles/ElementWrapper.css` - Wrapper styling
- `/src/styles/*Content.css` - Content-specific styles (Image, Table, Audio)

#### State Management
- **Focus States**: Managed at Element level, passed to wrapper and content
- **Editing States**: Content components manage internal editing state (isEditing)
- **Positioning Button Dimming**: Content components signal via onDimPositioningButtons callback

### Code Quality Improvements
- **Reduced Duplication**: Eliminated repeated border/title/positioning code across 6 element types
- **Extensibility**: Adding new element types now requires only adding to elementConfig object
- **Separation of Concerns**: Clear separation between chrome (wrapper) and content (renderers)
- **Consistent Patterns**: All elements follow same focus/editing/toolbar visibility logic

---

## Performance Optimizations Applied

- React component memoization where appropriate
- Transition animations using GPU-accelerated properties (transform, opacity)
- Debounced state updates for text input
- Lazy loading for icons via dynamic imports
- CSS containment for layout performance

---

## Browser Support

Tested and working in:
- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)

Requires:
- ES2020+ JavaScript support
- CSS Grid and Flexbox
- CSS custom properties
- FileReader API (for image upload)
