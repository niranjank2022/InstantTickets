import { createContext, ReactNode, useState } from "react";

interface IUserContext {
  city: string;
  toggleLogged: () => void;
  logged: boolean;
  changeCity: (newCity: string) => void;
  username: string;
}

const UserContext = createContext<IUserContext | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const storedLogged = JSON.parse(localStorage.getItem("logged") || "false");
  const [logged, setLogged] = useState<boolean>(storedLogged);
  const toggleLogged = () => {
    setLogged(!logged);
    localStorage.setItem("logged", JSON.stringify(logged));
  };

  const storedCity = localStorage.getItem("city") || "Chennai";
  const [city, setCity] = useState<string>(storedCity);
  const changeCity = (newCity: string) => {
    setCity(newCity);
    localStorage.setItem("city", newCity);
  };

  const username = "Guest";

  return (
    <UserContext.Provider
      value={{ city, changeCity, logged, toggleLogged, username }}
    >
      {children}
    </UserContext.Provider>
  );
}

export default UserContext;
