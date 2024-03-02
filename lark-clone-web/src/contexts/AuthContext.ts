import {createContext} from "react"
import {User} from "../types/User";

export interface Auth {
  token: string | null;
  userInfo: User | null;
  setToken: Function;
  login: Function;
  logout: Function;
  isAdmin: boolean,
}

const AuthContext = createContext<Auth>({
  login: async () => {},
  logout: async () => {},
  token: null,
  userInfo: null,
  isAdmin: false,
  setToken: () => {},
});

export default AuthContext;

