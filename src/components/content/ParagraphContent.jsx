import { useState } from 'react'
import RichTextEditor from './RichTextEditor'
import { getRandomPlaceholder } from '../../utils/placeholders'

const BUTTONS = [
  ['bold', 'italic', 'underline', 'del'],
  ['removeformat'],
  ['link'],
  ['unorderedList', 'orderedList']
]

/** Alinea: body text with inline styles, links and lists. */
const ParagraphContent = ({ content, onChange, placeholder: placeholderProp }) => {
  // A random writing prompt per field, picked once (unless the field brings its own)
  const [placeholder] = useState(() => placeholderProp || getRandomPlaceholder('content'))
  return (
    <RichTextEditor
      className="paragraph-content-editor"
      value={content}
      onChange={onChange}
      buttons={BUTTONS}
      placeholder={placeholder}
    />
  )
}

export default ParagraphContent
