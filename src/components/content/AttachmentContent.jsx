import { useState, useRef } from 'react'
import { Icon } from '../ds'
import IconButton from '../IconButton'
import TextField from '../TextField'
import { Button } from '../ds'
import TrashIcon from '../../icons/ui-trash.svg?react'
import '../../styles/AttachmentContent.css'

/**
 * AttachmentContent Component
 *
 * Content renderer for Attachment (Bijlage) elements.
 * Handles document upload and naming.
 */
const AttachmentContent = ({ content, onChange, isFocused }) => {
  const [attachment, setAttachment] = useState(content?.attachment || null)
  const [fileName, setFileName] = useState(content?.fileName || '')
  const [originalFileName, setOriginalFileName] = useState(content?.originalFileName || '')
  const [fileSize, setFileSize] = useState(content?.fileSize || '')
  const [fileType, setFileType] = useState(content?.fileType || '')
  const fileInputRef = useRef(null)

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
  }

  const handleFileSelect = (event) => {
    const file = event.target.files[0]
    if (!file) return

    const maxSize = 50 * 1024 * 1024 // 50MB
    if (file.size > maxSize) {
      alert('Bestand is te groot. Maximum grootte is 50 MB')
      return
    }

    // Revoke previous blob URL to free memory
    if (attachment && attachment.startsWith('blob:')) {
      URL.revokeObjectURL(attachment)
    }

    const attachmentUrl = URL.createObjectURL(file)
    const newOriginalFileName = file.name
    const newFileName = fileName || file.name
    const newFileSize = formatFileSize(file.size)
    const newFileType = file.name.split('.').pop().toUpperCase()

    setAttachment(attachmentUrl)
    setOriginalFileName(newOriginalFileName)
    setFileName(newFileName)
    setFileSize(newFileSize)
    setFileType(newFileType)

    if (onChange) {
      onChange({
        attachment: attachmentUrl,
        originalFileName: newOriginalFileName,
        fileName: newFileName,
        fileSize: newFileSize,
        fileType: newFileType,
        sourceType: 'blob'
      })
    }
  }

  const handleBrowseClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileNameChange = (e) => {
    const newFileName = e.target.value
    setFileName(newFileName)
    if (onChange) {
      onChange({ attachment, originalFileName, fileName: newFileName, fileSize, fileType })
    }
  }

  const handleDelete = () => {
    if (attachment && attachment.startsWith('blob:')) {
      URL.revokeObjectURL(attachment)
    }
    setAttachment(null)
    setOriginalFileName('')
    setFileName('')
    setFileSize('')
    setFileType('')
    if (onChange) {
      onChange({ attachment: null, originalFileName: '', fileName: '', fileSize: '', fileType: '' })
    }
  }

  return (
    <div className="attachment-content">
      {!attachment ? (
        // Empty state
        <div className="attachment-empty">
          <span className="empty-icon">
            <Icon name="ui-paperclip" color="#d0d0d0" size={80} />
          </span>
          <p className="body-r text-gray-400">Sleep een document naar dit veld om toe te voegen</p>
          <p className="body-r text-gray-300">Alle bestandstypes toegestaan</p>
          <p className="body-r text-gray-300">max 50 MB</p>

          <Button variant="secondary" className="btn-full-width" onClick={handleBrowseClick}>
            Browse mijn computer
          </Button>

          <input
            ref={fileInputRef}
            type="file"
            onChange={handleFileSelect}
            style={{ display: 'none' }}
          />
        </div>
      ) : (
        // Filled state
        <div className="attachment-filled">
          <div className="attachment-preview-container">
            <div className="attachment-preview">
              <div className="attachment-icon">
                <Icon name="ui-paperclip" color="var(--kpn-blue-500)" size={40} />
              </div>
              <div className="attachment-info">
                <div className="attachment-filename">{originalFileName}</div>
                <div className="attachment-metadata">
                  <span className="attachment-type">{fileType}</span>
                  <span className="attachment-separator">•</span>
                  <span className="attachment-size">{fileSize}</span>
                </div>
              </div>
            </div>
            <IconButton
              variant="delete"
              icon={TrashIcon}
              size={20}
              onClick={handleDelete}
              aria-label="Verwijder document"
            />
          </div>

          <TextField
            label="Document naam"
            value={fileName}
            onChange={handleFileNameChange}
            placeholder="Geef het document een naam..."
            tooltipText="Een beschrijvende naam helpt lezers om te begrijpen wat het document bevat."
          />
        </div>
      )}
    </div>
  )
}

export default AttachmentContent
