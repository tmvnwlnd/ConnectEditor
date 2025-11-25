import TrumbowygEditor from './TrumbowygEditor'
import DiamondIcon from '../icons/ui-diamond.svg?react'

const HeaderElement = ({
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
  // Custom button definitions for H1, H2, H3, undo, redo
  const buttonDefinitions = {
    h1: {
      fn: 'formatBlock',
      param: 'h1',
      title: 'Heading 1',
      text: 'H1',
      ico: 'h1',
      class: 'h1-button',
      tag: 'h1'
    },
    h2: {
      fn: 'formatBlock',
      param: 'h2',
      title: 'Heading 2',
      text: 'H2',
      ico: 'h2',
      class: 'h2-button',
      tag: 'h2'
    },
    h3: {
      fn: 'formatBlock',
      param: 'h3',
      title: 'Heading 3',
      text: 'H3',
      ico: 'h3',
      class: 'h3-button',
      tag: 'h3'
    },
    undo: {
      fn: function() {
        const $editor = this.$ta || this.$box.find('textarea')
        document.execCommand('undo', false, null)
      },
      title: 'Undo',
      ico: 'undo',
      isSupported: function() { return true; }
    },
    redo: {
      fn: function() {
        const $editor = this.$ta || this.$box.find('textarea')
        document.execCommand('redo', false, null)
      },
      title: 'Redo',
      ico: 'redo',
      isSupported: function() { return true; }
    }
  }

  // Toolbar: H1, H2, H3, Link
  const buttons = [
    ['h1', 'h2', 'h3'],
    ['link']
  ]

  // Default content as H1 if no initial content provided
  const defaultContent = initialContent || '<h1><br></h1>'

  return (
    <TrumbowygEditor
      label="Kop"
      icon={<DiamondIcon width={24} height={24} />}
      placeholder="Start met schrijven…"
      buttons={buttons}
      buttonDefinitions={buttonDefinitions}
      onChange={onChange}
      initialContent={defaultContent}
      className="header-element"
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

export default HeaderElement
