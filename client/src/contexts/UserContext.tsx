import { createContext, ReactNode, useState } from "react";
import { Roles } from "../services/auth.api";

interface IUserContext {
  city: string;
  toggleLogged: () => void;
  logged: boolean;
  changeCity: (newCity: string) => void;
  username: string;
  role: string;
  setRole: (newRole: Roles) => void;
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
  const storedRole = (localStorage.getItem("role") as Roles) || Roles;
  const [role, setRole] = useState<Roles>(storedRole);

  return (
    <UserContext.Provider
      value={{
        city,
        changeCity,
        logged,
        toggleLogged,
        username,
        role,
        setRole,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export default UserContext;
