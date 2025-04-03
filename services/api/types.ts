export enum PermissionLevel {
  Basic = 1,
  Cliente = 2,
  Estabelecimento = 3,
  Admin = 5,
}

export interface Cliente {
  id: string;
  numCpf: string;
  dataNascimento: Date;
  endereco: string;
  numero: string;
  complemento?: string;
  bairro: string;
  cidade: string;
  estado: string;
  cep: string;
  isAtivo: boolean;
  numCelular: string;
}

export interface Estabelecimento {
  numCnpj: string;
  nomeEstab: string;
  razaoSocial: string;
  numCelular: string;
  endereco: string;
  numero: string;
  complemento?: string;
  bairro: string;
  cidade: string;
  estado: string;
  cep: string;
  isAtivo: boolean;
  imgLogo?: string;
  latitude?: number;
  longitude?: number;
  status: 'ativo' | 'em_breve';
}

export interface User {
  id: string;
  nome: string;
  email: string;
  isAdmin: boolean;
  isAtivo: boolean;
  dataCriacao: Date;
  dataAtualizacao: Date;
  permission_level: PermissionLevel;
  hasCliente: boolean;
  hasEstabelecimento: boolean;
  cliente?: Cliente;
  estabelecimento?: Estabelecimento;
}

export type UserJwt = User & {
  exp: number;
  sub: string;
};

export type UserYjs = User & {
  clientId: string;
  color: string;
  avatar: string;
};

export interface BeerMenu {
  menuId: string;
  establishmentId: string;
}

export interface Establishment {
  establishmentId: string;
  name: string;
  menu: BeerMenu;
}
