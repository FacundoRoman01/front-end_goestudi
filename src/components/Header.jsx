import React, { useState, useEffect } from "react";
import { Menu, X, Briefcase, User } from "lucide-react";
import { Link } from "react-router-dom";
import UserSidebar from "./UserSidebar"; // ✅ Importar
import "../css/Header.css";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // ✅ Estado del sidebar
  const [userName, setUserName] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [userEmail, setUserEmail] = useState(null); // ✅ Email del usuario

  useEffect(() => {
    const userToken = localStorage.getItem("token");
    const storedUserName = localStorage.getItem("userName");
    const storedUserRole = localStorage.getItem("role");
    const storedUserEmail = localStorage.getItem("userEmail"); // ✅ Obtener email

    if (userToken && storedUserName && storedUserRole) {
      setUserName(storedUserName);
      setUserRole(storedUserRole);
      setUserEmail(storedUserEmail || ""); // ✅ Setear email
    } else {
      setUserName(null);
      setUserRole(null);
      setUserEmail(null);
    }
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleSidebar = () => { // ✅ Función para abrir/cerrar sidebar
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userName");
    localStorage.removeItem("role");
    localStorage.removeItem("userEmail");
    setUserName(null);
    setUserRole(null);
    setUserEmail(null);
    setIsSidebarOpen(false); // ✅ Cerrar sidebar al logout
    toggleMenu();
  };

  return (
    <>
      <header className="header">
        <div className="header-container">
          <div className="logo">
            <Briefcase className="logo-icon" />
            <Link to="/" className="logo-text">GOestudi</Link>
          </div>

          <nav className="desktop-nav">
          </nav>

          <div className="desktop-actions">
            {userName ? (
              <button onClick={toggleSidebar} className="user-profile-btn"> {/* ✅ Cambiar a button */}
                <User size={31} style={{ marginRight: '8px' }} className="btn_user" />
              </button>
            ) : (
              <Link to="/auth" className="login-btn bg-transparent">Login</Link>
            )}
          </div>

          <button
            className="mobile-menu-btn"
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        <div className={`mobile-nav ${isMenuOpen ? "mobile-nav-open" : ""}`}>
          <div className="mobile-nav-content">
            <div className="mobile-actions">
              {userName ? (
                <>
                  <button onClick={toggleSidebar} className="user-profile-btn mobile-link"> {/* ✅ Cambiar a button */}
                    <User size={20} style={{ marginRight: '8px' }} />
                    {userName}
                  </button>
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

      {/* ✅ Renderizar el sidebar */}
      {userName && (
        <UserSidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          userName={userName}
          userEmail={userEmail}
          userRole={userRole}
          onLogout={handleLogout}
        />
      )}
    </>
  );
}