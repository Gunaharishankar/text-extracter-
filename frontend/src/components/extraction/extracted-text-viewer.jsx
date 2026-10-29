import React, { useState } from 'react'
import { Card, CardHeader, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Copy, Download, Check, Loader2, AlertCircle, FileText, Search } from 'lucide-react'
import { toast } from 'sonner'

export function ExtractedTextViewer({
  text = '',
  status = 'completed',
  fileName = 'document',
}) {
  const [copied, setCopied] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  const handleCopy = () => {
    if (!text) return
    navigator.clipboard.writeText(text)
    setCopied(true)
    toast.success('Extracted text copied to clipboard!')
    setTimeout(() => setCopied(false), 2000)
  }

  const handleDownload = () => {
    if (!text) return
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = window.document.createElement('a')
    a.href = url
    a.download = `${fileName}-extracted.txt`
    a.click()
    URL.revokeObjectURL(url)
    toast.success('Download started', {
      description: `Saved as ${fileName}-extracted.txt`,
    })
  }

  const wordCount = text ? text.trim().split(/\s+/).filter(Boolean).length : 0
  const charCount = text ? text.length : 0
  const lineCount = text ? text.split('\n').length : 0

  if (status === 'processing' || status === 'uploaded') {
    return (
      <Card className="border-border/60">
        <CardContent className="flex flex-col items-center justify-center p-12 text-center">
          <div className="flex size-14 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-500 mb-4 animate-pulse">
            <Loader2 className="size-8 animate-spin" />
          </div>
          <h3 className="text-base font-semibold text-foreground">
            Document is actively processing
          </h3>
          <p className="text-xs text-muted-foreground mt-1 max-w-sm">
            Extracting text and running OCR via Apache Tika and Tesseract. This page will update automatically when finished.
          </p>
        </CardContent>
      </Card>
    )
  }

  if (status === 'failed') {
    return (
      <Card className="border-destructive/30 bg-destructive/5">
        <CardContent className="flex flex-col items-center justify-center p-12 text-center">
          <div className="flex size-14 items-center justify-center rounded-2xl bg-destructive/10 text-destructive mb-4">
            <AlertCircle className="size-8" />
          </div>
          <h3 className="text-base font-semibold text-destructive">
            Extraction failed
          </h3>
          <p className="text-xs text-muted-foreground mt-1 max-w-sm">
            The document could not be processed. This may occur if the file is corrupted, password-protected, or has unreadable encoding.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-border/60 shadow-sm overflow-hidden">
      {/* Action Toolbar Header */}
      <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/50 bg-muted/30 px-4 py-3">
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <span className="font-semibold text-foreground flex items-center gap-1.5">
            <FileText className="size-4 text-primary" />
            <span>Extracted Content</span>
          </span>
          <span>•</span>
          <span>{wordCount.toLocaleString()} words</span>
          <span>•</span>
          <span>{charCount.toLocaleString()} chars</span>
          <span>•</span>
          <span>{lineCount.toLocaleString()} lines</span>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleCopy}
            disabled={!text}
            className="h-8 gap-1.5 text-xs font-medium"
          >
            {copied ? <Check className="size-3.5 text-emerald-500" /> : <Copy className="size-3.5" />}
            <span>{copied ? 'Copied' : 'Copy Text'}</span>
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={handleDownload}
            disabled={!text}
            className="h-8 gap-1.5 text-xs font-medium"
          >
            <Download className="size-3.5" />
            <span>Download .txt</span>
          </Button>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        {!text ? (
          <div className="p-12 text-center text-muted-foreground text-sm">
            No readable text was detected in this document.
          </div>
        ) : (
          <div className="max-h-[650px] overflow-y-auto p-4 md:p-6 font-mono text-xs sm:text-sm leading-relaxed text-foreground/90 whitespace-pre-wrap select-text bg-background/50">
            {text}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
