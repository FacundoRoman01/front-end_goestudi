
import "../css/Footer.css";
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from "react-icons/fa";
import { FaGraduationCap, FaBuilding, FaUserFriends } from "react-icons/fa";
import { MdEmail, MdPhone, MdLocationOn } from "react-icons/md";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">

        {/* Logo + descripción */}
        <div className="footer-column">
          <h3 className="footer-logo">📘 GoEstudi</h3>
          <p className="footer-description">
            Tu plataforma de confianza para encontrar oportunidades laborales y
            pasantías que impulsen tu carrera profesional.
          </p>
          <div className="footer-socials">
            <a href="#"><FaFacebookF /></a>
            <a href="#"><FaTwitter /></a>
            <a href="#"><FaInstagram /></a>
            <a href="#"><FaLinkedinIn /></a>
          </div>
        </div>

        {/* Para estudiantes */}
        <div className="footer-column">
          <h4><FaGraduationCap className="footer-icon"/> Para Estudiantes</h4>
          <ul>
            <li><a href="#">Buscar Pasantías</a></li>
            <li><a href="#">Trabajos de Medio Tiempo</a></li>
           
           
           
          </ul>
        </div>

        {/* Para empresas */}
        <div className="footer-column">
          <h4><FaBuilding className="footer-icon"/> Para Empresas</h4>
          <ul>
            <li><a href="#">Publicar Empleos</a></li>
            <li><a href="#">Buscar Talento</a></li>
            <li><a href="#">Programas de Pasantías</a></li>
            
          
          </ul>
        </div>

        {/* Contacto */}
        <div className="footer-column">
          <h4><FaUserFriends className="footer-icon"/> Contacto</h4>
          <p><MdEmail /> soporte@goestudi.com</p>
          <p><MdPhone /> +1 (555) 123-4567</p>
         
          <button className="footer-button">Centro de Ayuda</button>
        </div>

      </div>

      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} GoEstudi. Todos los derechos reservados.</p>
      </div>
    </footer>
  );
}
