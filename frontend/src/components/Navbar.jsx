import React from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";

const Navbar = () => {

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          My App
        </Link>
        <ul className="navbar-menu">
          <li className="navbar-item">
            <Link to="/" className="navbar-link">
              Home
            </Link>
          </li>
          <li className="navbar-item">
            <Link to="/dashboard" className="navbar-link">
              AdminDashboard
            </Link>
          </li>
          <li className="navbar-item">
            <Link to="/viewcertificate" className="navbar-link">
              View Certificate
            </Link>
          </li>



        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
