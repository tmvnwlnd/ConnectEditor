/**
 * Component Showcase
 * Displays all design system components with their variants
 */

import { useState } from 'react'
import { Button, Icon, Pill, Tag, Tabs, TextField, TextArea, Dropdown, PageHeader } from './ds'
import JudithButton from './ds/JudithButton'
import '../styles/Showcase.css'

const Showcase = () => {
  // State for interactive components
  const [textValue, setTextValue] = useState('')
  const [searchValue, setSearchValue] = useState('')
  const [textareaValue, setTextareaValue] = useState('')
  const [dropdownValue, setDropdownValue] = useState('')
  const [selectedPills, setSelectedPills] = useState(['pill2'])
  const [activeTab, setActiveTab] = useState('tab1')

  const togglePill = (pillId) => {
    setSelectedPills(prev =>
      prev.includes(pillId)
        ? prev.filter(id => id !== pillId)
        : [...prev, pillId]
    )
  }

  const iconNames = [
    'ui-check', 'ui-x', 'ui-plus', 'ui-trash', 'ui-pencil-line',
    'ui-arrow-right', 'ui-arrow-left', 'ui-calendar', 'ui-photo',
    'ui-info', 'ui-star', 'ui-chevron-down', 'ui-magnifyingglass'
  ]

  console.log('Showcase rendering...')

  return (
    <div className="showcase">
      <div className="showcase-container">
        <header className="showcase-header">
          <h1>Design System Showcase</h1>
          <p className="body-l text-gray-400">
            All components from the Editor Project design system
          </p>
        </header>

        {/* Typography Section */}
        <section className="showcase-section">
          <h2 className="section-title">Typography</h2>

          <div className="component-group">
            <h3 className="component-title">Headers - Semibold (Default)</h3>
            <div className="component-examples">
              <h1>Heading 1 - 72px Semibold</h1>
              <h2>Heading 2 - 56px Semibold</h2>
              <h3>Heading 3 - 40px Semibold</h3>
              <h4>Heading 4 - 32px Semibold</h4>
              <h5>Heading 5 - 24px Semibold</h5>
              <h6>Heading 6 - 21px Semibold</h6>
            </div>
          </div>

          <div className="component-group">
            <h3 className="component-title">Headers - Bold</h3>
            <div className="component-examples">
              <h1 className="h1-bold">Heading 1 - 72px Bold</h1>
              <h2 className="h2-bold">Heading 2 - 56px Bold</h2>
              <h3 className="h3-bold">Heading 3 - 40px Bold</h3>
              <h4 className="h4-bold">Heading 4 - 32px Bold</h4>
              <h5 className="h5-bold">Heading 5 - 24px Bold</h5>
              <h6 className="h6-bold">Heading 6 - 21px Bold</h6>
            </div>
          </div>

          <div className="component-group">
            <h3 className="component-title">Body Text</h3>
            <div className="component-examples">
              <p className="body-xxl">Body XXL - 32px/40px</p>
              <p className="body-xl">Body XL - 24px/32px</p>
              <p className="body-l">Body L - 20px/28px</p>
              <p className="body-r">Body R - 16px/24px (Default)</p>
              <p className="body-s">Body S - 12px/16px</p>
            </div>
          </div>

          <div className="component-group">
            <h3 className="component-title">Text Utilities</h3>
            <div className="component-examples">
              <p className="body-r text-white" style={{background: 'var(--gray-500)', padding: '8px', borderRadius: '4px'}}>White text</p>
              <p className="body-r text-gray-400">Gray 400 text</p>
              <p className="body-r text-green">Green text</p>
              <p className="body-r text-blue">Blue text</p>
              <p className="body-r text-lime">Lime text</p>
              <p className="body-r-bold">Bold text</p>
              <p className="body-r text-uppercase">Uppercase text</p>
            </div>
          </div>
        </section>

        {/* Page Header Section */}
        <section className="showcase-section">
          <h2 className="section-title">Page Header</h2>

          <div className="component-group">
            <h3 className="component-title">Page Header</h3>
            <p className="body-s text-gray-400" style={{ marginBottom: 'var(--s-medium)' }}>
              Standard page header with green title and step indicator. Used across all main pages.
            </p>
            <div className="component-examples vertical">
              <PageHeader step="Stap 1 van 3" />
              <PageHeader step="Stap 2 van 3" />
              <PageHeader step="Stap 3 van 3" />
              <PageHeader title="Custom Title" step="Stap 1 van 5" />
            </div>
          </div>
        </section>

        {/* Icons Section */}
        <section className="showcase-section">
          <h2 className="section-title">Icons</h2>

          <div className="component-group">
            <h3 className="component-title">Icon Collection</h3>
            <div className="icon-grid">
              {iconNames.map(iconName => (
                <div key={iconName} className="icon-example">
                  <Icon name={iconName} size={24} />
                  <span className="body-s text-gray-400">{iconName}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="component-group">
            <h3 className="component-title">Icon Sizes</h3>
            <div className="component-examples icon-sizes">
              <div className="icon-size-example">
                <Icon name="ui-star" size={16} />
                <span className="body-s">16px</span>
              </div>
              <div className="icon-size-example">
                <Icon name="ui-star" size={24} />
                <span className="body-s">24px</span>
              </div>
              <div className="icon-size-example">
                <Icon name="ui-star" size={40} />
                <span className="body-s">40px</span>
              </div>
              <div className="icon-size-example">
                <Icon name="ui-star" size={64} />
                <span className="body-s">64px</span>
              </div>
            </div>
          </div>

          <div className="component-group">
            <h3 className="component-title">Icon Colors</h3>
            <div className="component-examples icon-colors">
              <Icon name="ui-check" size={32} color="var(--kpn-green-500)" />
              <Icon name="ui-check" size={32} color="var(--kpn-blue-500)" />
              <Icon name="ui-check" size={32} color="var(--kpn-lime-500)" />
              <Icon name="ui-trash" size={32} color="var(--kpn-red-500)" />
              <Icon name="ui-check" size={32} color="var(--gray-400)" />
            </div>
          </div>
        </section>

        {/* Buttons Section */}
        <section className="showcase-section">
          <h2 className="section-title">Buttons</h2>

          <div className="component-group">
            <h3 className="component-title">Primary Buttons</h3>
            <div className="component-examples horizontal">
              <Button variant="primary">Primary Button</Button>
              <Button variant="primary" icon="ui-arrow-right">With Icon</Button>
              <Button variant="primary" iconStart="ui-plus">Icon Start</Button>
              <Button variant="primary" iconStart="ui-check" icon="ui-arrow-right">Both Icons</Button>
              <Button variant="primary" disabled>Disabled</Button>
            </div>
          </div>

          <div className="component-group">
            <h3 className="component-title">Secondary Buttons</h3>
            <div className="component-examples horizontal">
              <Button variant="secondary">Secondary Button</Button>
              <Button variant="secondary" icon="ui-arrow-right">With Icon</Button>
              <Button variant="secondary" iconStart="ui-plus">Icon Start</Button>
              <Button variant="secondary" disabled>Disabled</Button>
            </div>
          </div>

          <div className="component-group">
            <h3 className="component-title">Lime Buttons</h3>
            <div className="component-examples horizontal">
              <Button variant="lime">Lime Button</Button>
              <Button variant="lime" icon="ui-arrow-right">With Icon</Button>
              <Button variant="lime" iconStart="ui-plus">Icon Start</Button>
              <Button variant="lime" disabled>Disabled</Button>
            </div>
          </div>

          <div className="component-group">
            <h3 className="component-title">Ghost Buttons (Subtle)</h3>
            <div className="component-examples horizontal">
              <Button variant="ghost">Ghost Default</Button>
              <Button variant="ghost" size="compact">Ghost Compact (32px)</Button>
              <Button variant="ghost" icon="ui-arrow-right">With Icon</Button>
              <Button variant="ghost" disabled>Disabled</Button>
            </div>
          </div>

          <div className="component-group">
            <h3 className="component-title">Blue Buttons</h3>
            <div className="component-examples horizontal">
              <Button variant="blue">Blue Button</Button>
              <Button variant="secondary-blue">Secondary Blue</Button>
              <Button variant="blue" disabled>Disabled</Button>
            </div>
          </div>

          <div className="component-group">
            <h3 className="component-title">Lime Buttons (Updated)</h3>
            <div className="component-examples horizontal">
              <Button variant="lime">Lime Button</Button>
              <Button variant="secondary-lime">Secondary Lime</Button>
              <Button variant="lime" disabled>Disabled</Button>
            </div>
          </div>

          <div className="component-group">
            <h3 className="component-title">Red Buttons</h3>
            <div className="component-examples horizontal">
              <Button variant="red">Red Button</Button>
              <Button variant="secondary-red">Secondary Red</Button>
              <Button variant="red" disabled>Disabled</Button>
            </div>
          </div>

          <div className="component-group">
            <h3 className="component-title">Icon-Only Buttons (40x40px Circular)</h3>
            <div className="component-examples horizontal">
              <Button variant="icon-only" icon="ui-plus" aria-label="Add" />
              <Button variant="icon-only" iconColor="primary" icon="ui-check" aria-label="Check Primary" />
              <Button variant="icon-only" iconColor="secondary" icon="ui-pencil-line" aria-label="Edit Secondary" />
              <Button variant="icon-only" iconColor="lime" icon="ui-star" aria-label="Star Lime" />
              <Button variant="icon-only" iconColor="red" icon="ui-trash" aria-label="Delete Red" />
              <Button variant="icon-only" icon="ui-calendar" aria-label="Calendar" disabled />
            </div>
          </div>
        </section>

        {/* Pills Section */}
        <section className="showcase-section">
          <h2 className="section-title">Pills</h2>

          <div className="component-group">
            <h3 className="component-title">Default Size (32px)</h3>
            <div className="component-examples horizontal">
              <Pill
                variant="default"
                isSelected={selectedPills.includes('pill1')}
                onClick={() => togglePill('pill1')}
              >
                Unselected
              </Pill>
              <Pill
                variant="default"
                isSelected={selectedPills.includes('pill2')}
                onClick={() => togglePill('pill2')}
              >
                Selected
              </Pill>
              <Pill
                variant="default"
                isSelected={selectedPills.includes('pill3')}
                onClick={() => togglePill('pill3')}
              >
                Click me
              </Pill>
              <Pill variant="default" disabled>Disabled</Pill>
            </div>
          </div>

          <div className="component-group">
            <h3 className="component-title">Large Size (40px)</h3>
            <div className="component-examples horizontal">
              <Pill
                variant="large"
                isSelected={selectedPills.includes('pill4')}
                onClick={() => togglePill('pill4')}
              >
                Large Unselected
              </Pill>
              <Pill
                variant="large"
                isSelected={selectedPills.includes('pill5')}
                onClick={() => togglePill('pill5')}
              >
                Large Selected
              </Pill>
              <Pill variant="large" disabled>Large Disabled</Pill>
            </div>
          </div>

          <div className="component-group">
            <h3 className="component-title">Without Close Icon</h3>
            <div className="component-examples horizontal">
              <Pill
                variant="default"
                isSelected={selectedPills.includes('pill6')}
                showCloseIcon={false}
                onClick={() => togglePill('pill6')}
              >
                No Close Icon
              </Pill>
              <Pill
                variant="large"
                isSelected={selectedPills.includes('pill7')}
                showCloseIcon={false}
                onClick={() => togglePill('pill7')}
              >
                Large No Close
              </Pill>
            </div>
          </div>
        </section>

        {/* Tabs Section */}
        <section className="showcase-section">
          <h2 className="section-title">Tabs</h2>

          <div className="component-group">
            <h3 className="component-title">Tabs Without Icons</h3>
            <div className="component-examples vertical">
              <Tabs
                tabs={[
                  { id: 'tab1', label: 'Overview' },
                  { id: 'tab2', label: 'Details' },
                  { id: 'tab3', label: 'Settings' },
                  { id: 'tab4', label: 'History' }
                ]}
                activeTab={activeTab}
                onChange={setActiveTab}
              />
              <p className="body-s text-gray-400">Active tab: {activeTab}</p>
            </div>
          </div>

          <div className="component-group">
            <h3 className="component-title">Tabs With Icons</h3>
            <div className="component-examples vertical">
              <Tabs
                tabs={[
                  { id: 'home', label: 'Home', icon: 'ui-house' },
                  { id: 'search', label: 'Search', icon: 'ui-magnifyingglass' },
                  { id: 'settings', label: 'Settings', icon: 'ui-wrench' },
                  { id: 'profile', label: 'Profile', icon: 'ui-person' }
                ]}
                activeTab={activeTab}
                onChange={setActiveTab}
              />
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

          <div className="component-group">
            <h3 className="component-title">Tags in Use</h3>
            <div className="component-examples horizontal">
              <Tag variant="lime">KPN Ultimate</Tag>
              <Tag variant="lime">News</Tag>
              <Tag variant="lime">Technology</Tag>
              <Tag variant="lime">Innovation</Tag>
            </div>
          </div>
        </section>

        {/* Form Components Section */}
        <section className="showcase-section">
          <h2 className="section-title">Form Components</h2>

          <div className="component-group">
            <h3 className="component-title">Text Fields (40px height)</h3>
            <div className="component-examples vertical">
              <TextField
                label="Default Text Field"
                value={textValue}
                onChange={(e) => setTextValue(e.target.value)}
                placeholder="Enter text here..."
              />
              <TextField
                label="With Start Icon"
                value={textValue}
                onChange={(e) => setTextValue(e.target.value)}
                placeholder="Email address..."
                startIcon="ui-envelope"
              />
              <TextField
                label="With End Icon"
                value={textValue}
                onChange={(e) => setTextValue(e.target.value)}
                placeholder="Search..."
                endIcon="ui-magnifyingglass"
              />
              <TextField
                label="With AI Assistant (Judith Button)"
                value={textValue}
                onChange={(e) => setTextValue(e.target.value)}
                placeholder="Type your text..."
                endButton={<JudithButton />}
              />
              <TextField
                variant="search"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                placeholder="Search articles..."
                startIcon="ui-magnifyingglass"
                hideStartIconOnFocus={true}
              />
              <TextField
                label="Disabled Field"
                value="Cannot edit this"
                disabled
              />
            </div>
          </div>

          <div className="component-group">
            <h3 className="component-title">Text Area</h3>
            <div className="component-examples vertical">
              <TextArea
                label="Multi-line Text Area"
                value={textareaValue}
                onChange={(e) => setTextareaValue(e.target.value)}
                placeholder="Enter multiple lines of text..."
                rows={4}
              />
              <TextArea
                label="With AI Assistant (Judith Button)"
                value={textareaValue}
                onChange={(e) => setTextareaValue(e.target.value)}
                placeholder="Write your article introduction..."
                rows={4}
                endButton={<JudithButton />}
              />
            </div>
          </div>
        </section>

        {/* Judith AI Button Section */}
        <section className="showcase-section">
          <h2 className="section-title">Judith AI Assistant</h2>

          <div className="component-group">
            <h3 className="component-title">AI Assistant Button</h3>
            <p className="body-s text-gray-400" style={{ marginBottom: 'var(--s-medium)' }}>
              Dedicated button for AI-assisted content generation. Shows a prompt interface when clicked.
            </p>
            <div className="component-examples vertical">
              <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                <JudithButton />
              </div>
            </div>
          </div>
        </section>

        {/* Dropdowns Section */}
        <section className="showcase-section">
          <h2 className="section-title">Dropdowns</h2>

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
                  { value: 'option3', label: 'Option 3' },
                  { value: 'option4', label: 'Option 4' }
                ]}
                placeholder="Choose one..."
              />
              <Dropdown
                label="Community Selection"
                value={dropdownValue}
                onChange={(e) => setDropdownValue(e.target.value)}
                options={[
                  { value: 'epi', label: 'EPI' },
                  { value: 'navigator', label: 'Navigator' },
                  { value: 'innovation-hub', label: 'Innovation Hub' },
                  { value: 'digital-workspace', label: 'Digital Workspace' }
                ]}
                placeholder="Select community..."
              />
            </div>
          </div>
        </section>

        {/* Color Tokens Section */}
        <section className="showcase-section">
          <h2 className="section-title">Design Tokens</h2>

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
              <div className="color-swatch">
                <div className="color-block" style={{background: 'var(--kpn-red-500)'}}></div>
                <span className="body-s">Red 500</span>
                <span className="body-s text-gray-400">#e22e22</span>
              </div>
              <div className="color-swatch">
                <div className="color-block" style={{background: 'var(--gray-000)', border: '1px solid var(--gray-200)'}}></div>
                <span className="body-s">Gray 000</span>
                <span className="body-s text-gray-400">#ffffff</span>
              </div>
              <div className="color-swatch">
                <div className="color-block" style={{background: 'var(--gray-100)'}}></div>
                <span className="body-s">Gray 100</span>
                <span className="body-s text-gray-400">#f3f3f3</span>
              </div>
              <div className="color-swatch">
                <div className="color-block" style={{background: 'var(--gray-200)'}}></div>
                <span className="body-s">Gray 200</span>
                <span className="body-s text-gray-400">#d3d3d3</span>
              </div>
              <div className="color-swatch">
                <div className="color-block" style={{background: 'var(--gray-300)'}}></div>
                <span className="body-s">Gray 300</span>
                <span className="body-s text-gray-400">#939393</span>
              </div>
              <div className="color-swatch">
                <div className="color-block" style={{background: 'var(--gray-400)'}}></div>
                <span className="body-s">Gray 400</span>
                <span className="body-s text-gray-400">#737373</span>
              </div>
              <div className="color-swatch">
                <div className="color-block" style={{background: 'var(--gray-500)'}}></div>
                <span className="body-s text-white">Gray 500</span>
                <span className="body-s text-gray-200">#131313</span>
              </div>
            </div>
          </div>

          <div className="component-group">
            <h3 className="component-title">Spacing Scale</h3>
            <div className="spacing-examples">
              <div className="spacing-item">
                <div className="spacing-bar" style={{width: 'var(--s-xsmall)'}}></div>
                <span className="body-s">xsmall - 4px</span>
              </div>
              <div className="spacing-item">
                <div className="spacing-bar" style={{width: 'var(--s-small)'}}></div>
                <span className="body-s">small - 8px</span>
              </div>
              <div className="spacing-item">
                <div className="spacing-bar" style={{width: 'var(--s-medium)'}}></div>
                <span className="body-s">medium - 16px</span>
              </div>
              <div className="spacing-item">
                <div className="spacing-bar" style={{width: 'var(--s-large)'}}></div>
                <span className="body-s">large - 24px</span>
              </div>
              <div className="spacing-item">
                <div className="spacing-bar" style={{width: 'var(--s-xlarge)'}}></div>
                <span className="body-s">xlarge - 32px</span>
              </div>
              <div className="spacing-item">
                <div className="spacing-bar" style={{width: 'var(--s-xxlarge)'}}></div>
                <span className="body-s">xxlarge - 48px</span>
              </div>
            </div>
          </div>

          <div className="component-group">
            <h3 className="component-title">Border Radius</h3>
            <div className="component-examples horizontal">
              <div className="radius-example" style={{borderRadius: 'var(--r-small)'}}>
                <span className="body-s">Small - 8px</span>
              </div>
              <div className="radius-example" style={{borderRadius: 'var(--r-medium)'}}>
                <span className="body-s">Medium - 16px</span>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}

export default Showcase
