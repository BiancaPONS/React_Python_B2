import type {
  AuthToken,
  LoginBody,
  RegisterBody,
  User
} from "../types/api";
import { request } from "./http";

export function register(data: RegisterBody): Promise<User> {
  return request<User>("/auth/register", {
    method: "POST",
    body: JSON.stringify(data)
  });
}

export function login(data: LoginBody): Promise<AuthToken> {
  return request<AuthToken>("/auth/login", {
    method: "POST",
    body: JSON.stringify(data)
  });
}