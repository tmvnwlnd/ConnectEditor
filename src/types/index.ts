/**
 * Editor Project — Type Definitions
 *
 * Central export for all TypeScript types. Import from here:
 *
 *   import type { Article, ArticleElement, ImageContent } from '@/types'
 *
 * Structure:
 *   content.ts        — Individual content block shapes (Image, Table, etc.)
 *   elements.ts       — Element wrappers (single & double column) + type guards
 *   article.ts        — Full article model (Setup + Content + Settings)
 *   elementConfig.ts  — Element type registry configuration
 *   validation.ts     — Validation function signatures & file constraints
 */

// Content block shapes
export type {
  HeaderContent,
  ParagraphContent,
  CitationContent,
  ImageContent,
  TableContent,
  AudioContent,
  VideoContent,
  AttachmentContent,
  CarouselImage,
  CarouselContent,
  ContentTypeMap,
  SingleElementType,
  ContentOf,
} from './content'

// Element types (single + double column)
export type {
  SingleElement,
  ParagraphParagraphElement,
  ImageImageElement,
  ParagraphImageElement,
  ParagraphCitationElement,
  DoubleColumnElement,
  DoubleElementType,
  ArticleElement,
  ElementType,
} from './elements'

export { isSingleElement, isDoubleElement } from './elements'

// Full article model
export type {
  ArticleSetup,
  ArticleContent,
  PublishType,
  CloseType,
  PagePlacement,
  PaginaPlaatsing,
  PaginaKey,
  ArticleSettings,
  Article,
} from './article'

// Element config registry
export type {
  SingleElementConfig,
  SingleElementRegistry,
  DoubleElementConfig,
  DoubleElementRegistry,
} from './elementConfig'

// Validation
export type {
  ValidationResult,
  Validator,
  ValidateRequired,
  ValidateUrl,
  ValidateMinSelection,
  ValidateDateRequired,
  ValidateDateAfter,
  WarnLength,
  ValidateFileType,
  ValidateFileSize,
  FileConstraints,
} from './validation'

export {
  IMAGE_CONSTRAINTS,
  VIDEO_CONSTRAINTS,
  AUDIO_CONSTRAINTS,
  ATTACHMENT_CONSTRAINTS,
} from './validation'
