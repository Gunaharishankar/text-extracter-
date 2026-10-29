import React from 'react'
import { Badge } from '@/components/ui/badge'
import { CheckCircle2, Loader2, AlertCircle, Clock } from 'lucide-react'

export function ProcessingStatusBadge({ status, className }) {
  switch (status?.toLowerCase()) {
    case 'completed':
      return (
        <Badge
          variant="outline"
          className={`bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 font-medium gap-1.5 ${className || ''}`}
        >
          <CheckCircle2 className="size-3.5 text-emerald-500" />
          <span>Completed</span>
        </Badge>
      )
    case 'processing':
      return (
        <Badge
          variant="outline"
          className={`bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20 font-medium gap-1.5 ${className || ''}`}
        >
          <Loader2 className="size-3.5 text-blue-500 animate-spin" />
          <span>Processing</span>
        </Badge>
      )
    case 'uploaded':
      return (
        <Badge
          variant="outline"
          className={`bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20 font-medium gap-1.5 ${className || ''}`}
        >
          <Clock className="size-3.5 text-amber-500" />
          <span>Queued</span>
        </Badge>
      )
    case 'failed':
      return (
        <Badge
          variant="outline"
          className={`bg-destructive/10 text-destructive border-destructive/20 font-medium gap-1.5 ${className || ''}`}
        >
          <AlertCircle className="size-3.5 text-destructive" />
          <span>Failed</span>
        </Badge>
      )
    default:
      return (
        <Badge variant="outline" className={className}>
          {status || 'Unknown'}
        </Badge>
      )
  }
}
