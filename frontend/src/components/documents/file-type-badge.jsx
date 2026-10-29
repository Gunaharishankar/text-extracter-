import React from 'react'
import { FileText, FileSpreadsheet, Image as ImageIcon, Presentation, FileCode, File } from 'lucide-react'

export function getFileIcon(fileName = '', mimeType = '') {
  const ext = fileName.split('.').pop()?.toLowerCase() || ''
  
  if (ext === 'pdf' || mimeType.includes('pdf')) {
    return { icon: FileText, color: 'text-red-500 bg-red-500/10 border-red-500/20', label: 'PDF' }
  }
  if (['doc', 'docx'].includes(ext) || mimeType.includes('word')) {
    return { icon: FileText, color: 'text-blue-500 bg-blue-500/10 border-blue-500/20', label: 'DOCX' }
  }
  if (['xls', 'xlsx'].includes(ext) || mimeType.includes('spreadsheet') || mimeType.includes('excel')) {
    return { icon: FileSpreadsheet, color: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20', label: 'XLSX' }
  }
  if (['ppt', 'pptx'].includes(ext) || mimeType.includes('presentation')) {
    return { icon: Presentation, color: 'text-amber-500 bg-amber-500/10 border-amber-500/20', label: 'PPTX' }
  }
  if (['jpg', 'jpeg', 'png', 'webp', 'bmp', 'tiff'].includes(ext) || mimeType.includes('image')) {
    return { icon: ImageIcon, color: 'text-purple-500 bg-purple-500/10 border-purple-500/20', label: 'IMG' }
  }
  if (ext === 'txt' || mimeType.includes('text/plain')) {
    return { icon: FileCode, color: 'text-slate-500 bg-slate-500/10 border-slate-500/20', label: 'TXT' }
  }

  return { icon: File, color: 'text-muted-foreground bg-muted border-border', label: ext.toUpperCase() || 'FILE' }
}

export function FileTypeIcon({ fileName, mimeType, size = 'md', className = '' }) {
  const { icon: Icon, color } = getFileIcon(fileName, mimeType)
  const sizeClasses = size === 'sm' ? 'p-1.5 rounded-md size-7' : 'p-2 rounded-xl size-9'
  const iconSizes = size === 'sm' ? 'size-4' : 'size-5'

  return (
    <div className={`flex items-center justify-center shrink-0 border ${color} ${sizeClasses} ${className}`}>
      <Icon className={iconSizes} />
    </div>
  )
}
