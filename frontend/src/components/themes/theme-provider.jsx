import React, { createContext, useContext, useEffect, useState } from 'react'

const ThemeContext = createContext({
  theme: 'system',
  resolvedTheme: 'light',
  setTheme: () => {},
  activeColorTheme: 'supabase',
  setActiveColorTheme: () => {},
  toggleTheme: () => {},
})

const THEME_MODE_KEY = 'transformo_theme_mode'
const COLOR_THEME_KEY = 'transformo_color_theme'

export function ThemeProvider({
  children,
  defaultTheme = 'system',
  defaultColorTheme = 'supabase',
}) {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem(THEME_MODE_KEY) || defaultTheme
  })

  const [activeColorTheme, setActiveColorTheme] = useState(() => {
    return localStorage.getItem(COLOR_THEME_KEY) || defaultColorTheme
  })

  const [resolvedTheme, setResolvedTheme] = useState('light')

  useEffect(() => {
    const root = document.documentElement

    const updateResolvedTheme = () => {
      let resolved = theme
      if (theme === 'system') {
        resolved = window.matchMedia('(prefers-color-scheme: dark)').matches
          ? 'dark'
          : 'light'
      }
      setResolvedTheme(resolved)

      if (resolved === 'dark') {
        root.classList.add('dark')
      } else {
        root.classList.remove('dark')
      }
    }

    updateResolvedTheme()

    if (theme === 'system') {
      const media = window.matchMedia('(prefers-color-scheme: dark)')
      const listener = () => updateResolvedTheme()
      media.addEventListener('change', listener)
      return () => media.removeEventListener('change', listener)
    }
  }, [theme])

  useEffect(() => {
    const root = document.documentElement
    if (activeColorTheme) {
      root.setAttribute('data-theme', activeColorTheme)
      localStorage.setItem(COLOR_THEME_KEY, activeColorTheme)
    } else {
      root.removeAttribute('data-theme')
    }
  }, [activeColorTheme])

  const handleSetTheme = (newTheme) => {
    setTheme(newTheme)
    localStorage.setItem(THEME_MODE_KEY, newTheme)
  }

  const toggleTheme = () => {
    const nextTheme = resolvedTheme === 'dark' ? 'light' : 'dark'
    handleSetTheme(nextTheme)
  }

  return (
    <ThemeContext.Provider
      value={{
        theme,
        resolvedTheme,
        setTheme: handleSetTheme,
        activeColorTheme,
        setActiveColorTheme,
        toggleTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}
