import api from "../api/index";

export const login = async (
  code: string,
  sessionState: string,
  redirectUrl: string
) => {
  return await api.post(`api/v1/sessions`, {
    code,
    sessionState,
    redirect_url: redirectUrl,
  });
};

export const logout = async () => {
  return await api.delete(`api/v1/sessions`);
};

export const expired = async (user_id: number, user_name: string) => {
  return await api.post(`api/v1/sessions/expired`, { user_id, user_name });
};

export const localLogin = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}) => {
  return await api.post(`api/v1/sessions-local`, {
    email,
    password,
  });
};
