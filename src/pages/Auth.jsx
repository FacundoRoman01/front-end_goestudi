// src/pages/Auth.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import "../css/auth.css";

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [accountType, setAccountType] = useState("USER");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const role = localStorage.getItem("role");
      if (role === "COMPANY") {
        navigate("/company/profile");
      } else {
        navigate("/user/profile");
      }
    }
  }, [navigate]);

 const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    if (isLogin) {
      // 🔑 LOGIN
      const res = await fetch("http://localhost:8080/api/v1/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error al iniciar sesión");

      // Guardar en localStorage
      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.role);
      localStorage.setItem("userName", data.username); // 👈 tu backend devuelve "username"

      // Redirigir según rol
      if (data.role === "COMPANY") {
        navigate("/company/profile");
      } else {
        navigate("/user/profile");
      }
    } else {
      // 📝 REGISTER
      const res = await fetch("http://localhost:8080/api/v1/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          password,
          username: fullName, // 👈 backend solo usa "username"
          role: accountType,  // "USER" o "COMPANY"
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error al registrarse");

      alert("Usuario registrado con éxito. Ahora inicia sesión.");
      setIsLogin(true);
    }
  } catch (error) {
    console.error(error);
    alert(error.message);
  }
};


  return (
   <>
   <Header />
    <div className="auth-container">
      <div className="auth-card">
        {/* Columna izquierda */}
        <div className="auth-left">
          <div className="auth-brand">
            <div className="brand-icon">⚡</div>
            <span className="brand-name">GOestudi</span>
          </div>
          <div className="auth-hero">
            <h2>Puedes hacerlo facilmente</h2>
            <h1>
              Encuentra tu pasantía, práctica de fin de carrera, periodo de prácticas o trabajo ideal.
            </h1>
          </div>
        </div>

        {/* Columna derecha */}
        <div className="auth-right">
          <div className="auth-form-container">
            <div className="auth-icon">✱</div>

            <h2 className="auth-title">
              {isLogin ? "Iniciar sesión" : "Crear una cuenta"}
            </h2>

            <p className="auth-subtitle">
              {isLogin
                ? "Accede a tus tareas, notas y proyectos en cualquier momento."
                : "Accede a tus tareas, notas y proyectos en cualquier lugar y mantén todo fluyendo en un solo lugar."}
            </p>

            <form onSubmit={handleSubmit} className="auth-form">
              {!isLogin && (
                <div className="user-type-selector">
                  <button
                    type="button"
                    className={`type-btn ${accountType === "USER" ? "active" : ""}`}
                    onClick={() => setAccountType("USER")}
                  >
                    Usuario
                  </button>
                  <button
                    type="button"
                    className={`type-btn ${accountType === "COMPANY" ? "active" : ""}`}
                    onClick={() => setAccountType("COMPANY")}
                  >
                    Empresa
                  </button>
                </div>
              )}

              {!isLogin && (
                <div className="form-group">
                  <label>
                    {accountType === "COMPANY"
                      ? "Nombre de la empresa"
                      : "Nombre completo"}
                  </label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder={
                      accountType === "COMPANY"
                        ? "Nombre de tu empresa"
                        : "Tu nombre completo"
                    }
                  />
                </div>
              )}

              <div className="form-group">
                <label>Correo electrónico</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ejemplo@email.com"
                />
              </div>

              <div className="form-group">
                <label>Contraseña</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                />
              </div>

              <button type="submit" className="auth-submit-btn">
                {isLogin ? "Iniciar sesión" : "Crear cuenta"}
              </button>
            </form>

           
            <p className="auth-switch">
              {isLogin ? "¿No tienes una cuenta?" : "¿Ya tienes una cuenta?"}{" "}
              <button
                type="button"
                className="switch-btn"
                onClick={() => {
                  setIsLogin(!isLogin);
                  setFullName("");
                  setEmail("");
                  setPassword("");
                  setAccountType("USER");
                }}
              >
                {isLogin ? "Registrarse" : "Iniciar sesión"}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
   
   </>
  );
}
