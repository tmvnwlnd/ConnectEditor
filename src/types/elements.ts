/**
 * Element Types
 *
 * An article is a list of elements. Each element is either single-column
 * (one content block) or double-column (two content blocks side by side).
 *
 * The discriminated union pattern means TypeScript can narrow the element
 * type and infer the correct content shape automatically:
 *
 *   if (element.type === 'image') {
 *     element.content.altText  // ✓ TypeScript knows this exists
 *   }
 */

import type {
  ContentTypeMap,
  SingleElementType,
  ParagraphContent,
  ImageContent,
  CitationContent,
} from './content'

// ---------------------------------------------------------------------------
// Block access control (maps to Java EditorBlockAccessCriteria)
// ---------------------------------------------------------------------------

/**
 * Per-block access control. Currently empty — the backend will populate
 * this with visibility/permission rules (e.g. role-based content gating).
 */
export interface BlockAccessCriteria {
  [key: string]: unknown
}

// ---------------------------------------------------------------------------
// Single-column elements
// ---------------------------------------------------------------------------

/** A single-column element — type determines the content shape */
export type SingleElement = {
  [T in SingleElementType]: {
    /** Unique block identifier (blockId in Java backend) */
    id: string
    type: T
    content: ContentTypeMap[T]
    /** Per-block access control — reserved for backend use */
    accessCriteria?: BlockAccessCriteria
  }
}[SingleElementType]

// ---------------------------------------------------------------------------
// Double-column elements
// ---------------------------------------------------------------------------

interface DoubleColumnBase {
  /** Unique block identifier (blockId in Java backend) */
  id: string
  /** Whether left and right columns are visually swapped */
  swapped: boolean
  /** Per-block access control — reserved for backend use */
  accessCriteria?: BlockAccessCriteria
}

export interface ParagraphParagraphElement extends DoubleColumnBase {
  type: 'paragraph-paragraph'
  leftContent: ParagraphContent
  rightContent: ParagraphContent
}

export interface ImageImageElement extends DoubleColumnBase {
  type: 'image-image'
  leftContent: ImageContent
  rightContent: ImageContent
}

export interface ParagraphImageElement extends DoubleColumnBase {
  type: 'paragraph-image'
  leftContent: ParagraphContent
  rightContent: ImageContent
}

export interface ParagraphCitationElement extends DoubleColumnBase {
  type: 'paragraph-citation'
  leftContent: ParagraphContent
  rightContent: CitationContent
}

export type DoubleColumnElement =
  | ParagraphParagraphElement
  | ImageImageElement
  | ParagraphImageElement
  | ParagraphCitationElement

/** All double-column type strings */
export type DoubleElementType = DoubleColumnElement['type']

// ---------------------------------------------------------------------------
// Union of all elements
// ---------------------------------------------------------------------------

/** Any element in the article (single or double column) */
export type ArticleElement = SingleElement | DoubleColumnElement

/** All element type strings */
export type ElementType = SingleElementType | DoubleElementType

// ---------------------------------------------------------------------------
// Type guards
// ---------------------------------------------------------------------------

const DOUBLE_TYPES: Set<string> = new Set([
  'paragraph-paragraph',
  'image-image',
  'paragraph-image',
  'paragraph-citation',
])

export function isSingleElement(el: ArticleElement): el is SingleElement {
  return !DOUBLE_TYPES.has(el.type)
}

export function isDoubleElement(el: ArticleElement): el is DoubleColumnElement {
  return DOUBLE_TYPES.has(el.type)
}
