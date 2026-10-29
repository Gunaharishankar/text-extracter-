import React from 'react'
import { useDropzone } from 'react-dropzone'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { UploadCloud, Loader2, AlertCircle, FileCheck, Sparkles } from 'lucide-react'

export function UploadZone({ onDrop, uploading, error }) {
  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop,
    noClick: false,
    noKeyboard: false,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'application/vnd.openxmlformats-officedocument.presentationml.presentation': ['.pptx'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
      'text/plain': ['.txt'],
    },
    maxSize: 10 * 1024 * 1024, // 10MB
  })

  return (
    <Card className="border-border/60 overflow-hidden shadow-sm">
      <CardContent className="p-0">
        <div
          {...getRootProps()}
          className={`relative flex flex-col items-center justify-center p-8 md:p-10 text-center cursor-pointer transition-all duration-200 border-2 border-dashed ${
            isDragActive
              ? 'border-primary bg-primary/5 scale-[0.99]'
              : 'border-border/70 hover:border-primary/50 hover:bg-muted/30'
          }`}
        >
          <input {...getInputProps()} />

          {/* Decorative central icon */}
          <div
            className={`flex size-16 items-center justify-center rounded-2xl mb-4 transition-transform duration-300 ${
              isDragActive
                ? 'bg-primary text-primary-foreground scale-110 shadow-lg shadow-primary/25'
                : 'bg-muted/80 text-primary border border-border/80 group-hover:scale-105'
            }`}
          >
            {uploading ? (
              <Loader2 className="size-8 animate-spin text-primary" />
            ) : isDragActive ? (
              <FileCheck className="size-8" />
            ) : (
              <UploadCloud className="size-8" />
            )}
          </div>

          <div className="max-w-md space-y-1.5">
            {uploading ? (
              <div className="space-y-1">
                <p className="text-base font-semibold text-foreground">
                  Processing & uploading document...
                </p>
                <p className="text-xs text-muted-foreground">
                  Dispatching to extraction engine (Apache Tika / Tesseract OCR)
                </p>
              </div>
            ) : isDragActive ? (
              <p className="text-base font-semibold text-primary">
                Drop your document right here!
              </p>
            ) : (
              <>
                <p className="text-base font-semibold text-foreground">
                  Drag and drop your document here, or{' '}
                  <span className="text-primary hover:underline font-medium">browse files</span>
                </p>
                <p className="text-xs text-muted-foreground">
                  High-accuracy extraction for PDFs, Office documents, and scanned images
                </p>
              </>
            )}
          </div>

          {/* Supported format pills */}
          <div className="flex flex-wrap items-center justify-center gap-1.5 mt-5">
            {['PDF', 'DOCX', 'PPTX', 'XLSX', 'JPG', 'PNG', 'TXT'].map((ext) => (
              <span
                key={ext}
                className="px-2 py-0.5 text-[11px] font-medium rounded-md bg-secondary text-secondary-foreground border border-border/50"
              >
                {ext}
              </span>
            ))}
            <span className="text-[11px] text-muted-foreground ml-1">
              (Up to 10MB)
            </span>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="mt-4 flex items-center gap-2 rounded-lg bg-destructive/10 px-3.5 py-2 text-xs font-medium text-destructive border border-destructive/20 animate-in fade-in-50">
              <AlertCircle className="size-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
