import React from "react";
import { Link, NavLink } from "react-router-dom";
import { FaUserAlt, FaSearch, FaShoppingCart } from "react-icons/fa";
import logo from "../../../images/logo.png";
import "./Header.css";

const Header = () => {
  return (
    <header className="header">
      <div className="headerContainer">
        <Link to="/" className="headerLogo">
          <img src={logo} alt="MockMarket Logo" />
        </Link>

        <nav className="headerNav">
          <NavLink to="/" exact activeClassName="activeLink">Home</NavLink>
          <NavLink to="/products" activeClassName="activeLink">Products</NavLink>
          <NavLink to="/about" activeClassName="activeLink">About</NavLink>
          <NavLink to="/contact" activeClassName="activeLink">Contact</NavLink>
        </nav>

        <div className="headerIcons">
          <Link to="/search" aria-label="Search"><FaSearch /></Link>
          <Link to="/cart" aria-label="Cart"><FaShoppingCart /></Link>
          <Link to="/login" aria-label="Account"><FaUserAlt /></Link>
        </div>
      </div>
    </header>
  );
};

export default Header;