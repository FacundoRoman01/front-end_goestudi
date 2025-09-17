import { Link } from "react-router-dom";
import { X, Home, FileText, CheckCircle, Heart, Settings, LogOut, Briefcase, PlusCircle, Users } from "lucide-react";
import "../css/UserSidebar.css";

export default function UserSidebar({ isOpen, onClose, userName, userEmail, userRole, onLogout }) {
  // Función para resolver la ruta del perfil según rol
  const getProfileRoute = () => {
    if (!userRole) return "/user/profile";

    switch (userRole.toLowerCase()) {
      case "company":
        return "/company/profile";
      case "user":
        return "/user/profile";
      default:
        return "/user/profile";
    }
  };

  // Renderizar opciones según el rol
  const renderNavLinks = () => {
    if (userRole?.toLowerCase() === "company") {
      // Opciones para EMPRESA
      return (
        <>
          <Link to="/" className="sidebar-link" onClick={onClose}>
            <Home size={20} /> Inicio
          </Link>
          <Link to="/company/jobs" className="sidebar-link" onClick={onClose}>
            <Briefcase size={20} /> Mis Ofertas de Trabajo
          </Link>
          <Link to="/company/job/new" className="sidebar-link" onClick={onClose}>
            <PlusCircle size={20} /> Publicar Trabajo
          </Link>
          <Link to="/company/applications" className="sidebar-link" onClick={onClose}>
            <Users size={20} /> Candidatos
          </Link>
          <Link to={getProfileRoute()} className="sidebar-link" onClick={onClose}>
            <Settings size={20} /> Perfil de Empresa
          </Link>
        </>
      );
    } else {
      // Opciones para USUARIO/ESTUDIANTE
      return (
        <>
          <Link to="/" className="sidebar-link" onClick={onClose}>
            <Home size={20} /> Inicio
          </Link>
          <Link to="/cv" className="sidebar-link" onClick={onClose}>
            <FileText size={20} /> Mi CV
          </Link>
          <Link to="/applications" className="sidebar-link" onClick={onClose}>
            <CheckCircle size={20} /> Mis Postulaciones
          </Link>
          <Link to="/favorites" className="sidebar-link" onClick={onClose}>
            <Heart size={20} /> Mis Favoritos
          </Link>
          <Link to={getProfileRoute()} className="sidebar-link" onClick={onClose}>
            <Settings size={20} /> Mi Cuenta
          </Link>
        </>
      );
    }
  };

  return (
    <div className={`user-sidebar ${isOpen ? "open" : ""}`}>
      <div className="sidebar-header">
        <button className="close-btn" onClick={onClose}>
          <X size={24} />
        </button>
      </div>

      <div className="user-info">
        {/* <img
          src="https://via.placeholder.com/60"
          alt="User avatar"
          className="user-avatar"
        /> */}
        <h3>{userName}</h3>
        <p>{userEmail}</p>
        {/* Mostrar el tipo de cuenta */}
        <span className={`user-role-badge ${userRole?.toLowerCase()}`}>
          {userRole?.toLowerCase() === "company" ? "Empresa" : "Usuario"}
        </span>
      </div>

      <nav className="sidebar-nav">
        {renderNavLinks()}
        
        <button className="sidebar-link logout" onClick={onLogout}>
          <LogOut size={20} /> Cerrar Sesión
        </button>
      </nav>
    </div>
  );
}