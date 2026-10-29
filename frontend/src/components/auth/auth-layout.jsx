import React from 'react'
import { Link } from 'react-router-dom'
import { FileText, ShieldCheck } from 'lucide-react'
import { ThemeToggle } from '@/components/themes/theme-toggle'

export function AuthLayout({ children }) {
  return (
    <div className="relative min-h-screen flex flex-col justify-between bg-background text-foreground selection:bg-primary/20 selection:text-primary">
      {/* Background decorative ambient glows */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-primary/8 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -right-20 w-[500px] h-[400px] bg-primary/5 rounded-full blur-3xl" />
      </div>

      {/* Header bar */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-border/50 backdrop-blur-sm bg-background/60">
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="flex size-9 items-center justify-center rounded-xl bg-gradient-to-tr from-primary to-primary/80 text-primary-foreground shadow-sm shadow-primary/20 transition-transform group-hover:scale-105">
            <FileText className="size-5" />
          </div>
          <span className="font-bold text-base tracking-tight flex items-center gap-1.5">
            Transformo
            <span className="rounded bg-primary/10 px-1 py-0.2 text-[11px] font-semibold text-primary">
              Docs
            </span>
          </span>
        </Link>

        <div className="flex items-center gap-2">
          <ThemeToggle />
        </div>
      </header>

      {/* Content wrapper */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-md animate-in fade-in-50 zoom-in-95 duration-200">
          {children}
        </div>
      </main>

      {/* Footer */}
      <footer className="py-4 px-6 text-center text-xs text-muted-foreground border-t border-border/40 flex flex-col sm:flex-row items-center justify-between gap-2">
        <div className="flex items-center gap-1.5">
          <ShieldCheck className="size-3.5 text-emerald-500" />
          <span>Secure Document Extraction Engine</span>
        </div>
        <span>&copy; {new Date().getFullYear()} Transformo Docs. All rights reserved.</span>
      </footer>
    </div>
  )
}
