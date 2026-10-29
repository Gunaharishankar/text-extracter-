import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { authService } from '../services/authService';
import { Loader2 } from 'lucide-react';

const GoogleCallbackHandler = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { setAuthToken } = useAuth();
  const [error, setError] = useState(null);

  useEffect(() => {
    const handleGoogleAuth = async () => {
      const accessToken = searchParams.get('accessToken');

      if (!accessToken) {
        navigate('/login?error=google_failed', { replace: true });
        return;
      }

      try {
        setAuthToken(accessToken, null);
        const meRes = await authService.getMe();
        if (meRes.data.success) {
          setAuthToken(accessToken, meRes.data.user);
          // Clean token from browser history/URL
          window.history.replaceState({}, document.title, window.location.pathname);
          navigate('/dashboard', { replace: true });
        } else {
          throw new Error('Failed to retrieve user profile');
        }
      } catch (err) {
        console.error('Google callback error:', err);
        setError('Authentication failed. Please try logging in again.');
        setTimeout(() => {
          navigate('/login', { replace: true });
        }, 2500);
      }
    };

    handleGoogleAuth();
  }, [searchParams, navigate, setAuthToken]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', gap: '1rem' }}>
      {error ? (
        <p style={{ color: '#ef4444' }}>{error}</p>
      ) : (
        <>
          <Loader2 className="animate-spin text-blue-500" size={36} />
          <p style={{ color: '#64748b' }}>Authenticating with Google...</p>
        </>
      )}
    </div>
  );
};

export default GoogleCallbackHandler;
