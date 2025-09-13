import React, { useState, useEffect } from "react";
import { Menu, X, Briefcase, User } from "lucide-react";
import { Link } from "react-router-dom";
import "../css/Header.css";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [userName, setUserName] = useState(null);

  useEffect(() => {
    // Al cargar el componente, verificamos si el usuario ha iniciado sesión
    const userToken = localStorage.getItem("token");
    const storedUserName = localStorage.getItem("userName"); // Asumimos que guardas el nombre del usuario en localStorage al iniciar sesión

    if (userToken && storedUserName) {
      setUserName(storedUserName);
    } else {
      setUserName(null);
    }
  }, []); // El array vacío asegura que este efecto se ejecute solo una vez al montar el componente

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userName");
    setUserName(null); // Actualiza el estado para que el componente se vuelva a renderizar
    toggleMenu(); // Opcional: cierra el menú móvil después de cerrar sesión
  };

  return (
    <header className="header">
      <div className="header-container">
        {/* Logo */}
        <div className="logo">
          <Briefcase className="logo-icon" />
          <Link to="/" className="logo-text">GoEstudi</Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="desktop-nav">
          {/* Aquí podrías agregar enlaces de navegación, como "Empleos", "Compañías", etc. */}
        </nav>

        {/* Desktop Action Buttons (Renderizado Condicional) */}
        <div className="desktop-actions">
          {/* Si el nombre de usuario existe, muestra el botón de perfil, si no, el de Login */}
          {userName ? (
            <Link to="/user/profile" className="user-profile-btn">
              <User size={31} style={{ marginRight: '8px' }} className="btn_user" />
              {/* {userName} */}
            </Link>
          ) : (
            <Link to="/auth" className="login-btn bg-transparent">Login</Link>
          )}
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

      {/* Mobile Navigation (Renderizado Condicional) */}
      <div className={`mobile-nav ${isMenuOpen ? "mobile-nav-open" : ""}`}>
        <div className="mobile-nav-content">
          {/* Contenido del menú móvil */}
          <div className="mobile-actions">
            {userName ? (
              <>
                <Link to="/user/profile" className="user-profile-btn mobile-link" onClick={toggleMenu}>
                  <User size={20} style={{ marginRight: '8px' }} />
                  {userName}
                </Link>
                <button onClick={handleLogout} className="logout-btn mobile-link">Cerrar sesión</button>
              </>
            ) : (
              <Link to="/auth" className="login-btn bg-transparent mobile-link" onClick={toggleMenu}>
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}