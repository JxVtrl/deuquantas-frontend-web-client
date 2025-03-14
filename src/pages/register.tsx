import { useRouter } from 'next/router';
import { useEffect } from 'react';

export default function RegisterRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/auth/register');
  }, [router]);

  return <></>;
}
