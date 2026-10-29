import api from './api';

export const authService = {
  register: (name, email, password) => {
    return api.post('/auth/register', { name, email, password });
  },

  verifyEmail: (email, otp) => {
    return api.post('/auth/verify-email', { email, otp });
  },

  resendOtp: (email) => {
    return api.post('/auth/resend-otp', { email });
  },

  login: (email, password) => {
    return api.post('/auth/login', { email, password });
  },

  logout: () => {
    return api.post('/auth/logout');
  },

  getMe: () => {
    return api.get('/auth/me');
  },

  refreshToken: () => {
    return api.post('/auth/refresh-token');
  },

  forgotPassword: (email) => {
    return api.post('/auth/forgot-password', { email });
  },

  verifyResetOtp: (email, otp) => {
    return api.post('/auth/verify-reset-otp', { email, otp });
  },

  resetPassword: (resetToken, newPassword) => {
    return api.post('/auth/reset-password', { resetToken, newPassword });
  },

  changePassword: (currentPassword, newPassword) => {
    return api.post('/auth/change-password', { currentPassword, newPassword });
  }
};
