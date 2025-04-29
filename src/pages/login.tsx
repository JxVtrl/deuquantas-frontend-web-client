import { useRouter } from 'next/router';
import { useEffect } from 'react';
import SeoHead from '@/components/SeoHead';
export default function LoginRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/auth');
  }, [router]);

  return (
    <>
      <SeoHead title='Login - DeuQuantas' />
    </>
  );
}
