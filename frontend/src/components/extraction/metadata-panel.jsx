import React, { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Copy, Check, Info } from 'lucide-react'
import { toast } from 'sonner'

export function MetadataPanel({ metadata }) {
  const [copied, setCopied] = useState(false)

  if (!metadata || Object.keys(metadata).length === 0) {
    return (
      <Card className="border-border/60">
        <CardContent className="p-8 text-center text-muted-foreground">
          <Info className="size-8 mx-auto mb-2 opacity-50" />
          <p className="text-sm font-medium">No metadata embedded in this document</p>
          <p className="text-xs text-muted-foreground mt-1">
            Documents created without EXIF, XMP, or Office properties will not have extended metadata.
          </p>
        </CardContent>
      </Card>
    )
  }

  const handleCopyRaw = () => {
    navigator.clipboard.writeText(JSON.stringify(metadata, null, 2))
    setCopied(true)
    toast.success('Raw metadata copied to clipboard')
    setTimeout(() => setCopied(false), 2000)
  }

  const entries = Object.entries(metadata)

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-xs text-muted-foreground">
          {entries.length} extracted propert{entries.length === 1 ? 'y' : 'ies'}
        </p>
        <Button
          variant="outline"
          size="sm"
          onClick={handleCopyRaw}
          className="h-8 gap-1.5 text-xs"
        >
          {copied ? <Check className="size-3.5 text-emerald-500" /> : <Copy className="size-3.5" />}
          <span>{copied ? 'Copied JSON' : 'Copy JSON'}</span>
        </Button>
      </div>

      <Card className="border-border/60 overflow-hidden shadow-sm">
        <CardContent className="p-0">
          <div className="divide-y divide-border/50 text-xs">
            {entries.map(([key, value]) => {
              const displayVal =
                typeof value === 'object' && value !== null
                  ? JSON.stringify(value)
                  : String(value)

              return (
                <div
                  key={key}
                  className="grid grid-cols-1 md:grid-cols-3 gap-2 p-3 hover:bg-muted/30 transition-colors"
                >
                  <span className="font-mono font-medium text-foreground/80 break-words">
                    {key}
                  </span>
                  <span className="md:col-span-2 font-mono text-muted-foreground break-words select-all">
                    {displayVal}
                  </span>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
