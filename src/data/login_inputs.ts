export interface LoginFormData {
  email: string;
  password: string;
}

export const login_inputs: Array<{
  id: keyof LoginFormData;
  type: string;
  label: string;
  placeholder: string;
}> = [
  {
    id: 'email',
    type: 'email',
    label: 'E-mail',
    placeholder: 'your-email@email.com',
  },
  {
    id: 'password',
    type: 'password',
    label: 'Senha',
    placeholder: '••••••••••',
  },
];
