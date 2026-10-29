import React from 'react'
import { Link } from 'react-router-dom'
import { Separator } from '@/components/ui/separator'
import { Breadcrumbs } from './breadcrumbs'
import { ThemeToggle } from '@/components/themes/theme-toggle'
import { UserNav } from './user-nav'
import { FileText } from 'lucide-react'

export function Header() {
  return (
    <header className="sticky top-0 z-20 flex h-14 shrink-0 items-center justify-between border-b border-border/60 bg-background/80 px-4 backdrop-blur-md transition-[width,height] ease-linear">
      <div className="flex items-center gap-2">
        <Link
          to="/dashboard"
          className="flex items-center gap-2 rounded-lg px-1.5 py-1 transition-colors hover:bg-accent/50 mr-1"
        >
          <div className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-gradient-to-tr from-primary to-primary/80 text-primary-foreground shadow-sm shadow-primary/20">
            <FileText className="size-4" />
          </div>
          <span className="font-bold text-sm tracking-tight text-foreground hidden sm:inline-flex items-center gap-1.5">
            Transformo
            <span className="rounded bg-primary/10 px-1 py-0.5 text-[10px] font-semibold text-primary">
              Docs
            </span>
          </span>
        </Link>
        <Separator orientation="vertical" className="mr-2 h-4 data-vertical:self-center" />
        <Breadcrumbs />
      </div>

      <div className="flex items-center gap-3">
        <ThemeToggle />
        <Separator orientation="vertical" className="h-4 data-vertical:self-center" />
        <UserNav />
      </div>
    </header>
  )
}
