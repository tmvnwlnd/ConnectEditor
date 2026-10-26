import { useState } from 'react'
import { Button, TextField, TextArea } from '../ds'
import '../../styles/FaqContent.css'

/**
 * FaqContent — the FAQ block: an optional title above a list of question + answer pairs. In the TEAMKPN
 * article it becomes a heading + an accordion (each question folds open to its answer).
 *
 * content: { title: string, items: Array<{ id, question: string, answer: string }> }
 * ElementWrapper handles all chrome (border, title, positioning buttons).
 */
const newItem = () => ({ id: Date.now() + Math.random(), question: '', answer: '' })

const FaqContent = ({ content, onChange }) => {
  const initial = content && typeof content === 'object' ? content : {}
  const [title, setTitle] = useState(initial.title ?? 'Veelgestelde vragen')
  const [items, setItems] = useState(initial.items?.length ? initial.items : [newItem()])

  const commit = (next) => onChange?.({ title, items, ...next })

  const updateItem = (id, patch) => {
    const next = items.map((it) => (it.id === id ? { ...it, ...patch } : it))
    setItems(next)
    commit({ items: next })
  }
  const removeItem = (id) => {
    const next = items.filter((it) => it.id !== id)
    setItems(next)
    commit({ items: next })
  }
  const addItem = () => {
    const next = [...items, newItem()]
    setItems(next)
    commit({ items: next })
  }

  return (
    <div className="faq-content">
      <TextField
        label="Titel (optioneel)"
        value={title}
        onChange={(e) => {
          setTitle(e.target.value)
          commit({ title: e.target.value })
        }}
        placeholder="Bijvoorbeeld: Veelgestelde vragen"
      />
      {items.map((it, i) => (
        <div key={it.id} className="faq-item">
          <div className="faq-item-head">
            <span className="body-r-bold">Vraag {i + 1}</span>
            {items.length > 1 && (
              <Button variant="ghost" size="compact" iconStart="ui-trash" onClick={() => removeItem(it.id)}>
                Verwijder
              </Button>
            )}
          </div>
          <TextField
            label="Vraag"
            value={it.question}
            onChange={(e) => updateItem(it.id, { question: e.target.value })}
            placeholder="Wat wil de lezer weten?"
          />
          <TextArea
            label="Antwoord"
            rows={3}
            value={it.answer}
            onChange={(e) => updateItem(it.id, { answer: e.target.value })}
            placeholder="Het antwoord, in een paar zinnen."
          />
        </div>
      ))}
      <Button variant="ghost" size="compact" iconStart="ui-plus" onClick={addItem}>
        Vraag toevoegen
      </Button>
    </div>
  )
}

export default FaqContent
