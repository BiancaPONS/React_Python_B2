import type {
  AuthToken,
  LoginBody,
  LoginChallengeResponse,
  RegisterBody,
  User,
  VerifyLoginCodeBody,
} from "../types/api";
import { request } from "./http";


export function register(data: RegisterBody): Promise<User> {
  return request<User>("/auth/register", {
    method: "POST",
    body: JSON.stringify(data),
  });
}


export function login(data: LoginBody): Promise<LoginChallengeResponse> {
  return request<LoginChallengeResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify(data),
  });
}


export function verifyLoginCode(
  data: VerifyLoginCodeBody,
): Promise<AuthToken> {
  return request<AuthToken>("/auth/verify-code", {
    method: "POST",
    body: JSON.stringify(data),
  });
}


export function getMe(): Promise<User> {
  return request<User>("/auth/me");
}