import TrumbowygEditor from './TrumbowygEditor'
import TextBubbleIcon from '../icons/ui-text-bubble.svg?react'

const CitationElement = ({
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
  // Toolbar: Bold, Italic, Underline, Strikethrough, Remove Format
  const buttons = [
    ['strong', 'em', 'underline', 'del'],
    ['removeformat']
  ]

  return (
    <TrumbowygEditor
      label="Citaat"
      iconComponent={TextBubbleIcon}
      placeholder="Start met schrijven…"
      buttons={buttons}
      onChange={onChange}
      initialContent={initialContent}
      className="citation-element"
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

export default CitationElement
