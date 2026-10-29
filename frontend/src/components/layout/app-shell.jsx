import React from 'react'
import { Header } from './header'

export function AppShell({ children }) {
  return (
    <div className="flex min-h-svh flex-col">
      <Header />
      <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
        <div className="mx-auto max-w-6xl w-full">
          {children}
        </div>
      </main>
    </div>
  )
}
