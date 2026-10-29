import React, { useState, useEffect, useCallback } from 'react'
import { documentService } from '../services/api'
import { DashboardStats } from '@/components/dashboard/stats-card'
import { UploadZone } from '@/components/upload/upload-zone'
import { RecentDocuments } from '@/components/dashboard/recent-documents'
import { toast } from 'sonner'

const Dashboard = () => {
  const [documents, setDocuments] = useState([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState(null)

  const fetchDocuments = useCallback(async (isInitial = false) => {
    try {
      if (isInitial) setLoading(true)
      const response = await documentService.getDocuments()
      setDocuments(response.data.data || [])
    } catch (err) {
      console.error('Failed to fetch documents:', err)
      if (isInitial) {
        setError('Failed to load documents. Please check your connection.')
      }
    } finally {
      if (isInitial) setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchDocuments(true)
    const interval = setInterval(() => {
      fetchDocuments(false)
    }, 5000)
    return () => clearInterval(interval)
  }, [fetchDocuments])

  const onDrop = useCallback(
    async (acceptedFiles) => {
      const file = acceptedFiles[0]
      if (!file) return

      setUploading(true)
      setError(null)

      try {
        const res = await documentService.uploadDocument(file)
        toast.success(`"${file.name}" uploaded successfully!`, {
          description: 'Document extraction is now running in the background.',
        })
        await fetchDocuments(false)
      } catch (err) {
        const msg = err.response?.data?.message || 'Failed to upload document'
        setError(msg)
        toast.error('Upload failed', { description: msg })
      } finally {
        setUploading(false)
      }
    },
    [fetchDocuments]
  )

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          Dashboard
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Upload documents, monitor extraction pipelines, and inspect structured text.
        </p>
      </div>

      {/* Top Stats Cards */}
      <DashboardStats documents={documents} />

      {/* Upload Zone */}
      <div className="space-y-2">
        <h2 className="text-sm font-semibold text-foreground uppercase tracking-wider">
          Upload & Process
        </h2>
        <UploadZone onDrop={onDrop} uploading={uploading} error={error} />
      </div>

      {/* Document Repository */}
      <RecentDocuments
        documents={documents}
        loading={loading}
        onRefresh={() => fetchDocuments(false)}
      />
    </div>
  )
}

export default Dashboard
