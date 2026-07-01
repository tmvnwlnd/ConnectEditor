import { useEffect, useRef, useState } from 'react'
import { Button, ColorPicker, SegmentedControl } from '../ds'
import { validateFileType, validateFileSize } from '../../utils/validation'
import '../../styles/TextGraphicContent.css'

/**
 * TextGraphicContent Component
 *
 * Content renderer for the "Tekstbanner" (text graphic) element.
 * Renders editable text on top of either a solid background colour or an
 * uploaded image. Uploaded images get a subtle black fade; text always
 * carries a soft shadow for legibility.
 *
 * The text colour is not user-editable — it is derived from the background
 * so contrast is always correct (lime → black text, everything else → white).
 *
 * Content shape:
 *   { text, textColor, bgType: 'color' | 'image', bgColor, image, sourceType? }
 */

// Only these four background colours are allowed
const BG_GREEN = '#00c300'
const BG_LIME = '#ddff44'
const BG_BLACK = '#131313'
const BG_RED = '#e22e22'

const BG_SWATCHES = [BG_GREEN, BG_LIME, BG_BLACK, BG_RED]
const DEFAULT_BG_COLOR = BG_GREEN

// Text colour is fixed per background; lime is the only one with black text.
const TEXT_ON_BG = {
  [BG_GREEN]: '#ffffff',
  [BG_LIME]: '#131313',
  [BG_BLACK]: '#ffffff',
  [BG_RED]: '#ffffff',
}

// Derive the text colour from the background (image backgrounds → white).
const getTextColor = (bgType, bgColor) =>
  bgType === 'image' ? '#ffffff' : (TEXT_ON_BG[(bgColor || '').toLowerCase()] || '#ffffff')

const BG_OPTIONS = [
  { id: 'color', label: 'Kleur' },
  { id: 'image', label: 'Afbeelding' },
]

const TextGraphicContent = ({ content, onChange, isFocused }) => {
  const [text, setText] = useState(content?.text || '')
  const [bgType, setBgType] = useState(content?.bgType || 'color')
  const [bgColor, setBgColor] = useState(content?.bgColor || DEFAULT_BG_COLOR)
  const [image, setImage] = useState(content?.image || null)
  const [fileError, setFileError] = useState('')
  const fileInputRef = useRef(null)
  const textRef = useRef(null)

  // Grow the textarea to fit its content so the graphic wraps the text height.
  const autoSize = (el) => {
    if (!el) return
    el.style.height = 'auto'
    el.style.height = `${el.scrollHeight}px`
  }

  useEffect(() => {
    autoSize(textRef.current)
  }, [text])

  // Emit the full content object, applying any just-changed fields on top of
  // current state (avoids stale values from async setState). Text colour is
  // always recomputed from the resulting background.
  const emit = (overrides = {}) => {
    if (onChange) {
      const next = { text, bgType, bgColor, image, ...overrides }
      next.textColor = getTextColor(next.bgType, next.bgColor)
      onChange(next)
    }
  }

  const handleTextChange = (e) => {
    setText(e.target.value)
    emit({ text: e.target.value })
  }

  const handleBgTypeChange = (type) => {
    setBgType(type)
    emit({ bgType: type })
  }

  const handleBgColorChange = (color) => {
    setBgColor(color)
    emit({ bgColor: color })
  }

  const handleFileSelect = (e) => {
    const file = e.target.files[0]
    if (!file) return
    setFileError('')

    const typeError = validateFileType(
      file,
      ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
      '.jpeg, .png, .gif of .webp'
    )
    if (typeError) {
      setFileError(typeError)
      return
    }

    const sizeError = validateFileSize(file, 10)
    if (sizeError) {
      setFileError(sizeError)
      return
    }

    // Free the previous blob URL before replacing it
    if (image && image.startsWith('blob:')) {
      URL.revokeObjectURL(image)
    }

    const imageUrl = URL.createObjectURL(file)
    setImage(imageUrl)
    setBgType('image')
    emit({ image: imageUrl, bgType: 'image', sourceType: 'upload' })
  }

  const handleBrowseClick = () => {
    fileInputRef.current?.click()
  }

  const handleRemoveImage = () => {
    if (image && image.startsWith('blob:')) {
      URL.revokeObjectURL(image)
    }
    setImage(null)
    emit({ image: null })
  }

  const textColor = getTextColor(bgType, bgColor)
  const usingImage = bgType === 'image' && image
  const canvasStyle = usingImage
    ? { backgroundImage: `url(${image})` }
    : bgType === 'image'
      ? { backgroundColor: 'var(--gray-200)' } // image mode, awaiting upload
      : { backgroundColor: bgColor }

  return (
    <div className="text-graphic-content">
      {/* Live graphic canvas with editable text */}
      <div className="text-graphic-canvas" style={canvasStyle}>
        {usingImage && <div className="text-graphic-fade" aria-hidden="true" />}
        <textarea
          ref={textRef}
          className="text-graphic-text-input"
          value={text}
          onChange={handleTextChange}
          placeholder="Typ je tekst…"
          rows={1}
          spellCheck={false}
          style={{ color: textColor }}
        />
      </div>

      {/* Controls (only while focused, matching other block editors) */}
      {isFocused && (
        <div className="text-graphic-controls">
          <div className="text-graphic-control">
            <span className="text-graphic-label">Achtergrond</span>
            <SegmentedControl
              options={BG_OPTIONS}
              value={bgType}
              onChange={handleBgTypeChange}
            />
          </div>

          {bgType === 'color' ? (
            <div className="text-graphic-control">
              <span className="text-graphic-label">Achtergrondkleur</span>
              <ColorPicker
                value={bgColor}
                onChange={handleBgColorChange}
                swatches={BG_SWATCHES}
                allowCustom={false}
              />
            </div>
          ) : (
            <div className="text-graphic-control">
              <span className="text-graphic-label">Afbeelding</span>
              <div className="text-graphic-image-actions">
                <Button variant="secondary" onClick={handleBrowseClick}>
                  {image ? 'Vervang afbeelding' : 'Browse mijn computer'}
                </Button>
                {image && (
                  <Button variant="ghost" icon="ui-trash" onClick={handleRemoveImage}>
                    Verwijder
                  </Button>
                )}
              </div>
              {!image && (
                <p className="body-r text-gray-300">.jpeg, .png, .gif of .webp · max 10 MB</p>
              )}
              {fileError && <p className="body-r field-error-message">{fileError}</p>}
            </div>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/gif,image/webp"
            onChange={handleFileSelect}
            style={{ display: 'none' }}
          />
        </div>
      )}
    </div>
  )
}

export default TextGraphicContent
