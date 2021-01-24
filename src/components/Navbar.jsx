import React from "react";
import { NavLink } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
      <span className="navbar-brand">Ben Open</span>

      <div className="collapse navbar-collapse" id="navbarColor01">
        <ul className="navbar-nav mr-auto">
          <li className="nav-item">
            <NavLink className="nav-link" to="/">
              Accueil
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink className="nav-link" to="/posts">
              Posts
            </NavLink>
          </li>
        </ul>
        <ul className="navbar-nav ml-auto">
          <li className="nav-item">
            <NavLink className="nav-link" to="/login">
              Se connecter
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink className="nav-link" to="/register">
              S'enregistrer
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink className="nav-link" to="/account">
              Mon compte
            </NavLink>
          </li>
          <li className="nav-item">
            <button className="btn btn-danger">Déconnexion</button>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
