import React from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../../contexts/AuthContext';
import { AuthContainer } from '../../components/auth/AuthContainer';
import { useAuthForm } from '../../hooks/useAuthForm';

export default function AuthPage() {
  const router = useRouter();
  const { login, register } = useAuth();
  const {
    isLogin,
    formData,
    loading,
    error,
    handleInputChange,
    handleSubmit,
    toggleForm,
  } = useAuthForm({
    login,
    register,
    onSuccess: () => router.push('/dashboard'),
  });

  return (
    <AuthContainer
      isLogin={isLogin}
      loading={loading}
      error={error}
      formData={formData}
      onInputChange={handleInputChange}
      onSubmit={handleSubmit}
      onToggleForm={toggleForm}
    />
  );
}
