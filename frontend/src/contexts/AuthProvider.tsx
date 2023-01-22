import {
  createContext,
  Dispatch,
  ReactElement,
  SetStateAction,
  useEffect,
  useMemo,
  useState,
} from "react";

import { requestApi } from "@/api/request";
import { User } from "@/interfaces/api";
import { ENDPOINTS } from "@/api/endpoints";

const AuthContext = createContext<useAuthProps>({} as useAuthProps);

type AuthProviderProps = {
  children: ReactElement;
};

type useAuthProps = {
  isAuthenticated: boolean;
  isAuthLoading: boolean;
  setUser: Dispatch<SetStateAction<User | undefined>>;
};

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | undefined>();
  const [isAuthLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    const getMe = async () => {
      setAuthLoading(true);
      try {
        const data = await requestApi<User>(ENDPOINTS.me);
        setUser(data);
      } catch (e) {
        setUser(undefined);
      }
      setAuthLoading(false);
    };
    getMe();
  }, []);

  const isAuthenticated = !!user;

  const value = useMemo(
    () => ({ isAuthenticated, setUser, isAuthLoading }),
    [isAuthenticated, isAuthLoading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
