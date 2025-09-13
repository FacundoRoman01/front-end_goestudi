import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import "../css/Auth.css";

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [accountType, setAccountType] = useState("USER"); // 👈 usuario por defecto
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
        // LOGIN
        const res = await fetch("http://localhost:8080/api/v1/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Error al iniciar sesión");

        localStorage.setItem("token", data.token);
        localStorage.setItem("role", data.role);
        localStorage.setItem("userName", data.fullName);

        // Redirigir según el rol
        if (data.role === "COMPANY") {
          navigate("/company/profile");
        } else {
          navigate("/user/profile");
        }
      } else {
        // REGISTER
        const res = await fetch("http://localhost:8080/api/v1/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email,
            password,
            fullName,
            role: accountType, // 👈 depende de lo que elija
            username: email,
          }),
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Error al registrarse");

        alert("Cuenta creada con éxito. Ahora inicia sesión.");
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
        <h1>{isLogin ? "Iniciar Sesión" : "Crear Cuenta"}</h1>

        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <>
              <input
                type="text"
                placeholder={accountType === "COMPANY" ? "Nombre de la empresa" : "Nombre completo"}
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />

              {/* Selector de tipo de cuenta */}
              <select value={accountType} onChange={(e) => setAccountType(e.target.value)}>
                <option value="USER">Usuario</option>
                <option value="COMPANY">Empresa</option>
              </select>
            </>
          )}

          <input
            type="email"
            placeholder="Correo electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button type="submit">{isLogin ? "Entrar" : "Registrarse"}</button>
        </form>

        <p>
          {isLogin ? "¿No tienes cuenta?" : "¿Ya tienes cuenta?"}{" "}
          <button type="button" onClick={() => setIsLogin(!isLogin)}>
            {isLogin ? "Regístrate" : "Inicia sesión"}
          </button>
        </p>
      </div>
    </>
  );
}
