import { useContext } from "react";
import UserContext from "../../contexts/UserContext";

export default function CityDropdown() {
  const userContext = useContext(UserContext);
  if (!userContext) {
    throw new Error("Error: CityDropdown must be used within a UserProvider!");
  }

  const { city, changeCity } = userContext;
  const cities = [
    "Chennai",
    "Mumbai",
    "Bengaluru",
    "Kolkatta",
    "New Delhi",
    "Kochi",
    "Hyderabad",
  ];

  return (
    <>
      <div className="dropdown">
        <button
          className="btn dropdown-toggle"
          type="button"
          data-bs-toggle="dropdown"
        >
          {city}
        </button>
        <ul className="dropdown-menu">
          {cities.map((_city, i) => (
            <li key={i}>
              <button
                className="dropdown-item"
                onClick={() => changeCity(_city)}
              >
                {_city}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
