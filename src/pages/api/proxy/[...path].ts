import { NextApiRequest, NextApiResponse } from 'next';
import httpProxyMiddleware from 'next-http-proxy-middleware';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const isDocker = process.env.NEXT_PUBLIC_DOCKER_ENV === 'true';
  const target = isDocker ? 'http://backend:3001' : 'http://localhost:3001';

  return httpProxyMiddleware(req, res, {
    target,
    pathRewrite: [
      {
        patternStr: '^/api/proxy',
        replaceStr: '',
      },
    ],
    changeOrigin: true,
    secure: false,
  });
}
