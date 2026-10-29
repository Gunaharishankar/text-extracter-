import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { authService } from '../services/authService'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { Mail, KeyRound, Loader2, ArrowLeft, AlertCircle } from 'lucide-react'

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await authService.forgotPassword(email)
      toast.success('Reset code dispatched', {
        description: res.data?.message || 'If that account exists, a 6-digit recovery code was sent.',
      })
      navigate(`/reset-password?email=${encodeURIComponent(email)}`)
    } catch (err) {
      const msg = err.response?.data?.message || 'Something went wrong. Please try again.'
      setError(msg)
      toast.error('Request failed', { description: msg })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="border-border/70 shadow-xl bg-card/95 backdrop-blur-md">
      <CardHeader className="space-y-2 text-center pb-4">
        <div className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary mb-1">
          <KeyRound className="size-6" />
        </div>
        <CardTitle className="text-2xl font-bold tracking-tight">
          Forgot Password?
        </CardTitle>
        <CardDescription className="text-xs max-w-xs mx-auto">
          Enter your registered email address and we&apos;ll dispatch a password reset code
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
                autoComplete="email"
                className="pl-9"
              />
            </div>
          </div>

          <Button type="submit" className="w-full h-10 font-semibold" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="size-4 mr-2 animate-spin" />
                <span>Sending code...</span>
              </>
            ) : (
              'Send Reset Code'
            )}
          </Button>
        </form>
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

export default ForgotPasswordPage
