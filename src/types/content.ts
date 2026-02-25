/**
 * Content Element Types
 *
 * The article editor uses a polymorphic content model — each element has a
 * `type` field that determines the shape of its `content`. This file defines
 * those shapes as a discriminated union, making it impossible to access
 * fields that don't exist for a given element type.
 *
 * Double-column elements combine two content types side by side.
 */

// ---------------------------------------------------------------------------
// Content data shapes (what gets stored per element)
// ---------------------------------------------------------------------------

export interface HeaderContent {
  /** Raw HTML from the WYSIWYG editor */
  html: string
}

export interface ParagraphContent {
  /** Raw HTML from the WYSIWYG editor */
  html: string
}

export interface CitationContent {
  /** Quote text (HTML) */
  quote: string
  /** Person attribution (plain text) */
  person: string
}

export interface ImageContent {
  /** Image URL (blob URL in editor, permanent URL after upload) */
  image: string
  /** Alt text for accessibility */
  altText: string
  /** Optional caption displayed below the image */
  caption: string
  /** Source type — 'blob' for local uploads, 'url' for external links */
  sourceType?: 'blob' | 'url'
}

export interface TableContent {
  rows: number
  columns: number
  /** Cell values as a 2D grid: data[row][column] */
  data: string[][]
  /** Whether the first row should be rendered as a header */
  hasColumnHeader: boolean
  /** Whether the first column should be rendered as a header */
  hasRowHeader: boolean
}

export interface AudioContent {
  /** Audio file URL (blob URL in editor, permanent URL after upload) */
  audio: string
  /** User-provided title for the audio fragment */
  title: string
  /** Original file name as uploaded */
  fileName: string
  /** File extension, e.g. 'mp3' */
  fileType: string
  sourceType: 'blob' | 'url'
}

export interface VideoContent {
  /** Video URL (blob URL in editor, permanent URL after upload) */
  video: string
  /** Optional caption */
  caption: string
  sourceType?: 'blob' | 'url'
}

export interface AttachmentContent {
  /** File URL (blob URL in editor, permanent URL after upload) */
  attachment: string
  /** Display name (editable by user) */
  fileName: string
  /** Original file name as uploaded */
  originalFileName: string
  /** Human-readable file size, e.g. "5.2 MB" */
  fileSize: string
  /** File extension in uppercase, e.g. "PDF" */
  fileType: string
  sourceType: 'blob' | 'url'
}

export interface CarouselImage {
  id: string
  image: string
  altText?: string
  caption: string
}

export interface CarouselContent {
  images: CarouselImage[]
}

// ---------------------------------------------------------------------------
// Content type map — links type string to its content shape
// ---------------------------------------------------------------------------

export interface ContentTypeMap {
  header: HeaderContent
  paragraph: ParagraphContent
  citation: CitationContent
  image: ImageContent
  table: TableContent
  audio: AudioContent
  video: VideoContent
  attachment: AttachmentContent
  carousel: CarouselContent
}

/** All single-column element type strings */
export type SingleElementType = keyof ContentTypeMap

/** Content shape for a given element type */
export type ContentOf<T extends SingleElementType> = ContentTypeMap[T]
