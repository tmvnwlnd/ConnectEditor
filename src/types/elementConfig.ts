/**
 * Element Configuration Types
 *
 * Types for the element type registry in src/config/elementTypes.js.
 * This maps each element type string to its label, icon, and component.
 */

import type { SingleElementType } from './content'
import type { DoubleElementType } from './elements'

// ---------------------------------------------------------------------------
// Single-column element config
// ---------------------------------------------------------------------------

export interface SingleElementConfig {
  /** Display label in Dutch, e.g. 'Alinea' */
  label: string
  /** KPN icon bank name, e.g. 'ui-text-square' */
  icon: string
  /** React component that renders/edits this content type */
  ContentComponent: React.ComponentType<unknown>
  /** Whether this element type is available in the element picker */
  enabled: boolean
}

export type SingleElementRegistry = Record<SingleElementType, SingleElementConfig>

// ---------------------------------------------------------------------------
// Double-column element config
// ---------------------------------------------------------------------------

export interface DoubleElementConfig {
  label: string
  icon: string
  /** The content type used for the left column */
  leftType: SingleElementType
  /** The content type used for the right column */
  rightType: SingleElementType
  enabled: boolean
}

export type DoubleElementRegistry = Record<DoubleElementType, DoubleElementConfig>
