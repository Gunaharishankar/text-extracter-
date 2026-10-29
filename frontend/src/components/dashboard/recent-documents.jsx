import React from 'react'
import { Link } from 'react-router-dom'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { FileTypeIcon } from '@/components/documents/file-type-badge'
import { ProcessingStatusBadge } from '@/components/documents/processing-status'
import { formatBytes } from '@/lib/utils'
import { ArrowUpRight, Inbox, Clock, RefreshCw } from 'lucide-react'

export function RecentDocuments({
  documents = [],
  loading = false,
  onRefresh,
}) {
  return (
    <Card className="border-border/60 shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <div>
          <CardTitle className="text-lg font-semibold tracking-tight">
            Document Repository
          </CardTitle>
          <CardDescription className="text-xs">
            {documents.length} document{documents.length === 1 ? '' : 's'} managed with live processing status
          </CardDescription>
        </div>

        {onRefresh && (
          <Button
            variant="outline"
            size="sm"
            onClick={onRefresh}
            className="h-8 gap-1.5 text-xs text-muted-foreground hover:text-foreground"
          >
            <RefreshCw className="size-3.5" />
            <span>Refresh</span>
          </Button>
        )}
      </CardHeader>

      <CardContent className="p-0">
        {loading ? (
          <div className="p-4 space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center justify-between gap-4 p-3 rounded-lg border border-border/40">
                <div className="flex items-center gap-3">
                  <Skeleton className="size-9 rounded-xl" />
                  <div className="space-y-1.5">
                    <Skeleton className="h-4 w-48" />
                    <Skeleton className="h-3 w-28" />
                  </div>
                </div>
                <Skeleton className="h-6 w-20 rounded-full" />
              </div>
            ))}
          </div>
        ) : documents.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 text-center">
            <div className="flex size-14 items-center justify-center rounded-2xl bg-muted/60 text-muted-foreground mb-3">
              <Inbox className="size-7" />
            </div>
            <h3 className="text-sm font-semibold text-foreground">No documents uploaded yet</h3>
            <p className="text-xs text-muted-foreground mt-1 max-w-xs">
              Upload your first document above to extract text, run OCR, and inspect metadata.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-border/50">
            {documents.map((doc) => {
              const formattedSize = doc.fileSize ? formatBytes(doc.fileSize) : '--'
              const formattedDate = doc.createdAt
                ? new Date(doc.createdAt).toLocaleDateString(undefined, {
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })
                : ''

              return (
                <div
                  key={doc._id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 transition-colors hover:bg-muted/30"
                >
                  <div className="flex items-start sm:items-center gap-3.5 min-w-0">
                    <FileTypeIcon fileName={doc.originalName} mimeType={doc.mimeType} />
                    <div className="min-w-0">
                      <Link
                        to={`/document/${doc._id}`}
                        className="text-sm font-semibold text-foreground hover:text-primary transition-colors truncate block"
                      >
                        {doc.originalName}
                      </Link>
                      <div className="flex flex-wrap items-center gap-2 mt-1 text-xs text-muted-foreground">
                        <span>{formattedSize}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Clock className="size-3" />
                          {formattedDate}
                        </span>
                        {doc.extractionMethod && (
                          <>
                            <span>•</span>
                            <span className="uppercase text-[10px] font-medium tracking-wider px-1.5 py-0.2 rounded bg-muted text-muted-foreground border border-border/50">
                              {doc.extractionMethod}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 pl-12 sm:pl-0">
                    <ProcessingStatusBadge status={doc.status} />
                    <Button
                      asChild
                      variant="ghost"
                      size="sm"
                      className="h-8 gap-1 text-xs font-medium hover:text-primary"
                    >
                      <Link to={`/document/${doc._id}`}>
                        <span>View</span>
                        <ArrowUpRight className="size-3.5" />
                      </Link>
                    </Button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
