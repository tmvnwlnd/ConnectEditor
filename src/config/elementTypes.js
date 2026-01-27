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

// Single-column element types
export const SINGLE_ELEMENT_TYPES = {
  header: {
    label: 'Kop',
    icon: 'ui-diamond',
    ContentComponent: HeaderContent,
    enabled: true
  },
  paragraph: {
    label: 'Alinea',
    icon: 'ui-text-square',
    ContentComponent: ParagraphContent,
    enabled: true
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
    enabled: true
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

// Helper function to check if element type is valid
export function isValidElementType(type) {
  return type in SINGLE_ELEMENT_TYPES || type in DOUBLE_ELEMENT_TYPES
}
