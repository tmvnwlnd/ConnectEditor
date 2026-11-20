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
  /** The group the article is posted in (preset to the channel group) */
  group: string
  /** Channels the article appears in — at least one */
  channels: string[]
  /** Feeds the article is in — at least one */
  feeds: string[]
}

// ---------------------------------------------------------------------------
// Step 3: Article Targeting
// ---------------------------------------------------------------------------

/** 3 = standaard, 2 = belangrijk, 1 = kritiek */
export type Priority = 1 | 2 | 3

export interface ArticleTargeting {
  /** Doelgroepen within the channels — none = everyone in the channels who follows the feed(s) */
  doelgroepen: string[]
  /** Everyone in the channels, regardless of doelgroep or feed */
  orgWide: boolean
  priority: Priority
}

// ---------------------------------------------------------------------------
// Step 2: Article Content (the element list)
// ---------------------------------------------------------------------------

/** The ordered list of content elements that make up the article body */
export type ArticleContent = ArticleElement[]

// ---------------------------------------------------------------------------
// Step 4: Article Settings
// ---------------------------------------------------------------------------

export type PublishType = 'now' | 'schedule' | 'draft'
export type CloseType = 'yes' | 'no'

export interface ArticleSettings {
  /** Published as an update of this article (gets the Update tag, followers are notified) */
  isUpdate: boolean
  /** Update: show as unread again and move to the top, or only add the tag */
  updateMode: 'unread' | 'tag'
  /** AI summary on/off, and its (reviewed) text */
  aiSummaryOn: boolean
  aiSummary: string
  /** Readers can have the article read aloud */
  readAloud: boolean
  /** Related articles ("Bekijk ook") — at most 3 */
  related: string[]
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
  /** Audience and priority from Step 3 */
  targeting: ArticleTargeting
  /** Publication settings from Step 4 */
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
type BlockContent =
  | HeaderContent
  | ParagraphContent
  | CitationContent
  | ImageContent
  | TableContent
  | AudioContent
  | VideoContent
  | AttachmentContent
  | CarouselContent

/** One inner block of a combined block (e.g. a column of a double-column block). */
export interface EditorBlockSlot {
  /** Single block type of this inner block, e.g. 'paragraph' or 'image' */
  type: string
  content: BlockContent
}

/**
 * A block is either single (`content`) or combined (`slots`, in display order — a swap reverses them).
 * Targeting (`accessCriteria`) applies to the whole block, combined blocks included.
 */
export type EditorBlock = {
  blockId: string
  type: string
  index: number
  accessCriteria?: BlockAccessCriteria
} & (
  | { content: BlockContent; slots?: never }
  | { slots: EditorBlockSlot[]; content?: never }
)

/**
 * The top-level publication as represented in the Java backend.
 * Maps to EditorPublication.java — a flat block list, no sections.
 */
export interface EditorPublication {
  id?: string
  title: string
  introduction: string
  coverImage: string
  /** Flat ordered list of all content blocks */
  blocks: EditorBlock[]
  setup: Omit<ArticleSetup, 'title' | 'introduction' | 'coverImage'>
  targeting: ArticleTargeting
  settings: ArticleSettings
  createdAt?: string
  updatedAt?: string
}
