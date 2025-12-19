import { useState } from 'react'
import ElementWrapper from './ElementWrapper'
import HeaderContent from './content/HeaderContent'
import ParagraphContent from './content/ParagraphContent'
import CitationContent from './content/CitationContent'
import ImageContent from './content/ImageContent'
import TableContent from './content/TableContent'
import AudioContent from './content/AudioContent'

// Icons
import DiamondIcon from '../icons/ui-diamond.svg?react'
import TextSquareIcon from '../icons/ui-text-square.svg?react'
import TextBubbleIcon from '../icons/ui-text-bubble.svg?react'
import PhotoIcon from '../icons/ui-photo.svg?react'
import SquareGridIcon from '../icons/ui-square-grid-4x4.svg?react'
import SpeakerIcon from '../icons/ui-speaker-high.svg?react'

/**
 * Element Component
 *
 * Unified element component that renders any element type using the ElementWrapper
 * pattern. This makes adding new element types simple - just add to the config
 * and create a corresponding content component.
 */
const Element = ({
  type,
  content,
  onChange,
  isFocused = false,
  isFirst = false,
  isLast = false,
  isLinking = false,
  onMoveUp,
  onMoveDown,
  onLink,
  onDuplicate,
  onDelete
}) => {
  // State for dimming positioning buttons (used by TableContent)
  const [dimPositioningButtons, setDimPositioningButtons] = useState(false)

  // Element type configuration
  const elementConfig = {
    header: {
      label: 'Kop',
      icon: DiamondIcon,
      ContentComponent: HeaderContent
    },
    paragraph: {
      label: 'Alinea',
      icon: TextSquareIcon,
      ContentComponent: ParagraphContent
    },
    citation: {
      label: 'Citaat',
      icon: TextBubbleIcon,
      ContentComponent: CitationContent
    },
    image: {
      label: 'Afbeelding',
      icon: PhotoIcon,
      ContentComponent: ImageContent
    },
    table: {
      label: 'Tabel',
      icon: SquareGridIcon,
      ContentComponent: TableContent
    },
    audio: {
      label: 'Audiofragment',
      icon: SpeakerIcon,
      ContentComponent: AudioContent
    }
  }

  const config = elementConfig[type]
  if (!config) {
    console.error(`Unknown element type: ${type}`)
    return null
  }

  const { label, icon, ContentComponent } = config

  return (
    <ElementWrapper
      elementType={type}
      label={label}
      icon={icon}
      isFocused={isFocused}
      isFirst={isFirst}
      isLast={isLast}
      isLinking={isLinking}
      onMoveUp={onMoveUp}
      onMoveDown={onMoveDown}
      onLink={onLink}
      onDuplicate={onDuplicate}
      onDelete={onDelete}
      dimPositioningButtons={dimPositioningButtons}
    >
      <ContentComponent
        content={content}
        onChange={onChange}
        isFocused={isFocused}
        onDimPositioningButtons={setDimPositioningButtons}
      />
    </ElementWrapper>
  )
}

export default Element
