import { useRouter } from 'next/router';
import { useEffect } from 'react';
import SeoHead from '@/components/SeoHead';
export default function RegisterRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/auth?register=true');
  }, [router]);

  return <>
    <SeoHead title='Registro - DeuQuantas' />
  </>;
}
