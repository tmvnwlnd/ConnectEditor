import RichTextEditor from './RichTextEditor'
import { TextField } from '../ds'
import '../../styles/CitationContent.css'

const BUTTONS = [['bold', 'italic'], ['link']]

// Old drafts stored the quote as a plain string
const parse = (content) =>
  typeof content === 'object' && content !== null ? content : { quote: content || '', person: '' }

/** Citaat: the quote (rich text, body-xxl) + who said it. */
const CitationContent = ({ content, onChange }) => {
  const { quote = '', person = '' } = parse(content)
  return (
    <div className="citation-content-wrapper">
      <RichTextEditor
        className="citation-content-editor"
        value={quote}
        onChange={(html) => onChange?.({ ...parse(content), quote: html })}
        buttons={BUTTONS}
      />
      <div className="citation-person-field">
        <TextField
          label="Persoon"
          value={person}
          onChange={(e) => onChange?.({ ...parse(content), person: e.target.value })}
          placeholder="Naam van de persoon"
        />
      </div>
    </div>
  )
}

export default CitationContent
