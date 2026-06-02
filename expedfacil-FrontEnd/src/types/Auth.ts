export interface AuthUser {
  id: number;
  matricula: number;
  nome: string;
  cargo: string;
  role: "ADMIN" | "USER";
}

export interface LoginRequest {
  matricula: number;
  senha: string;
}

export interface LoginResponse {
  token: string;
  tipo: string;
  expiraEm: number;
  usuario: AuthUser;
}
