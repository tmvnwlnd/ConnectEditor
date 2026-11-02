import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import '../styles/PageTransition.css'

// The step order — EVERY step route must be here, or moving to/from it doesn't slide.
const routeOrder = {
  '/setup': 0,
  '/plaatsing': 1,
  '/editor': 2,
  '/settings': 3
}

const PageTransition = ({ children }) => {
  const location = useLocation()
  const [animationClass, setAnimationClass] = useState('')
  const [prevPath, setPrevPath] = useState(location.pathname)

  useEffect(() => {
    const currentOrder = routeOrder[location.pathname]
    const previousOrder = routeOrder[prevPath]

    if (currentOrder !== undefined && previousOrder !== undefined) {
      if (currentOrder > previousOrder) {
        // Moving forward (left to right swipe)
        setAnimationClass('page-slide-in-right')
      } else if (currentOrder < previousOrder) {
        // Moving backward (right to left swipe)
        setAnimationClass('page-slide-in-left')
      }
    }

    // Remove animation class after animation completes
    const timer = setTimeout(() => {
      setAnimationClass('')
      setPrevPath(location.pathname)
    }, 300) // Match animation duration

    return () => clearTimeout(timer)
  }, [location.pathname])

  return (
    <div className={`page-transition-wrapper ${animationClass}`}>
      {children}
    </div>
  )
}

export default PageTransition
