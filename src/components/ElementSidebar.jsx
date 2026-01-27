import SidebarListItem from './SidebarListItem'
import { SINGLE_ELEMENT_TYPES, DOUBLE_ELEMENT_TYPES } from '../config/elementTypes'

/**
 * ElementSidebar Component
 *
 * Sidebar for adding elements to the article.
 * Shows three categories: text, media, and double-column elements.
 *
 * @param {Function} onAddElement - Handler for adding single-column elements
 * @param {Function} onAddDoubleElement - Handler for adding double-column elements
 * @param {boolean} isPreviewMode - Whether preview mode is active
 */
const ElementSidebar = ({ onAddElement, onAddDoubleElement, isPreviewMode }) => {
  const handleSingleClick = (itemId) => {
    if (!isPreviewMode && onAddElement) {
      onAddElement(itemId)
    }
  }

  const handleDoubleClick = (itemId) => {
    if (!isPreviewMode && onAddDoubleElement) {
      onAddDoubleElement(itemId)
    }
  }

  // Text elements
  const textElements = ['header', 'paragraph', 'citation', 'table']

  // Media elements
  const mediaElements = ['image', 'video', 'audio', 'attachment', 'carousel']

  return (
    <div className={`element-sidebar-wrapper ${isPreviewMode ? 'preview-mode' : ''}`}>
      <div className="element-sidebar">
        {/* Text Elements */}
        <div className="element-category">
          <h5 className="category-title">Tekst</h5>
          <div className="element-list">
            {textElements.map(id => {
              const config = SINGLE_ELEMENT_TYPES[id]
              if (!config) return null
              return (
                <SidebarListItem
                  key={id}
                  id={id}
                  label={config.label}
                  iconName={config.icon}
                  enabled={config.enabled}
                  onClick={handleSingleClick}
                />
              )
            })}
          </div>
        </div>

        {/* Media Elements */}
        <div className="element-category">
          <h5 className="category-title">Media</h5>
          <div className="element-list">
            {mediaElements.map(id => {
              const config = SINGLE_ELEMENT_TYPES[id]
              if (!config) return null
              return (
                <SidebarListItem
                  key={id}
                  id={id}
                  label={config.label}
                  iconName={config.icon}
                  enabled={config.enabled}
                  onClick={handleSingleClick}
                />
              )
            })}
          </div>
        </div>

        {/* Double Column Elements */}
        <div className="element-category">
          <h5 className="category-title">Tweekolomslayout</h5>
          <div className="element-list">
            {Object.entries(DOUBLE_ELEMENT_TYPES).map(([id, config]) => (
              <SidebarListItem
                key={id}
                id={id}
                label={config.label}
                iconName={config.icon}
                enabled={config.enabled}
                onClick={handleDoubleClick}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ElementSidebar
