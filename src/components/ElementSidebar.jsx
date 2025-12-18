import SidebarListItem from './SidebarListItem'
import TemplateListItem from './TemplateListItem'
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

const ElementSidebar = ({ onAddElement, onAddTemplate, isPreviewMode }) => {

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
    { id: 'audio', label: 'Audiofragment', icon: SpeakerIcon, enabled: true },
    { id: 'embed', label: 'Embedcode', icon: SourceIcon, enabled: false },
    { id: 'poll', label: 'Stelling', icon: GraphIcon, enabled: false },
    { id: 'carousel', label: 'Carousel', icon: CarouselIcon, enabled: false },
  ]

  const templates = [
    {
      id: 'text-image',
      title: 'Tekst + afbeelding blok',
      description: 'Blokken van afbeeldingen en tekst naast elkaar.'
    },
    {
      id: 'pictorial',
      title: 'Pictorial',
      description: 'Blokken van afbeeldingen en tekst naast elkaar.'
    },
    {
      id: 'interview',
      title: 'Interview',
      description: 'Audiofragment + afwisselend kop en tekst + foto'
    }
  ]

  const handleItemClick = (itemId) => {
    if (!isPreviewMode) {
      onAddElement(itemId)
    }
  }

  const handleTemplateClick = (templateId) => {
    if (!isPreviewMode && onAddTemplate) {
      onAddTemplate(templateId)
    }
  }

  return (
    <div className={`element-sidebar-wrapper ${isPreviewMode ? 'preview-mode' : ''}`}>
      <h2 className="sidebar-title">Element toevoegen</h2>

      <div className="element-sidebar">
        <div className="element-category">
          <h3 className="category-title">Standaard</h3>
          <div className="element-list">
            {standardElements.map(item => (
              <SidebarListItem
                key={item.id}
                id={item.id}
                label={item.label}
                icon={item.icon}
                enabled={item.enabled}
                onClick={handleItemClick}
              />
            ))}
          </div>
        </div>

        <div className="element-category">
          <h3 className="category-title">Multimedia</h3>
          <div className="element-list">
            {multimediaElements.map(item => (
              <SidebarListItem
                key={item.id}
                id={item.id}
                label={item.label}
                icon={item.icon}
                enabled={item.enabled}
                onClick={handleItemClick}
              />
            ))}
          </div>
        </div>

        <div className="element-category">
          <h3 className="category-title">Templates</h3>
          <div className="template-list">
            {templates.map(template => (
              <TemplateListItem
                key={template.id}
                id={template.id}
                title={template.title}
                description={template.description}
                onClick={handleTemplateClick}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ElementSidebar
