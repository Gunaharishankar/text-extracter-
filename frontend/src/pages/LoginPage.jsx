import React, { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation, useSearchParams } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import GoogleLoginButton from '../components/GoogleLoginButton'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { Mail, Lock, Loader2, AlertCircle } from 'lucide-react'

const LoginPage = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [searchParams] = useSearchParams()
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    const errorParam = searchParams.get('error')
    if (errorParam === 'google_not_configured') {
      const msg =
        'Google Sign-In is not yet configured. Please add GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET to backend/.env, or sign in using email.'
      setError(msg)
      toast.error('Configuration Notice', { description: msg, duration: 6000 })
      window.history.replaceState({}, document.title, window.location.pathname)
    } else if (errorParam === 'google_auth_failed') {
      const msg = 'Google authentication was cancelled or failed. Please try again.'
      setError(msg)
      toast.error('Authentication Notice', { description: msg })
      window.history.replaceState({}, document.title, window.location.pathname)
    }
  }, [searchParams])

  const from = location.state?.from?.pathname || '/dashboard'

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      await login(email, password)
      toast.success('Welcome back!', {
        description: 'Successfully signed in to Transformo Docs.',
      })
      navigate(from, { replace: true })
    } catch (err) {
      const msg = err.response?.data?.message || 'Login failed. Please check your credentials.'
      if (err.response?.data?.emailVerified === false) {
        toast.error('Email not verified', {
          description: 'Redirecting to OTP verification screen...',
        })
        navigate(`/verify-email?email=${encodeURIComponent(email)}`)
        return
      }
      setError(msg)
      toast.error('Sign-in failed', { description: msg })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="border-border/70 shadow-xl bg-card/95 backdrop-blur-md">
      <CardHeader className="space-y-1 text-center pb-4">
        <CardTitle className="text-2xl font-bold tracking-tight">
          Welcome back
        </CardTitle>
        <CardDescription className="text-xs">
          Enter your credentials to access your document repository
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

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Password</Label>
              <Link
                to="/forgot-password"
                className="text-xs text-primary hover:underline font-medium"
              >
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-2.5 size-4 text-muted-foreground" />
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                autoComplete="current-password"
                className="pl-9"
              />
            </div>
          </div>

          <Button type="submit" className="w-full h-10 font-semibold" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="size-4 mr-2 animate-spin" />
                <span>Signing in...</span>
              </>
            ) : (
              'Sign In'
            )}
          </Button>
        </form>

        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border/60" />
          </div>
          <div className="relative flex justify-center text-[11px] uppercase">
            <span className="bg-card px-2 text-muted-foreground font-medium">
              Or continue with
            </span>
          </div>
        </div>

        <GoogleLoginButton text="Sign in with Google" />
      </CardContent>

      <CardFooter className="justify-center border-t border-border/40 py-4 text-xs text-muted-foreground">
        Don&apos;t have an account?{' '}
        <Link to="/register" className="ml-1 text-primary hover:underline font-semibold">
          Create account
        </Link>
      </CardFooter>
    </Card>
  )
}

export default LoginPage
