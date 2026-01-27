import { useState } from 'react'
import Element from './Element'
import DoubleColumnElement from './DoubleColumnElement'
import { SINGLE_ELEMENT_TYPES, DOUBLE_ELEMENT_TYPES } from '../config/elementTypes'
import '../styles/BlockShowcase.css'

/**
 * BlockShowcase Component
 *
 * Demonstrates all available element types (single and double-column)
 * with their enabled/disabled states.
 */
function BlockShowcase() {
  const [focusedId, setFocusedId] = useState(null)
  const [swappedStates, setSwappedStates] = useState({})

  // Handler for swapping columns
  const handleSwap = (type) => {
    setSwappedStates(prev => ({
      ...prev,
      [type]: !prev[type]
    }))
  }

  // Sample content for different element types
  const sampleContent = {
    header: '<h2>Dit is een kop</h2>',
    paragraph: '<p>Dit is een voorbeeldparagraaf met <strong>vetgedrukte</strong> en <em>cursieve</em> tekst. Het bevat meerdere zinnen om te laten zien hoe de tekst wordt weergegeven in de editor.</p>',
    citation: '<blockquote>Dit is een citaat van iemand belangrijk</blockquote>',
    image: {
      image: null,
      altText: '',
      aspectRatio: 'large-square'
    },
    table: {
      rows: 3,
      cols: 3,
      data: [
        ['Cel 1', 'Cel 2', 'Cel 3'],
        ['Cel 4', 'Cel 5', 'Cel 6'],
        ['Cel 7', 'Cel 8', 'Cel 9']
      ]
    },
    video: null,
    attachment: null,
    carousel: null
  }

  return (
    <div className="block-showcase">
      <div className="block-showcase-container">
        <header className="block-showcase-header">
          <h1 className="h1-bold text-green">Block Showcase</h1>
          <p className="body-l text-gray-400">
            Overzicht van alle beschikbare blok types in de nieuwe architectuur
          </p>
        </header>

        {/* Single Column Elements */}
        <section className="showcase-section">
          <h2 className="h4-bold">Enkele Blokken</h2>
          <div className="showcase-grid">
            {Object.entries(SINGLE_ELEMENT_TYPES).map(([type, config]) => (
              <div
                key={type}
                className={`showcase-item ${!config.enabled ? 'disabled' : ''}`}
                onClick={() => setFocusedId(type)}
              >
                <div className="showcase-item-header">
                  <h3 className="h6">{config.label}</h3>
                  {!config.enabled && (
                    <span className="showcase-badge body-s">Nog niet beschikbaar</span>
                  )}
                </div>
                <Element
                  type={type}
                  content={sampleContent[type] || ''}
                  onChange={() => {}}
                  isFocused={focusedId === type}
                  isFirst={false}
                  isLast={false}
                  onMoveUp={() => {}}
                  onMoveDown={() => {}}
                  onDuplicate={() => {}}
                  onDelete={() => {}}
                />
              </div>
            ))}
          </div>
        </section>

        {/* Double Column Elements */}
        <section className="showcase-section">
          <h2 className="h4-bold">Dubbele Kolom Blokken</h2>
          <div className="showcase-grid">
            {Object.entries(DOUBLE_ELEMENT_TYPES).map(([type, config]) => {
              const doubleId = `double-${type}`
              return (
                <div
                  key={type}
                  className={`showcase-item ${!config.enabled ? 'disabled' : ''}`}
                  onClick={() => setFocusedId(doubleId)}
                >
                  <div className="showcase-item-header">
                    <h3 className="h6">{config.label}</h3>
                    {!config.enabled && (
                      <span className="showcase-badge body-s">Nog niet beschikbaar</span>
                    )}
                  </div>
                  <DoubleColumnElement
                    type={type}
                    leftContent={sampleContent[config.leftType] || ''}
                    rightContent={sampleContent[config.rightType] || ''}
                    swapped={swappedStates[type] || false}
                    isFocused={focusedId === doubleId}
                    isFirst={false}
                    isLast={false}
                    onUpdateLeft={() => {}}
                    onUpdateRight={() => {}}
                    onMoveUp={() => {}}
                    onMoveDown={() => {}}
                    onSwap={() => handleSwap(type)}
                    onDuplicate={() => {}}
                    onDelete={() => {}}
                  />
                </div>
              )
            })}
          </div>
        </section>

        {/* Legend */}
        <section className="showcase-legend">
          <h3 className="h6">Legenda</h3>
          <ul className="body-r">
            <li>✅ Groen = Beschikbaar en volledig functioneel</li>
            <li>⚠️ Badge "Nog niet beschikbaar" = Placeholder, nog niet geïmplementeerd</li>
            <li>Klik op een blok om de focus state te zien</li>
            <li>Positioneringsknoppen verschijnen alleen bij focus</li>
          </ul>
        </section>
      </div>
    </div>
  )
}

export default BlockShowcase
