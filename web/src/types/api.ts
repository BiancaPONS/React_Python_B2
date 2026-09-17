export interface User {
  id: number;
  email: string;
}

export interface RegisterBody {
  email: string;
  password: string;
}

export interface LoginBody {
  email: string;
  password: string;
}

export interface AuthToken {
  access_token: string;
  token_type: string;
}

export interface ApiError {
  code: number;
  message: string;
}