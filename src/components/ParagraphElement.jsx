import TrumbowygEditor from './TrumbowygEditor'
import TextSquareIcon from '../icons/ui-text-square.svg?react'

const ParagraphElement = ({
  onChange,
  initialContent,
  isFocused,
  isFirst,
  isLast,
  isLinking,
  onMoveUp,
  onMoveDown,
  onLink,
  onDuplicate,
  onDelete
}) => {
  // Toolbar: Bold, Italic, Underline, Strikethrough, Remove Format, Link, Lists
  const buttons = [
    ['strong', 'em', 'underline', 'del'],
    ['removeformat'],
    ['link'],
    ['unorderedList', 'orderedList']
  ]

  return (
    <TrumbowygEditor
      label="Alinea"
      iconComponent={TextSquareIcon}
      placeholder="Start met schrijven…"
      buttons={buttons}
      onChange={onChange}
      initialContent={initialContent}
      className="paragraph-element"
      isFocused={isFocused}
      isFirst={isFirst}
      isLast={isLast}
      isLinking={isLinking}
      onMoveUp={onMoveUp}
      onMoveDown={onMoveDown}
      onLink={onLink}
      onDuplicate={onDuplicate}
      onDelete={onDelete}
    />
  )
}

export default ParagraphElement
