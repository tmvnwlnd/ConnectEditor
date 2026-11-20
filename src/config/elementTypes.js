/**
 * Element Type Configuration
 *
 * Centralized configuration for all element types in the article builder.
 * Defines single-column and double-column element types with their metadata.
 */

import HeaderContent from '../components/content/HeaderContent'
import ParagraphContent from '../components/content/ParagraphContent'
import CitationContent from '../components/content/CitationContent'
import ImageContent from '../components/content/ImageContent'
import TableContent from '../components/content/TableContent'
import AudioContent from '../components/content/AudioContent'
import VideoContent from '../components/content/VideoContent'
import AttachmentContent from '../components/content/AttachmentContent'
import CarouselContent from '../components/content/CarouselContent'
import TextGraphicContent from '../components/content/TextGraphicContent'
import FaqContent from '../components/content/FaqContent'

const stripTags = (html) => (html || '').replace(/<[^>]*>/g, '').trim()

// Text of a text block (used to know whether an article has text, e.g. for the AI button).
const htmlText = (content) => (typeof content === 'string' ? stripTags(content) : '')
const citationText = (content) =>
  typeof content === 'object' && content ? stripTags(content.quote) : htmlText(content)

/**
 * Single-column element types.
 *
 * label, icon, ContentComponent, enabled — as shown in the sidebar and block header.
 * getText(content)  — optional: the block's plain text (text blocks only).
 * judith            — optional: { context, apply(content, suggestion) → new content } for the AI button.
 */
export const SINGLE_ELEMENT_TYPES = {
  header: {
    label: 'Kop',
    icon: 'ui-diamond',
    ContentComponent: HeaderContent,
    enabled: true,
    getText: htmlText,
    judith: {
      context: 'header',
      apply: (content, suggestion) => {
        const level = content?.match?.(/<h([1-3])/)?.[1] || '2'
        return `<h${level}>${suggestion}</h${level}>`
      }
    }
  },
  paragraph: {
    label: 'Alinea',
    icon: 'ui-text-square',
    ContentComponent: ParagraphContent,
    enabled: true,
    getText: htmlText,
    judith: { context: 'paragraph', apply: (_content, suggestion) => `<p>${suggestion}</p>` }
  },
  image: {
    label: 'Afbeelding',
    icon: 'ui-photo',
    ContentComponent: ImageContent,
    enabled: true
  },
  table: {
    label: 'Tabel',
    icon: 'ui-square-grid-4x4',
    ContentComponent: TableContent,
    enabled: true
  },
  citation: {
    label: 'Citaat',
    icon: 'ui-text-bubble',
    ContentComponent: CitationContent,
    enabled: true,
    getText: citationText,
    judith: {
      context: 'citation',
      apply: (content, suggestion) =>
        typeof content === 'object' && content ? { ...content, quote: suggestion } : { quote: suggestion, person: '' }
    }
  },
  audio: {
    label: 'Audiofragment',
    icon: 'ui-speaker-high',
    ContentComponent: AudioContent,
    enabled: true
  },
  video: {
    label: 'Video',
    icon: 'ui-play-square',
    ContentComponent: VideoContent,
    enabled: true
  },
  attachment: {
    label: 'Bijlage',
    icon: 'ui-paperclip',
    ContentComponent: AttachmentContent,
    enabled: true
  },
  carousel: {
    label: 'Carousel',
    icon: 'ui-carousel',
    ContentComponent: CarouselContent,
    enabled: true
  },
  'text-graphic': {
    label: 'Tekstbanner',
    icon: 'ui-picture-in-picture',
    ContentComponent: TextGraphicContent,
    enabled: true
  },
  // FAQ — a title + question/answer pairs; becomes an accordion in the TEAMKPN article.
  faq: {
    label: 'FAQ',
    icon: 'ui-questionmark-circle',
    ContentComponent: FaqContent,
    enabled: true
  }
}

// Double-column element types (predetermined combinations)
export const DOUBLE_ELEMENT_TYPES = {
  'paragraph-paragraph': {
    label: 'Alinea + Alinea',
    icon: 'ui-text-square',
    leftType: 'paragraph',
    rightType: 'paragraph',
    enabled: true
  },
  'image-image': {
    label: 'Afbeelding + Afbeelding',
    icon: 'ui-photo',
    leftType: 'image',
    rightType: 'image',
    enabled: true
  },
  'paragraph-image': {
    label: 'Alinea + Afbeelding',
    icon: 'ui-text-square',
    leftType: 'paragraph',
    rightType: 'image',
    enabled: true
  },
  'paragraph-citation': {
    label: 'Alinea + Citaat',
    icon: 'ui-text-square',
    leftType: 'paragraph',
    rightType: 'citation',
    enabled: true
  }
}

// Helper function to get element config by type
export function getSingleElementConfig(type) {
  return SINGLE_ELEMENT_TYPES[type]
}

// Helper function to get double element config by type
export function getDoubleElementConfig(type) {
  return DOUBLE_ELEMENT_TYPES[type]
}

/**
 * The inner blocks of a stored element as [{ type, content }], in display order.
 * Single block → one; double column → left and right (swap applied).
 */
export function getElementParts(element) {
  const double = DOUBLE_ELEMENT_TYPES[element.type]
  if (!double) return [{ type: element.type, content: element.content }]
  const parts = [
    { type: double.leftType, content: element.leftContent },
    { type: double.rightType, content: element.rightContent }
  ]
  return element.swapped ? parts.reverse() : parts
}

/** Whether a stored element (single or double) contains any text. */
export function elementHasText(element) {
  return getElementParts(element).some(({ type, content }) => !!SINGLE_ELEMENT_TYPES[type]?.getText?.(content))
}

// Helper function to check if element type is valid
export function isValidElementType(type) {
  return type in SINGLE_ELEMENT_TYPES || type in DOUBLE_ELEMENT_TYPES
}
