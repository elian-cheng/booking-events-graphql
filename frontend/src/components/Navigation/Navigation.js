import React, { useContext } from "react";
import { NavLink } from "react-router-dom";
import authContext from "../../context/authContext";

import "./Navigation.css";

const Navigation = props => {
  const authCtx = useContext(authContext);

  return (
    <header className="main-navigation">
      <div className="main-navigation__logo">
        <h1>Evently</h1>
      </div>
      <nav className="main-navigation__items">
        <ul>
          {!authCtx.token && (
            <li>
              <NavLink to="/auth">Login</NavLink>
            </li>
          )}
          <li>
            <NavLink to="/events">Events</NavLink>
          </li>
          {authCtx.token && (
            <li>
              <NavLink to="/bookings">Bookings</NavLink>
            </li>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default Navigation;
