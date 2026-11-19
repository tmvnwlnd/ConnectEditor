import { useRef, useState } from 'react'
import { Button } from './ds'
import { importDocx } from '../utils/docxImport'

/**
 * DocxImportButton — "Importeer Word-document": picks a .docx and hands the blocks it becomes (`utils/docxImport`)
 * to `onImport({ title, introduction, blocks, warnings })`.
 *
 * @param {string}   variant   'primary' (empty canvas) | 'secondary' (above the sidebar)
 * @param {Function} onImport
 * @param {string}   className
 */
const DocxImportButton = ({ variant = 'primary', onImport, className = '' }) => {
  const inputRef = useRef(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  const handleFile = async (e) => {
    const file = e.target.files?.[0]
    e.target.value = '' // the same file can be picked again
    if (!file) return
    if (!/\.docx$/i.test(file.name)) {
      setError('Kies een Word-document (.docx).')
      return
    }
    setError('')
    setBusy(true)
    try {
      onImport(await importDocx(file))
    } catch (err) {
      console.warn('docx import failed:', err)
      setError('Dit document kon niet worden gelezen.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className={`docx-import ${className}`}>
      <Button variant={variant} iconStart="ui-file-doc" disabled={busy} onClick={() => inputRef.current?.click()}>
        {busy ? 'Document lezen…' : 'Importeer Word-document'}
      </Button>
      {error && <p className="body-r docx-import-error">{error}</p>}
      <input
        ref={inputRef}
        type="file"
        accept=".docx,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        onChange={handleFile}
        style={{ display: 'none' }}
      />
    </div>
  )
}

export default DocxImportButton
