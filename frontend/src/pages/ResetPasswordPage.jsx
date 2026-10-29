import React, { useState } from 'react'
import { useSearchParams, useNavigate, Link } from 'react-router-dom'
import { authService } from '../services/authService'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator } from '@/components/ui/input-otp'
import { toast } from 'sonner'
import { Lock, Mail, Loader2, ArrowLeft, CheckCircle2, ShieldAlert, AlertCircle } from 'lucide-react'

const ResetPasswordPage = () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()

  const [email, setEmail] = useState(searchParams.get('email') || '')
  const [otp, setOtp] = useState('')
  const [resetToken, setResetToken] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [step, setStep] = useState(1) // 1 = OTP verify, 2 = Set new password
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleVerifyOtp = async (e) => {
    e.preventDefault()
    if (otp.length !== 6) {
      const msg = 'Please enter a 6-digit reset code.'
      setError(msg)
      toast.error('Validation error', { description: msg })
      return
    }

    setError('')
    setLoading(true)

    try {
      const res = await authService.verifyResetOtp(email, otp)
      setResetToken(res.data.resetToken)
      setStep(2)
      toast.success('Code verified!', {
        description: 'You can now set a new secure password.',
      })
    } catch (err) {
      const msg = err.response?.data?.message || 'Invalid or expired reset code.'
      setError(msg)
      toast.error('Verification failed', { description: msg })
    } finally {
      setLoading(false)
    }
  }

  const handleResetPassword = async (e) => {
    e.preventDefault()

    if (newPassword !== confirmPassword) {
      const msg = 'Passwords do not match.'
      setError(msg)
      toast.error('Validation error', { description: msg })
      return
    }

    if (newPassword.length < 6) {
      const msg = 'Password must be at least 6 characters long.'
      setError(msg)
      toast.error('Validation error', { description: msg })
      return
    }

    setError('')
    setLoading(true)

    try {
      const res = await authService.resetPassword(resetToken, newPassword)
      toast.success('Password updated!', {
        description: res.data?.message || 'Password reset successful. Please sign in with your new password.',
      })
      navigate('/login')
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to reset password. Please try again.'
      setError(msg)
      toast.error('Reset failed', { description: msg })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="border-border/70 shadow-xl bg-card/95 backdrop-blur-md">
      <CardHeader className="space-y-2 text-center pb-4">
        <div className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary mb-1">
          {step === 1 ? (
            <ShieldAlert className="size-6 text-amber-500" />
          ) : (
            <CheckCircle2 className="size-6 text-emerald-500" />
          )}
        </div>
        <CardTitle className="text-2xl font-bold tracking-tight">
          {step === 1 ? 'Verify Reset Code' : 'Set New Password'}
        </CardTitle>
        <CardDescription className="text-xs">
          {step === 1
            ? 'Step 1 of 2: Enter the 6-digit code sent to your email'
            : 'Step 2 of 2: Create a secure password for your account'}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {error && (
          <div className="flex items-start gap-2 rounded-lg bg-destructive/10 p-3 text-xs text-destructive border border-destructive/20 animate-in fade-in-50">
            <AlertCircle className="size-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {step === 1 ? (
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="email">Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 size-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  required
                  className="pl-9"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="otp">6-Digit Reset Code</Label>
              <div className="flex justify-center py-2">
                <InputOTP maxLength={6} value={otp} onChange={setOtp}>
                  <InputOTPGroup>
                    <InputOTPSlot index={0} className="size-10 text-base" />
                    <InputOTPSlot index={1} className="size-10 text-base" />
                    <InputOTPSlot index={2} className="size-10 text-base" />
                  </InputOTPGroup>
                  <InputOTPSeparator />
                  <InputOTPGroup>
                    <InputOTPSlot index={3} className="size-10 text-base" />
                    <InputOTPSlot index={4} className="size-10 text-base" />
                    <InputOTPSlot index={5} className="size-10 text-base" />
                  </InputOTPGroup>
                </InputOTP>
              </div>
            </div>

            <Button type="submit" className="w-full h-10 font-semibold" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="size-4 mr-2 animate-spin" />
                  <span>Verifying code...</span>
                </>
              ) : (
                'Verify & Proceed'
              )}
            </Button>
          </form>
        ) : (
          <form onSubmit={handleResetPassword} className="space-y-3.5">
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

            <Button type="submit" className="w-full h-10 font-semibold mt-2" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="size-4 mr-2 animate-spin" />
                  <span>Updating password...</span>
                </>
              ) : (
                'Set New Password'
              )}
            </Button>
          </form>
        )}
      </CardContent>

      <CardFooter className="justify-center border-t border-border/40 py-4 text-xs text-muted-foreground">
        <Link
          to="/login"
          className="flex items-center gap-1 text-muted-foreground hover:text-foreground font-medium"
        >
          <ArrowLeft className="size-3.5" />
          <span>Back to Sign In</span>
        </Link>
      </CardFooter>
    </Card>
  )
}

export default ResetPasswordPage
