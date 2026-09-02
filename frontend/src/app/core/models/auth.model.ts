export type UserRole =
  | 'ROLE_ADMIN'
  | 'ROLE_MANAGER'
  | 'ROLE_EMPLOYEE'
  | 'ADMIN'
  | 'MANAGER'
  | 'EMPLOYEE'
  | 'USER';

export interface LoginRequestDTO {
  email?: string;
  username?: string;
  password?: string;
}

export interface RegisterUserRequestDTO {
  username: string;
  email: string;
  password: string;
  role: UserRole;
}

export interface AuthResponseDTO {
  token: string;
  refreshToken?: string;
  tokenType?: string;
  id: number;
  username: string;
  email: string;
  role: string;
}

export interface UserSession {
  id: number;
  username: string;
  email: string;
  role?: string;
  token: string;
}
