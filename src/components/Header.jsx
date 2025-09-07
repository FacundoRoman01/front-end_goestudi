
import "../css/Header.css";

const Header = () => {
  return (
    <header className="header">
      <div className="logo">Goestudi</div>
      <nav className="nav">
        <ul>
          <li><a href="#">Inicio</a></li>
          <li><a href="#">Empleos</a></li>
          <li><a href="#">Empresas</a></li>
          <li><a href="#">Contacto</a></li>
        </ul>
      </nav>
      <button className="btn-login">Iniciar Sesión</button>
    </header>
  );
};

export default Header;
