import RichTextEditor from './RichTextEditor'

// The heading sizes a TEAMKPN article has (32 / 22 / 18px) — custom Trumbowyg buttons
const heading = (level) => ({
  fn: 'formatBlock',
  param: `h${level}`,
  title: `Kop ${level}`,
  text: `H${level}`,
  ico: `h${level}`,
  class: `h${level}-button`,
  tag: `h${level}`
})
const BUTTON_DEFS = { h2: heading(2), h3: heading(3), h4: heading(4) }
const BUTTONS = [['h2', 'h3', 'h4'], ['link']]

// Older drafts may hold an <h1>: it shows — and publishes — as H2.
const toH2 = (html) => html.replace(/<(\/?)h1(\s|>)/g, '<$1h2$2')

/** Kop: one heading (H2/H3/H4); pastes keep inline styles only. */
const HeaderContent = ({ content, onChange, placeholder = 'Start met schrijven…' }) => (
  <RichTextEditor
    className="header-content-editor"
    value={content}
    onChange={onChange}
    buttons={BUTTONS}
    buttonDefs={BUTTON_DEFS}
    placeholder={placeholder}
    prepare={toH2}
    emptyHtml="<h2><br></h2>"
    inline
  />
)

export default HeaderContent
