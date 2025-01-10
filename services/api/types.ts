export enum PermissionLevel {
  Admin = 1,
  Establishment = 2,
  Customer = 3,
}

export interface User {
  id: number;
  name: string;
  givenName: string;
  email: string;
  permission_level: PermissionLevel;
}

export type UserJwt = User & {
  exp: number;
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
