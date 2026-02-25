/**
 * Article Types
 *
 * The complete article data model, combining setup data, editor content,
 * and settings into a single structure. This represents the full article
 * as it would be stored or transmitted.
 *
 * The three sub-types (Setup, Content, Settings) map directly to the
 * three wizard steps in the editor, and to the three localStorage keys
 * used for persistence during editing.
 */

import type { ArticleElement, BlockAccessCriteria } from './elements'
import type {
  HeaderContent,
  ParagraphContent,
  CitationContent,
  ImageContent,
  TableContent,
  AudioContent,
  VideoContent,
  AttachmentContent,
  CarouselContent,
} from './content'

// ---------------------------------------------------------------------------
// Step 1: Article Setup
// ---------------------------------------------------------------------------

export interface ArticleSetup {
  /** Article title — required, recommended 10–100 characters */
  title: string
  /** Article introduction — optional, recommended max 500 characters */
  introduction: string
  /** Cover image URL (blob during editing, permanent URL after upload) */
  coverImage: string
  /** Icon identifier from the KPN icon bank, e.g. 'ui-star' */
  icon: string
}

// ---------------------------------------------------------------------------
// Step 2: Article Content (the element list)
// ---------------------------------------------------------------------------

/** The ordered list of content elements that make up the article body */
export type ArticleContent = ArticleElement[]

// ---------------------------------------------------------------------------
// Step 3: Article Settings
// ---------------------------------------------------------------------------

export type PublishType = 'now' | 'schedule' | 'draft'
export type CloseType = 'yes' | 'no'

export interface PagePlacement {
  enabled: boolean
  /** Position in the page list (1-based), empty string if not set */
  position: string
}

export interface PaginaPlaatsing {
  voorpagina: PagePlacement
  commercieel: PagePlacement
  operationeel: PagePlacement
}

export type PaginaKey = keyof PaginaPlaatsing

export interface ArticleSettings {
  /** Target audiences — at least one required */
  doelgroepen: string[]
  /** Product dossiers — optional */
  dossiers: string[]
  /** Partner groups — at least one required */
  partners: string[]
  /** Page placement with optional position per page */
  paginaPlaatsing: PaginaPlaatsing
  /** Publish strategy */
  publishType: PublishType
  /** Scheduled publish date (ISO string) — required when publishType is 'schedule' */
  publishDate: string | null
  /** Whether to auto-close the article */
  closeType: CloseType
  /** Auto-close date (ISO string) — required when closeType is 'yes' */
  closeDate: string | null
}

// ---------------------------------------------------------------------------
// Complete Article
// ---------------------------------------------------------------------------

/**
 * The full article as it would be persisted or sent to an API.
 *
 * During editing, each section is stored separately in localStorage.
 * On publish/save, they are combined into this shape.
 */
export interface Article {
  /** Unique article identifier — assigned by the backend on creation */
  id?: string
  /** Article metadata from Step 1 */
  setup: ArticleSetup
  /** Ordered list of content elements from Step 2 */
  elements: ArticleContent
  /** Publication and categorization settings from Step 3 */
  settings: ArticleSettings
  /** ISO timestamp — set by the backend */
  createdAt?: string
  /** ISO timestamp — set by the backend */
  updatedAt?: string
}

// ---------------------------------------------------------------------------
// API / Wire format (maps to Java EditorPublication)
// ---------------------------------------------------------------------------

/**
 * A typed block as stored by the Java backend. Each block carries its own
 * type discriminator, content payload, ordering index, and access criteria.
 *
 * This is the normalized representation — the backend stores a flat list
 * of these rather than the frontend's inline element array.
 */
export interface EditorBlock {
  blockId: string
  type: string
  index: number
  accessCriteria?: BlockAccessCriteria
  content:
    | HeaderContent
    | ParagraphContent
    | CitationContent
    | ImageContent
    | TableContent
    | AudioContent
    | VideoContent
    | AttachmentContent
    | CarouselContent
  /** For double-column blocks: secondary content payload */
  rightContent?:
    | ParagraphContent
    | ImageContent
    | CitationContent
  /** For double-column blocks: visual swap flag */
  swapped?: boolean
}

/**
 * The top-level publication as represented in the Java backend.
 * Maps to EditorPublication.java — a flat block list, no sections.
 */
export interface EditorPublication {
  id?: string
  title: string
  introduction: string
  coverImage: string
  icon: string
  /** Flat ordered list of all content blocks */
  blocks: EditorBlock[]
  /** Publication and categorization settings */
  settings: ArticleSettings
  createdAt?: string
  updatedAt?: string
}
