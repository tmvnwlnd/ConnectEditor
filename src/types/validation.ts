/**
 * Validation Types
 *
 * Type signatures for the validation utility functions in src/utils/validation.js.
 * These can be used when the validation module is migrated to TypeScript,
 * or referenced by backend code that shares the same validation rules.
 */

/** A validation result — null means valid, string is the error message */
export type ValidationResult = string | null

/** A validation function that checks a single value */
export type Validator<T = string> = (value: T) => ValidationResult

// ---------------------------------------------------------------------------
// Validation function signatures
// ---------------------------------------------------------------------------

export type ValidateRequired = (value: string, fieldName: string) => ValidationResult
export type ValidateUrl = (value: string) => ValidationResult
export type ValidateMinSelection = (list: unknown[], min: number, fieldName: string) => ValidationResult
export type ValidateDateRequired = (date: Date | null, fieldName: string) => ValidationResult
export type ValidateDateAfter = (date: Date, afterDate: Date) => ValidationResult
export type WarnLength = (value: string, min: number, max: number, fieldName: string) => ValidationResult
export type ValidateFileType = (file: File, allowedTypes: string[], description: string) => ValidationResult
export type ValidateFileSize = (file: File, maxMB: number) => ValidationResult

// ---------------------------------------------------------------------------
// File upload constraints
// ---------------------------------------------------------------------------

export interface FileConstraints {
  /** Allowed MIME types, e.g. ['image/jpeg', 'image/png', 'image/gif'] */
  allowedTypes: string[]
  /** Human-readable description of allowed types, e.g. 'JPG, PNG of GIF' */
  typeDescription: string
  /** Maximum file size in megabytes */
  maxSizeMB: number
}

export const IMAGE_CONSTRAINTS: FileConstraints = {
  allowedTypes: ['image/jpeg', 'image/png', 'image/gif'],
  typeDescription: 'JPG, PNG of GIF',
  maxSizeMB: 10,
}

export const VIDEO_CONSTRAINTS: FileConstraints = {
  allowedTypes: ['video/mp4', 'video/webm', 'video/ogg'],
  typeDescription: 'MP4, WebM of OGG',
  maxSizeMB: 100,
}

export const AUDIO_CONSTRAINTS: FileConstraints = {
  allowedTypes: ['audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/ogg'],
  typeDescription: 'MP3, WAV of OGG',
  maxSizeMB: 50,
}

export const ATTACHMENT_CONSTRAINTS: FileConstraints = {
  allowedTypes: [], // any type allowed
  typeDescription: 'Alle bestandstypen',
  maxSizeMB: 50,
}
