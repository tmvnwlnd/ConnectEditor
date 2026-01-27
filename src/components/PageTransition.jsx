import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import '../styles/PageTransition.css'

const routeOrder = {
  '/setup': 0,
  '/editor': 1,
  '/settings': 2
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
