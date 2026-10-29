import React from 'react'
import { Toaster as SonnerToaster } from 'sonner'
import { useTheme } from '@/components/themes/theme-provider'

export function Toaster({ ...props }) {
  let currentTheme = 'system'
  try {
    const themeContext = useTheme()
    currentTheme = themeContext.resolvedTheme || 'light'
  } catch (e) {
    // If used outside ThemeProvider
    currentTheme = 'system'
  }

  return (
    <SonnerToaster
      theme={currentTheme}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            'group toast group-[.toaster]:bg-card group-[.toaster]:text-card-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg group-[.toaster]:rounded-xl',
          description: 'group-[.toast]:text-muted-foreground',
          actionButton:
            'group-[.toast]:bg-primary group-[.toast]:text-primary-foreground',
          cancelButton:
            'group-[.toast]:bg-muted group-[.toast]:text-muted-foreground',
        },
      }}
      position="top-right"
      richColors
      closeButton
      {...props}
    />
  )
}
