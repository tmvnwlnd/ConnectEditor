import { useNavigate } from 'react-router-dom'
import { Icon } from './ds'
import { startNewArticle, startUpdateArticle } from '../utils/articleMode'
import '../styles/StartChoice.css'

/* Prototype start ("/"): pick a path — a new article (steps 1–4), or updating an existing one (prefilled,
   straight into the editor, step 3). */
const StartChoice = () => {
  const navigate = useNavigate()
  const paths = [
    { id: 'new', icon: 'ui-plus', title: 'Nieuwsartikel maken', go: () => { startNewArticle(); navigate('/setup') } },
    { id: 'update', icon: 'ui-pencil-line', title: 'Nieuwsartikel updaten', go: () => { startUpdateArticle(); navigate('/editor') } },
  ]
  return (
    <div className="start-choice">
      <div className="start-choice-options">
        {paths.map((p) => (
          <button key={p.id} type="button" className="start-choice-option" onClick={p.go}>
            <span className="start-choice-icon"><Icon name={p.icon} size={32} /></span>
            <span className="h4-bold">{p.title}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

export default StartChoice
