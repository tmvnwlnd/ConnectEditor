import { useState } from 'react'
import DiamondIcon from '../icons/ui-diamond.svg?react'
import TextSquareIcon from '../icons/ui-text-square.svg?react'
import TextBubbleIcon from '../icons/ui-text-bubble.svg?react'
import PhotoIcon from '../icons/ui-photo.svg?react'
import PlayIcon from '../icons/ui-play.svg?react'
import PaperclipIcon from '../icons/ui-paperclip.svg?react'
import SpeakerIcon from '../icons/ui-speaker-high.svg?react'
import SourceIcon from '../icons/ui-source.svg?react'
import GraphIcon from '../icons/ui-graph-up.svg?react'
import CarouselIcon from '../icons/ui-carousel.svg?react'
import SquareGridIcon from '../icons/ui-square-grid-4x4.svg?react'

const ElementSidebar = ({ onAddElement, isPreviewMode }) => {
  const [hoveredItem, setHoveredItem] = useState(null)

  const standardElements = [
    { id: 'header', label: 'Kop', icon: DiamondIcon, enabled: true },
    { id: 'paragraph', label: 'Alinea', icon: TextSquareIcon, enabled: true },
    { id: 'image', label: 'Afbeelding', icon: PhotoIcon, enabled: true },
    { id: 'table', label: 'Tabel', icon: SquareGridIcon, enabled: true },
    { id: 'citation', label: 'Citaat', icon: TextBubbleIcon, enabled: true },
  ]

  const multimediaElements = [
    { id: 'imagemap', label: 'Image Map', icon: PhotoIcon, enabled: false },
    { id: 'video', label: 'Video', icon: PlayIcon, enabled: false },
    { id: 'attachment', label: 'Bijlage', icon: PaperclipIcon, enabled: false },
    { id: 'audio', label: 'Audiofragment', icon: SpeakerIcon, enabled: false },
    { id: 'embed', label: 'Embedcode', icon: SourceIcon, enabled: false },
    { id: 'poll', label: 'Stelling', icon: GraphIcon, enabled: false },
    { id: 'carousel', label: 'Carousel', icon: CarouselIcon, enabled: false },
  ]

  const handleItemClick = (item) => {
    if (item.enabled && !isPreviewMode) {
      onAddElement(item.id)
    }
  }

  const renderElementItem = (item) => {
    const Icon = item.icon
    const isHovered = hoveredItem === item.id

    return (
      <div
        key={item.id}
        className={`element-item ${!item.enabled ? 'disabled' : ''} ${isHovered ? 'hovered' : ''}`}
        onClick={() => handleItemClick(item)}
        onMouseEnter={() => setHoveredItem(item.id)}
        onMouseLeave={() => setHoveredItem(null)}
      >
        <Icon width={20} height={20} className="element-icon" />
        <span className="element-label">{item.label}</span>
        {item.enabled && isHovered && (
          <svg className="plus-icon" width="20" height="20" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M8 3v10M3 8h10" stroke="#00c300" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        )}
      </div>
    )
  }

  return (
    <div className={`element-sidebar-wrapper ${isPreviewMode ? 'preview-mode' : ''}`}>
      <h2 className="sidebar-title">Element toevoegen</h2>

      <div className="element-sidebar">
        <div className="element-category">
          <h3 className="category-title">Standaard</h3>
          <div className="element-list">
            {standardElements.map(renderElementItem)}
          </div>
        </div>

        <div className="element-category">
          <h3 className="category-title">Multimedia</h3>
          <div className="element-list">
            {multimediaElements.map(renderElementItem)}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ElementSidebar
