import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import "../css/CompanyProfileForm.css";

export default function CompanyProfileForm() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [website, setWebsite] = useState("");
  const [industry, setIndustry] = useState("");
  const [logoUrl, setLogoUrl] = useState("");
  const [employeeCount, setEmployeeCount] = useState("");
  const [foundedYear, setFoundedYear] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/auth");
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const token = localStorage.getItem("token");
    if (!token) {
      alert("No estás autenticado. Inicia sesión primero.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("http://localhost:8080/api/v1/company-profiles/meCompany", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name,
          description,
          location,
          website,
          industry,
          logoUrl,
          employeeCount,
          foundedYear: foundedYear ? parseInt(foundedYear, 10) : null,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error al crear el perfil de empresa");

      alert("Perfil de empresa creado con éxito ✅");
      navigate("/company/profile"); // Redirige automáticamente al perfil
    } catch (error) {
      console.error(error);
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />
      <div className="company-profile-container">
        <h1>Crear Perfil de Empresa</h1>
        <form onSubmit={handleSubmit} className="company-profile-form">
          <input type="text" placeholder="Nombre de la empresa" value={name} onChange={e => setName(e.target.value)} required />
          <textarea placeholder="Descripción" value={description} onChange={e => setDescription(e.target.value)} required />
          <input type="text" placeholder="Ubicación" value={location} onChange={e => setLocation(e.target.value)} required />
          <input type="url" placeholder="Sitio web" value={website} onChange={e => setWebsite(e.target.value)} />
          <input type="text" placeholder="Industria" value={industry} onChange={e => setIndustry(e.target.value)} />
          <input type="url" placeholder="Logo URL" value={logoUrl} onChange={e => setLogoUrl(e.target.value)} />
          <input type="text" placeholder="Tamaño de la empresa" value={employeeCount} onChange={e => setEmployeeCount(e.target.value)} />
          <input type="number" placeholder="Año de fundación" value={foundedYear} onChange={e => setFoundedYear(e.target.value)} />

          <button type="submit" disabled={loading}>
            {loading ? "Guardando..." : "Guardar Perfil"}
          </button>
        </form>
      </div>
    </>
  );
}
