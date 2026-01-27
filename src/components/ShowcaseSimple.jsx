/**
 * Simple Showcase Test
 */

import { useState } from 'react'
import { Button, Pill, Tag, TextField, TextArea, Dropdown } from './ds'
import '../styles/Showcase.css'

const ShowcaseSimple = () => {
  const [textValue, setTextValue] = useState('')
  const [dropdownValue, setDropdownValue] = useState('')

  return (
    <div className="showcase">
      <div className="showcase-container">
        <header className="showcase-header">
          <h1>Design System Showcase</h1>
          <p className="body-l text-gray-400">Testing components</p>
        </header>

        {/* Buttons Section */}
        <section className="showcase-section">
          <h2 className="section-title">Buttons (No Icons)</h2>

          <div className="component-group">
            <h3 className="component-title">Primary Buttons</h3>
            <div className="component-examples horizontal">
              <Button variant="primary">Primary Button</Button>
              <Button variant="primary" disabled>Disabled</Button>
            </div>
          </div>

          <div className="component-group">
            <h3 className="component-title">Secondary Buttons</h3>
            <div className="component-examples horizontal">
              <Button variant="secondary">Secondary Button</Button>
              <Button variant="secondary" disabled>Disabled</Button>
            </div>
          </div>

          <div className="component-group">
            <h3 className="component-title">Lime Buttons</h3>
            <div className="component-examples horizontal">
              <Button variant="lime">Lime Button</Button>
              <Button variant="lime" disabled>Disabled</Button>
            </div>
          </div>

          <div className="component-group">
            <h3 className="component-title">Ghost Buttons</h3>
            <div className="component-examples horizontal">
              <Button variant="ghost">Ghost Default</Button>
              <Button variant="ghost" size="compact">Ghost Compact</Button>
              <Button variant="ghost" disabled>Disabled</Button>
            </div>
          </div>
        </section>

        {/* Tags Section */}
        <section className="showcase-section">
          <h2 className="section-title">Tags</h2>

          <div className="component-group">
            <h3 className="component-title">Tag Variants</h3>
            <div className="component-examples horizontal">
              <Tag variant="lime">Lime Tag</Tag>
              <Tag variant="white-outline">White Outline</Tag>
              <Tag variant="white">White Tag</Tag>
            </div>
          </div>
        </section>

        {/* Form Components Section */}
        <section className="showcase-section">
          <h2 className="section-title">Form Components</h2>

          <div className="component-group">
            <h3 className="component-title">Text Fields</h3>
            <div className="component-examples vertical">
              <TextField
                label="Default Text Field"
                value={textValue}
                onChange={(e) => setTextValue(e.target.value)}
                placeholder="Enter text here..."
              />
              <TextField
                label="Disabled Field"
                value="Cannot edit this"
                disabled
              />
            </div>
          </div>

          <div className="component-group">
            <h3 className="component-title">Dropdown</h3>
            <div className="component-examples vertical">
              <Dropdown
                label="Select an Option"
                value={dropdownValue}
                onChange={(e) => setDropdownValue(e.target.value)}
                options={[
                  { value: 'option1', label: 'Option 1' },
                  { value: 'option2', label: 'Option 2' },
                  { value: 'option3', label: 'Option 3' }
                ]}
                placeholder="Choose one..."
              />
            </div>
          </div>
        </section>

        {/* Color Tokens Section */}
        <section className="showcase-section">
          <h2 className="section-title">Colors</h2>

          <div className="component-group">
            <h3 className="component-title">Color Palette</h3>
            <div className="color-grid">
              <div className="color-swatch">
                <div className="color-block" style={{background: 'var(--kpn-green-500)'}}></div>
                <span className="body-s">Green 500</span>
                <span className="body-s text-gray-400">#00c300</span>
              </div>
              <div className="color-swatch">
                <div className="color-block" style={{background: 'var(--kpn-blue-500)'}}></div>
                <span className="body-s">Blue 500</span>
                <span className="body-s text-gray-400">#0066ee</span>
              </div>
              <div className="color-swatch">
                <div className="color-block" style={{background: 'var(--kpn-lime-500)'}}></div>
                <span className="body-s">Lime 500</span>
                <span className="body-s text-gray-400">#ddff44</span>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}

export default ShowcaseSimple
