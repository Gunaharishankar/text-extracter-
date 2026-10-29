import React, { useState, useEffect, useCallback } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { documentService } from '../services/api'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { FileTypeIcon } from '@/components/documents/file-type-badge'
import { ProcessingStatusBadge } from '@/components/documents/processing-status'
import { ExtractedTextViewer } from '@/components/extraction/extracted-text-viewer'
import { MetadataPanel } from '@/components/extraction/metadata-panel'
import { formatBytes } from '@/lib/utils'
import {
  ArrowLeft,
  Trash2,
  Clock,
  HardDrive,
  Cpu,
  Layers,
  FileText,
  SlidersHorizontal,
} from 'lucide-react'
import { toast } from 'sonner'

const DocumentDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [document, setDocument] = useState(null)
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState(null)

  const fetchDocument = useCallback(
    async (isInitial = false) => {
      try {
        if (isInitial) setLoading(true)
        const response = await documentService.getDocument(id)
        setDocument(response.data.data)
      } catch (err) {
        setError('Failed to fetch document details')
        console.error(err)
      } finally {
        if (isInitial) setLoading(false)
      }
    },
    [id]
  )

  useEffect(() => {
    fetchDocument(true)
  }, [fetchDocument])

  // Polling while document is in processing or uploaded state
  useEffect(() => {
    if (!document) return
    if (document.status === 'processing' || document.status === 'uploaded') {
      const timer = setInterval(() => {
        fetchDocument(false)
      }, 3000)
      return () => clearInterval(timer)
    }
  }, [document?.status, fetchDocument])

  const handleDelete = async () => {
    setDeleting(true)
    try {
      await documentService.deleteDocument(id)
      toast.success('Document deleted successfully')
      navigate('/dashboard')
    } catch (err) {
      toast.error('Failed to delete document', {
        description: err.response?.data?.message || 'Server error occurred',
      })
      setDeleting(false)
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <Skeleton className="h-8 w-24 rounded-lg" />
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Skeleton className="size-12 rounded-xl" />
            <div className="space-y-2">
              <Skeleton className="h-6 w-64" />
              <Skeleton className="h-4 w-40" />
            </div>
          </div>
          <Skeleton className="h-9 w-24 rounded-lg" />
        </div>
        <Skeleton className="h-[400px] w-full rounded-xl" />
      </div>
    )
  }

  if (error || !document) {
    return (
      <div className="space-y-6 text-center py-12">
        <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-8 max-w-md mx-auto">
          <h2 className="text-lg font-semibold text-destructive">Document Not Found</h2>
          <p className="text-xs text-muted-foreground mt-1">
            {error || "The requested document could not be located or you don't have access."}
          </p>
          <Button asChild className="mt-4" size="sm">
            <Link to="/dashboard">
              <ArrowLeft className="size-4 mr-1.5" />
              Return to Dashboard
            </Link>
          </Button>
        </div>
      </div>
    )
  }

  const formattedSize = document.fileSize ? formatBytes(document.fileSize) : '--'
  const formattedDate = document.createdAt
    ? new Date(document.createdAt).toLocaleString(undefined, {
        dateStyle: 'medium',
        timeStyle: 'short',
      })
    : '--'

  return (
    <div className="space-y-6">
      {/* Top Navigation */}
      <div>
        <Button
          asChild
          variant="ghost"
          size="sm"
          className="h-8 gap-1.5 text-xs text-muted-foreground hover:text-foreground"
        >
          <Link to="/dashboard">
            <ArrowLeft className="size-3.5" />
            <span>Back to Dashboard</span>
          </Link>
        </Button>
      </div>

      {/* Document Title Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/50 pb-5">
        <div className="flex items-start gap-4 min-w-0">
          <FileTypeIcon
            fileName={document.originalName}
            mimeType={document.mimeType}
            size="lg"
          />
          <div className="min-w-0">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground truncate">
              {document.originalName}
            </h1>

            {/* Badges and metadata chips */}
            <div className="flex flex-wrap items-center gap-2 mt-2 text-xs text-muted-foreground">
              <ProcessingStatusBadge status={document.status} />

              {document.extractionMethod && (
                <span className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-secondary text-secondary-foreground font-medium border border-border/50 uppercase text-[10px] tracking-wider">
                  <Cpu className="size-3" />
                  {document.extractionMethod}
                </span>
              )}

              <span className="flex items-center gap-1">
                <HardDrive className="size-3" />
                {formattedSize}
              </span>

              <span>•</span>

              <span className="flex items-center gap-1">
                <Clock className="size-3" />
                {formattedDate}
              </span>
            </div>
          </div>
        </div>

        {/* Delete Action with Modal Confirmation */}
        <div className="flex items-center gap-2 shrink-0">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="destructive"
                size="sm"
                className="gap-1.5 text-xs font-medium"
                disabled={deleting}
              >
                <Trash2 className="size-3.5" />
                <span>Delete Document</span>
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete this document?</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to permanently delete{' '}
                  <span className="font-semibold text-foreground">
                    &ldquo;{document.originalName}&rdquo;
                  </span>
                  ? This will delete the extracted text, metadata, and uploaded source file. This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDelete}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  Confirm Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="extracted-text" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="extracted-text" className="gap-2">
            <FileText className="size-4" />
            <span>Extracted Text</span>
          </TabsTrigger>
          <TabsTrigger value="metadata" className="gap-2">
            <SlidersHorizontal className="size-4" />
            <span>Document Metadata</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="extracted-text">
          <ExtractedTextViewer
            text={document.extractedText}
            status={document.status}
            fileName={document.originalName}
          />
        </TabsContent>

        <TabsContent value="metadata">
          <MetadataPanel metadata={document.metadata} />
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default DocumentDetails
