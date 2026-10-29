import React from 'react'
import { Button } from '@/components/ui/button'

const GoogleLoginButton = ({ text = 'Continue with Google' }) => {
  const handleGoogleLogin = () => {
    const backendUrl = import.meta.env.VITE_API_URL
      ? import.meta.env.VITE_API_URL.replace('/api', '')
      : 'http://localhost:5000'
    window.location.href = `${backendUrl}/api/google/init`
  }

  return (
    <Button
      type="button"
      variant="outline"
      onClick={handleGoogleLogin}
      className="w-full h-10 gap-3 border-border/80 bg-background hover:bg-muted font-medium text-sm transition-all shadow-sm"
    >
      <svg className="size-4 shrink-0" viewBox="0 0 18 18">
        <path
          fill="#4285F4"
          d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.616z"
        />
        <path
          fill="#34A853"
          d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332C2.438 15.983 5.482 18 9 18z"
        />
        <path
          fill="#FBBC05"
          d="M3.964 10.707c-.18-.54-.282-1.117-.282-1.707 0-.59.102-1.167.282-1.707V4.961H.957C.347 6.175 0 7.55 0 9s.348 2.825.957 4.039l3.007-2.332z"
        />
        <path
          fill="#EA4335"
          d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0 5.482 0 2.438 2.017.957 4.961L3.964 7.293C4.672 5.166 6.656 3.58 9 3.58z"
        />
      </svg>
      <span>{text}</span>
    </Button>
  )
}

export default GoogleLoginButton
