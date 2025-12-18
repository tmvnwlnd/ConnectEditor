import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import Button from './Button'
import TextField from './TextField'
import ArticlePreviewCard from './ArticlePreviewCard'
import PlusIcon from '../icons/ui-plus.svg?react'
import PhotoIcon from '../icons/ui-photo.svg?react'
import ArrowRightIcon from '../icons/ui-arrow-right.svg?react'
import '../styles/ArticleSetup.css'

const ArticleSetup = () => {
  const navigate = useNavigate()
  const fileInputRef = useRef(null)

  // Load from localStorage if available
  const savedData = JSON.parse(localStorage.getItem('articleSetupData') || '{}')

  const [title, setTitle] = useState(savedData.title || '')
  const [introduction, setIntroduction] = useState(savedData.introduction || '')
  const [coverImage, setCoverImage] = useState(savedData.coverImage || null)
  const [selectedElements, setSelectedElements] = useState(savedData.selectedElements || [])

  const elementOptions = [
    { id: 'actielink', label: 'Actielink' },
    { id: 'teaser-video', label: 'Teaser video' },
    { id: 'contactpersoon', label: 'Contactpersoon' }
  ]

  const toggleElement = (elementId) => {
    setSelectedElements(prev => {
      if (prev.includes(elementId)) {
        return prev.filter(id => id !== elementId)
      } else {
        return [...prev, elementId]
      }
    })
  }

  const handleFileSelect = (event) => {
    const file = event.target.files[0]
    if (!file) return

    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/gif']
    if (!validTypes.includes(file.type)) {
      alert('Alleen .jpeg, .png of .gif bestanden zijn toegestaan')
      return
    }

    // Validate file size (10MB)
    const maxSize = 10 * 1024 * 1024
    if (file.size > maxSize) {
      alert('Bestand is te groot. Maximum grootte is 10 MB')
      return
    }

    // Read file and convert to data URL
    const reader = new FileReader()
    reader.onload = (e) => {
      setCoverImage(e.target.result)
    }
    reader.readAsDataURL(file)
  }

  const handleBrowseClick = () => {
    fileInputRef.current?.click()
  }

  const handleCancel = () => {
    // Clear localStorage and reset form
    localStorage.removeItem('articleSetupData')
    setTitle('')
    setIntroduction('')
    setCoverImage(null)
    setSelectedElements([])
  }

  const handleNext = () => {
    // Save to localStorage
    const setupData = {
      title,
      introduction,
      coverImage,
      selectedElements
    }
    localStorage.setItem('articleSetupData', JSON.stringify(setupData))

    // Navigate to editor
    navigate('/editor')
  }

  const handleGenerateTitle = () => {
    setTitle('Lancering KPN Ultimate succesvol verlopen')
  }

  return (
    <div className="article-setup">
      <div className="article-setup-container">
        <header className="setup-header">
          <h1 className="setup-title">Nieuwsartikel maken</h1>
          <p className="setup-step">Stap 1 van 3</p>
        </header>

        <div className="setup-main">
          <div className="setup-left-column">
            {/* 1. Introduction */}
            <TextField
              label="Introductie van jouw artikel"
              value={introduction}
              onChange={(e) => setIntroduction(e.target.value)}
              placeholder="Wek interesse door de inhoud van je artikel samen te vatten..."
              multiline={true}
              rows={5}
            />

            {/* 2. Title */}
            <TextField
              label="Titel van jouw artikel"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Iets pakkends..."
              endContent={
                <Button
                  variant="primary"
                  onClick={handleGenerateTitle}
                  className="btn-compact"
                >
                  Genereer titel
                </Button>
              }
            />

            {/* 3. Cover Image */}
            <div className="setup-field">
              <label className="setup-label">Omslagfoto</label>
              <div className="cover-image-upload">
                {!coverImage ? (
                  <>
                    <div className="upload-placeholder">
                      <PhotoIcon width={80} height={80} className="upload-icon" />
                      <p className="upload-text">
                        Sleep bestanden in dit veld om ze toe<br />
                        te voegen als bijlages, of
                      </p>
                      <Button
                        variant="primary"
                        onClick={handleBrowseClick}
                      >
                        Browse mijn computer
                      </Button>
                      <p className="upload-hint">(.png, .jpeg, en gif toegestaan)</p>
                    </div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/jpeg,image/png,image/gif"
                      onChange={handleFileSelect}
                      style={{ display: 'none' }}
                    />
                  </>
                ) : (
                  <div className="cover-image-preview">
                    <img src={coverImage} alt="Cover" className="preview-image" />
                    <Button
                      variant="secondary"
                      onClick={handleBrowseClick}
                    >
                      Wijzig afbeelding
                    </Button>
                  </div>
                )}
              </div>
            </div>

            {/* 4. Element Buttons */}
            <div className="setup-field">
              <label className="setup-label">Elementen toevoegen</label>
              <div className="element-pills">
                {elementOptions.map(element => (
                  <Button
                    key={element.id}
                    variant="secondary"
                    icon={PlusIcon}
                    onClick={() => toggleElement(element.id)}
                    className={selectedElements.includes(element.id) ? 'active' : ''}
                  >
                    {element.label}
                  </Button>
                ))}
              </div>
            </div>
          </div>

          {/* Preview Card in Right Column */}
          <div className="setup-right-column">
            <div className="preview-section">
              <label className="preview-label">Preview van jouw artikel</label>
              <ArticlePreviewCard
                title={title || 'Titel van artikel...'}
                introduction={introduction || 'Introductie van artikel...'}
                coverImage={coverImage}
                showEditButton={false}
              />
            </div>
          </div>
        </div>

        <footer className="setup-footer">
          <Button
            variant="secondary"
            onClick={handleCancel}
          >
            Annuleren
          </Button>
          <Button
            variant="primary"
            icon={ArrowRightIcon}
            onClick={handleNext}
          >
            Volgende stap: inhoud
          </Button>
        </footer>
      </div>
    </div>
  )
}

export default ArticleSetup
