const BASE_URLS = {
  development: 'http://localhost:3000',
  production: 'https://deuquantas.com.br',
  test: 'http://localhost:3000', // se necessário para ambiente de teste
} as const;

export const getBaseUrl = () => {
  return BASE_URLS[process.env.NODE_ENV || 'development'];
};

export const ROUTES = {
  login: '/login',
  signup: '/signup',
  dashboard: '/dashboard',
  // ... outras rotas
} as const;

// Helper para construir URLs completas
export const buildUrl = (path: string) => {
  return `${getBaseUrl()}${path}`;
};

export const API_ROUTES = {
  auth: {
    login: '/api/auth/login',
    logout: '/api/auth/logout',
    // ... outras rotas de auth
  },
  user: {
    profile: '/api/user/profile',
    // ... outras rotas de usuário
  },
} as const;

export const EXTERNAL_LINKS = {
  instagram: 'https://instagram.com/deuquantas',
  facebook: 'https://facebook.com/deuquantas',
  // ... outros links externos
} as const;

// Você também pode adicionar tipos para garantir segurança
export type AppRoute = keyof typeof ROUTES;
export type ApiRoute = keyof typeof API_ROUTES;
