import { useRouter } from 'next/router';
import { useEffect } from 'react';

export default function LoginRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/auth');
  }, [router]);

  return <></>;
}
