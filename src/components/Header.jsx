// src/components/Header.jsx
import React, { useState } from "react";
import { Menu, X, Briefcase } from "lucide-react";
import "../css/Header.css";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="header">
      <div className="header-container">
        {/* Logo */}
        <div className="logo">
          <Briefcase className="logo-icon" />
          <span className="logo-text">GoEstudi</span>
        </div>

        {/* Desktop Navigation */}
        <nav className="desktop-nav">
          <a href="#empleos" className="nav-link">
            Empleos
          </a>
          <a href="#companias" className="nav-link">
            Compañías
          </a>
          <a href="#candidatos" className="nav-link">
            Candidatos
          </a>
        </nav>

        {/* Desktop Action Buttons */}
        <div className="desktop-actions">
          {/* <button className="upload-cv-btn">Subir CV</button> */}
          <button className="login-btn bg-transparent">Login</button>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="mobile-menu-btn"
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Navigation */}
      <div className={`mobile-nav ${isMenuOpen ? "mobile-nav-open" : ""}`}>
        <div className="mobile-nav-content">
          <a href="#empleos" className="mobile-nav-link" onClick={toggleMenu}>
            Empleos
          </a>
          <a href="#companias" className="mobile-nav-link" onClick={toggleMenu}>
            Compañías
          </a>
          <a href="#candidatos" className="mobile-nav-link" onClick={toggleMenu}>
            Candidatos
          </a>
          <div className="mobile-actions">
            {/* <button className="mobile-btn" onClick={toggleMenu}>
              Subir CV
            </button> */}
            <button
              className="mobile-btn bg-transparent"
              onClick={toggleMenu}
            >
              Login
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
