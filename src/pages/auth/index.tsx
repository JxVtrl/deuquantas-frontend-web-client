import React from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../../contexts/AuthContext';
import { AuthContainer } from '../../components/auth/AuthContainer';
import { useAuthForm } from '../../hooks/useAuthForm';

export default function AuthPage() {
  const router = useRouter();
  const { login, register } = useAuth();
  const { loading, error } = useAuthForm({
    login,
    register,
    onSuccess: () => router.push('/customer/home'),
  });

  const isRegistered = router.query.register === 'true';

  return (
    <AuthContainer
      loading={loading}
      error={error}
      isRegistered={isRegistered}
    />
  );
}
