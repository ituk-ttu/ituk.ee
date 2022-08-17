import React, { useState } from "react";
import { Link } from "react-scroll";
import { FaBars, FaTimes } from "react-icons/fa";
import logo from "./images/ituk.logo.long.white.png";

import "./Navbar.css";

const Navbar = () => {
  const [click, setClick] = useState(false);
  const handleClick = () => setClick(!click);

  const closeMenu = () => setClick(false);

  return (
    <div className="header">
      <nav className="navbar">
        <li className="nav-logo">
          <Link
            to="hero"
            spy={true}
            smooth={true}
            offset={-50}
            duration={800}
            onClick={closeMenu}
          >
            <a href="/" className="logo">
              <img src={logo} alt="logo" />
            </a>
          </Link>
        </li>
        <div className="hamburger" onClick={handleClick}>
          {click ? (
            <FaTimes size={30} style={{ color: "#ffffff" }} />
          ) : (
            <FaBars size={30} style={{ color: "#ffffff" }} />
          )}
        </div>
        <ul className={click ? "nav-menu active" : "nav-menu"}>
          <li className="nav-item">
            <Link
              to="about"
              spy={true}
              smooth={true}
              offset={-50}
              duration={800}
              onClick={closeMenu}
            >
              Meist
            </Link>
          </li>
          <li className="nav-item">
            <Link
              to="yritused"
              spy={true}
              smooth={true}
              offset={-90}
              duration={800}
              onClick={closeMenu}
            >
              Üritused
            </Link>
          </li>

          <li className="nav-item">
            <Link
              to="juhatus"
              spy={true}
              smooth={true}
              offset={-85}
              duration={800}
              onClick={closeMenu}
            >
              Juhatus
            </Link>
          </li>
          <li className="nav-item">
            <Link
              to="kontakt"
              spy={true}
              smooth={true}
              offset={-90}
              duration={800}
              onClick={closeMenu}
            >
              Kontakt
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Navbar;
