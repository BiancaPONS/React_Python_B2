import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { ReactNode } from "react";

import {
  getMe,
  login as loginRequest,
  register as registerRequest,
} from "../services/authService";
import type {
  AuthToken,
  LoginBody,
  RegisterBody,
  User,
} from "../types/api";

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (data: LoginBody) => Promise<void>;
  register: (data: RegisterBody) => Promise<User>;
  logout: () => void;
}

interface AuthProviderProps {
  children: ReactNode;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({
  children,
}: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("access_token");

    if (token === null) {
      setLoading(false);
      return;
    }

    getMe()
      .then((currentUser) => {
        setUser(currentUser);
      })
      .catch(() => {
        localStorage.removeItem("access_token");
        setUser(null);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  async function login(data: LoginBody): Promise<void> {
    const token: AuthToken = await loginRequest(data);

    localStorage.setItem("access_token", token.access_token);

    const currentUser = await getMe();
    setUser(currentUser);
  }

  async function register(data: RegisterBody): Promise<User> {
    return registerRequest(data);
  }

  function logout(): void {
    localStorage.removeItem("access_token");
    setUser(null);
  }

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      loading,
      isAuthenticated: user !== null,
      login,
      register,
      logout,
    }),
    [user, loading],
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error("useAuth doit être utilisé dans AuthProvider.");
  }

  return context;
}