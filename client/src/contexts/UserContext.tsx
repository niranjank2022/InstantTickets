import { createContext, ReactNode, useState } from "react";
import { Roles } from "../services/auth.api";

interface IUserContext {
  city: string;
  toggleLogged: () => void;
  logged: boolean;
  changeCity: (newCity: string) => void;
  username: string;
  role: string;
  changeRole: (newRole: Roles) => void;
}

const UserContext = createContext<IUserContext | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const storedLogged = JSON.parse(localStorage.getItem("logged") || "false");
  const [logged, setLogged] = useState<boolean>(storedLogged);
  const toggleLogged = () => {
    setLogged((prev) => {
      localStorage.setItem("logged", JSON.stringify(!prev));
      return !prev;
    });
  };

  const storedCity = localStorage.getItem("city") || "Chennai";
  const [city, setCity] = useState<string>(storedCity);
  const changeCity = (newCity: string) => {
    setCity(newCity);
    localStorage.setItem("city", newCity);
  };

  const username = "Guest";
  const storedRole = (localStorage.getItem("role") as Roles) || Roles.User;
  const [role, setRole] = useState<Roles>(storedRole);
  const changeRole = (newRole: Roles) => {
    setRole(newRole);
    localStorage.setItem("role", newRole);
  };

  return (
    <UserContext.Provider
      value={{
        city,
        changeCity,
        logged,
        toggleLogged,
        username,
        role,
        changeRole,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export default UserContext;
