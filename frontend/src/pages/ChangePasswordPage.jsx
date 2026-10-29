import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { authService } from '../services/authService'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { Lock, KeyRound, Loader2, ArrowLeft, CheckCircle2, ShieldCheck, AlertCircle } from 'lucide-react'

const ChangePasswordPage = () => {
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (newPassword !== confirmPassword) {
      const msg = 'New passwords do not match.'
      setError(msg)
      toast.error('Validation error', { description: msg })
      return
    }

    if (newPassword.length < 6) {
      const msg = 'New password must be at least 6 characters long.'
      setError(msg)
      toast.error('Validation error', { description: msg })
      return
    }

    setLoading(true)

    try {
      const res = await authService.changePassword(currentPassword, newPassword)
      setSuccess(true)
      toast.success('Password updated successfully!', {
        description: res.data?.message || 'Your account credentials have been updated.',
      })
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
      setTimeout(() => {
        navigate('/dashboard')
      }, 1500)
    } catch (err) {
      const msg =
        err.response?.data?.message || 'Failed to change password. Please check your current password.'
      setError(msg)
      toast.error('Update failed', { description: msg })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <div>
        <Button
          asChild
          variant="ghost"
          size="sm"
          className="h-8 gap-1.5 text-xs text-muted-foreground hover:text-foreground mb-2"
        >
          <Link to="/dashboard">
            <ArrowLeft className="size-3.5" />
            <span>Back to Dashboard</span>
          </Link>
        </Button>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Change Password
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Update your password to keep your account and extracted documents secure.
        </p>
      </div>

      <Card className="border-border/70 shadow-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <KeyRound className="size-5 text-primary" />
            <span>Account Security</span>
          </CardTitle>
          <CardDescription className="text-xs">
            Enter your current password followed by your new password
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {error && (
            <div className="flex items-start gap-2 rounded-lg bg-destructive/10 p-3 text-xs text-destructive border border-destructive/20 animate-in fade-in-50">
              <AlertCircle className="size-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="flex items-start gap-2 rounded-lg bg-emerald-500/10 p-3 text-xs text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 animate-in fade-in-50">
              <CheckCircle2 className="size-4 shrink-0 mt-0.5 text-emerald-500" />
              <span>Password updated successfully! Redirecting to dashboard...</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="currentPassword">Current Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 size-4 text-muted-foreground" />
                <Input
                  id="currentPassword"
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  autoComplete="current-password"
                  className="pl-9"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="newPassword">New Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 size-4 text-muted-foreground" />
                <Input
                  id="newPassword"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  required
                  autoComplete="new-password"
                  className="pl-9"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="confirmPassword">Confirm New Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 size-4 text-muted-foreground" />
                <Input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repeat new password"
                  required
                  autoComplete="new-password"
                  className="pl-9"
                />
              </div>
            </div>

            <div className="pt-2">
              <Button type="submit" className="w-full sm:w-auto h-10 font-semibold" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="size-4 mr-2 animate-spin" />
                    <span>Updating password...</span>
                  </>
                ) : (
                  'Update Password'
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

export default ChangePasswordPage
