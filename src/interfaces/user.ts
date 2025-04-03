export interface User {
  name: string;
  phone: string;
  cpf: string;
  email?: string;
  password: string;
  notifications: boolean;
  birth?: string;
}
