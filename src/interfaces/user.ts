export interface User {
  name: string;
  phone: string;
  numCpf: string;
  email?: string;
  password: string;
  notifications: boolean;
  birth?: string;
}
