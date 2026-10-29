import React, { useState, useEffect } from 'react'
import { useSearchParams, useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { authService } from '../services/authService'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator } from '@/components/ui/input-otp'
import { toast } from 'sonner'
import { ShieldCheck, Mail, Loader2, ArrowLeft, RefreshCw, AlertCircle } from 'lucide-react'

const VerifyEmailPage = () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { verifyEmail } = useAuth()

  const [email, setEmail] = useState(searchParams.get('email') || '')
  const [otp, setOtp] = useState('')
  const [loading, setLoading] = useState(false)
  const [resending, setResending] = useState(false)
  const [cooldown, setCooldown] = useState(0)
  const [error, setError] = useState('')

  useEffect(() => {
    if (cooldown > 0) {
      const timer = setTimeout(() => setCooldown(cooldown - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [cooldown])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (otp.length !== 6) {
      const msg = 'Please enter a valid 6-digit verification code.'
      setError(msg)
      toast.error('Validation notice', { description: msg })
      return
    }

    setError('')
    setLoading(true)

    try {
      await verifyEmail(email, otp)
      toast.success('Email verified successfully!', {
        description: 'Welcome to Transformo Docs. Redirecting to your dashboard...',
      })
      navigate('/dashboard', { replace: true })
    } catch (err) {
      const msg =
        err.response?.data?.message || 'Verification failed. Please check the code and try again.'
      setError(msg)
      toast.error('Verification failed', { description: msg })
    } finally {
      setLoading(false)
    }
  }

  const handleResend = async () => {
    if (cooldown > 0 || !email) return

    setResending(true)
    setError('')

    try {
      const res = await authService.resendOtp(email)
      toast.success('Code resent!', {
        description: res.data?.message || 'A fresh verification code has been dispatched.',
      })
      setCooldown(60)
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to resend code. Please try again later.'
      setError(msg)
      toast.error('Resend failed', { description: msg })
    } finally {
      setResending(false)
    }
  }

  return (
    <Card className="border-border/70 shadow-xl bg-card/95 backdrop-blur-md">
      <CardHeader className="space-y-2 text-center pb-4">
        <div className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary mb-1">
          <ShieldCheck className="size-6" />
        </div>
        <CardTitle className="text-2xl font-bold tracking-tight">
          Verify Your Email
        </CardTitle>
        <CardDescription className="text-xs max-w-xs mx-auto">
          We sent a 6-digit confirmation code to your email address to confirm your account
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {error && (
          <div className="flex items-start gap-2 rounded-lg bg-destructive/10 p-3 text-xs text-destructive border border-destructive/20 animate-in fade-in-50">
            <AlertCircle className="size-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
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
            <Label htmlFor="otp">6-Digit Verification Code</Label>
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
              'Verify & Continue'
            )}
          </Button>
        </form>

        <div className="flex flex-col items-center justify-center gap-1.5 pt-2 text-center text-xs text-muted-foreground border-t border-border/40">
          <span>Didn&apos;t receive the code?</span>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleResend}
            disabled={cooldown > 0 || resending}
            className="h-8 gap-1.5 text-xs text-primary font-medium hover:bg-primary/5"
          >
            {resending ? (
              <>
                <Loader2 className="size-3.5 animate-spin" />
                <span>Sending...</span>
              </>
            ) : (
              <>
                <RefreshCw className="size-3.5" />
                <span>{cooldown > 0 ? `Resend code in ${cooldown}s` : 'Resend Code'}</span>
              </>
            )}
          </Button>
        </div>
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

export default VerifyEmailPage
