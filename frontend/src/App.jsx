import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { ThemeProvider } from './components/themes/theme-provider'
import { Toaster as SonnerToaster } from '@/components/ui/sonner'

import ProtectedRoute from './components/ProtectedRoute'
import PublicRoute from './components/PublicRoute'
import GoogleCallbackHandler from './components/GoogleCallbackHandler'
import { AppShell } from './components/layout/app-shell'
import { AuthLayout } from './components/auth/auth-layout'

import Dashboard from './pages/Dashboard'
import DocumentDetails from './pages/DocumentDetails'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import VerifyEmailPage from './pages/VerifyEmailPage'
import ForgotPasswordPage from './pages/ForgotPasswordPage'
import ResetPasswordPage from './pages/ResetPasswordPage'
import ChangePasswordPage from './pages/ChangePasswordPage'
import { Example as HamburgerDemo } from './components/ui/animated-hamburger-button'

function App() {
  return (
    <ThemeProvider defaultTheme="system" defaultColorTheme="supabase">
      <AuthProvider>
        <Router>
          <SonnerToaster />
          <Routes>

            {/* Public Authentication Routes */}
            <Route
              path="/login"
              element={
                <PublicRoute>
                  <AuthLayout>
                    <LoginPage />
                  </AuthLayout>
                </PublicRoute>
              }
            />
            <Route
              path="/register"
              element={
                <PublicRoute>
                  <AuthLayout>
                    <RegisterPage />
                  </AuthLayout>
                </PublicRoute>
              }
            />
            <Route
              path="/verify-email"
              element={
                <AuthLayout>
                  <VerifyEmailPage />
                </AuthLayout>
              }
            />
            <Route
              path="/forgot-password"
              element={
                <PublicRoute>
                  <AuthLayout>
                    <ForgotPasswordPage />
                  </AuthLayout>
                </PublicRoute>
              }
            />
            <Route
              path="/reset-password"
              element={
                <PublicRoute>
                  <AuthLayout>
                    <ResetPasswordPage />
                  </AuthLayout>
                </PublicRoute>
              }
            />
            <Route path="/auth/google/callback" element={<GoogleCallbackHandler />} />

            {/* Protected Document Management Routes */}
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <AppShell>
                    <Dashboard />
                  </AppShell>
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <AppShell>
                    <Dashboard />
                  </AppShell>
                </ProtectedRoute>
              }
            />
            <Route
              path="/document/:id"
              element={
                <ProtectedRoute>
                  <AppShell>
                    <DocumentDetails />
                  </AppShell>
                </ProtectedRoute>
              }
            />
            <Route
              path="/change-password"
              element={
                <ProtectedRoute>
                  <AppShell>
                    <ChangePasswordPage />
                  </AppShell>
                </ProtectedRoute>
              }
            />

            {/* Interactive Animated Hamburger Demo */}
            <Route path="/hamburger-demo" element={<HamburgerDemo />} />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App
