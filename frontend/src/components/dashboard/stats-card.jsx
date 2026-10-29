import React from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { FileText, CheckCircle2, Clock, AlertTriangle } from 'lucide-react'

export function DashboardStats({ documents = [] }) {
  const total = documents.length
  const completed = documents.filter((d) => d.status === 'completed').length
  const processing = documents.filter((d) => ['processing', 'uploaded'].includes(d.status)).length
  const failed = documents.filter((d) => d.status === 'failed').length

  const stats = [
    {
      title: 'Total Documents',
      value: total,
      description: 'Indexed in repository',
      icon: FileText,
      color: 'text-primary bg-primary/10',
    },
    {
      title: 'Completed',
      value: completed,
      description: `${total > 0 ? Math.round((completed / total) * 100) : 0}% success rate`,
      icon: CheckCircle2,
      color: 'text-emerald-500 bg-emerald-500/10',
    },
    {
      title: 'Processing',
      value: processing,
      description: processing > 0 ? 'Active in queue' : 'Queue idle',
      icon: Clock,
      color: 'text-blue-500 bg-blue-500/10',
    },
    {
      title: 'Failed',
      value: failed,
      description: failed > 0 ? 'Requires attention' : 'No errors',
      icon: AlertTriangle,
      color: 'text-destructive bg-destructive/10',
    },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, idx) => {
        const Icon = stat.icon
        return (
          <Card key={idx} className="relative overflow-hidden border-border/60 transition-all hover:shadow-md">
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  {stat.title}
                </p>
                <div className="text-2xl font-bold tracking-tight text-foreground mt-1">
                  {stat.value}
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {stat.description}
                </p>
              </div>
              <div className={`flex size-11 items-center justify-center rounded-xl shrink-0 ${stat.color}`}>
                <Icon className="size-5" />
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
