import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button, TextField, TextArea, JudithButton, PageHeader, IconPicker } from './ds'
import ArticleTeaser from './ArticleTeaser'
import '../styles/ArticleSetup.css'

const ArticleSetup = () => {
  const navigate = useNavigate()
  const fileInputRef = useRef(null)

  // Load from localStorage if available
  const savedData = JSON.parse(localStorage.getItem('articleSetupData') || '{}')

  const [title, setTitle] = useState(savedData.title || '')
  const [introduction, setIntroduction] = useState(savedData.introduction || '')
  const [coverImage, setCoverImage] = useState(savedData.coverImage || null)
  const [icon, setIcon] = useState(savedData.icon || 'ui-star')

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
    setIcon('ui-star')
  }

  const handleNext = () => {
    // Save to localStorage
    const setupData = {
      title,
      introduction,
      coverImage,
      icon
    }
    localStorage.setItem('articleSetupData', JSON.stringify(setupData))

    // Navigate to editor
    navigate('/editor')
  }

  return (
    <div className="article-setup">
      <div className="article-setup-container">
        <PageHeader step="Stap 1 van 3" />

        <div className="setup-main">
          <div className="setup-left-column">
            {/* 1. Introduction */}
            <TextArea
              label="Introductie van jouw artikel"
              value={introduction}
              onChange={(e) => setIntroduction(e.target.value)}
              placeholder="Wek interesse door de inhoud van je artikel samen te vatten..."
              rows={5}
              endButton={<JudithButton />}
            />

            {/* 2. Title */}
            <TextField
              label="Titel van jouw artikel"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Iets pakkends..."
              endButton={<JudithButton />}
            />

            {/* 3. Icon Picker */}
            <IconPicker
              label="Icoon voor rij-variant"
              value={icon}
              onChange={setIcon}
            />

            {/* 4. Cover Image */}
            <div className="setup-field">
              <label className="field-label">Omslagfoto</label>
              <div className="cover-image-upload">
                {!coverImage ? (
                  <>
                    <div className="upload-placeholder">
                      <div className="upload-icon-wrapper">
                        <svg width="80" height="80" viewBox="0 0 24 24" fill="none">
                          <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z" fill="var(--kpn-blue-500)"/>
                        </svg>
                      </div>
                      <p className="body-r text-gray-400">
                        Sleep bestanden in dit veld om ze toe<br />
                        te voegen als bijlages, of
                      </p>
                      <Button
                        variant="primary"
                        onClick={handleBrowseClick}
                      >
                        Browse mijn computer
                      </Button>
                      <p className="body-s text-gray-300">(.png, .jpeg, en gif toegestaan)</p>
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
          </div>

          {/* Preview in Right Column */}
          <div className="setup-right-column">
            <div className="preview-section">
              <label className="field-label">Preview van jouw artikel</label>

              <div className="preview-variants">
                <div className="preview-variant-label body-r text-gray-400">Tegel</div>
                <ArticleTeaser
                  variant="tile"
                  article={{
                    title: title,
                    introduction: introduction,
                    coverImage: coverImage,
                    date: new Date(),
                  }}
                />

                <div className="preview-variant-label body-r text-gray-400">Rij met icoon</div>
                <ArticleTeaser
                  variant="row"
                  article={{
                    title: title,
                    icon: icon,
                    date: new Date(),
                  }}
                />
              </div>
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
            icon="ui-arrow-right"
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
