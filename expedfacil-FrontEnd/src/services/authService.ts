import api from "./api";
import type { LoginRequest, LoginResponse, AuthUser } from "../types/Auth";

export async function login(request: LoginRequest): Promise<LoginResponse> {
  const response = await api.post("/auth/login", request);
  return response.data;
}

export async function me(): Promise<AuthUser> {
  const response = await api.get("/auth/me");
  return response.data;
}
