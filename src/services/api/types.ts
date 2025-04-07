export enum PermissionLevel {
  Basic = 1,
  Cliente = 2,
  Estabelecimento = 3,
  Admin = 5,
}

export interface Cliente {
  num_cpf: string;
  data_nascimento: Date;
  num_celular: string;
}

export interface Estabelecimento {
  num_cnpj: string;
  nome_estab: string;
  razao_social: string;
  num_celular: string;
  imgLogo?: string;
  latitude?: number;
  longitude?: number;
  status: 'ativo' | 'em_breve';
}

export interface UserPreferences {
  isLeftHanded: boolean;
  language: 'pt' | 'en';
}

export interface User {
  endereco: {
    cep: string;
    endereco: string;
    numero: string;
    complemento: string;
    bairro: string;
    cidade: string;
    estado: string;
  };
  usuario: {
    id: string;
    name: string;
    email: string;
    is_admin: boolean;
    is_ativo: boolean;
    data_criacao: Date;
    data_atualizacao: Date;
    permission_level: PermissionLevel;
  };
  cliente?: Cliente;
  estabelecimento?: Estabelecimento;
  preferences?: UserPreferences;
}

export type UserJwt = User & {
  exp: number;
  sub: string;
  hasCliente: boolean;
  hasEstabelecimento: boolean;
  permission_level: PermissionLevel;
};

export interface Mesa {
  num_cnpj: string;
  numMesa: string;
  numMaxPax: number;
  is_ativo: boolean;
  status: 'disponivel' | 'ocupada';
  data_criacao: string;
  data_atualizacao: string;
  qrCode: string;
}
