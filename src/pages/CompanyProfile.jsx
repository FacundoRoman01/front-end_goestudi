import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import Header from "../components/Header.jsx"
import "../css/CompanyProfile.css"

export default function CompanyProfile() {
  const [profile, setProfile] = useState(null)
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState("")
  const navigate = useNavigate()
  const token = localStorage.getItem("token")

  useEffect(() => {
    if (!token) return navigate("/auth")

    const fetchProfile = async () => {
      setLoading(true)
      try {
        const res = await fetch("http://localhost:8080/api/v1/company-profiles/meCompany", {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (res.status === 404) {
          setProfile({
            name: "",
            description: "",
            location: "",
            website: "",
            industry: "",
            logoUrl: "",
            employeeCount: "",
            foundedYear: "",
            jobs: [],
          })
          setIsEditing(true)
          return
        }
        if (!res.ok) throw new Error("Error al cargar el perfil")
        const data = await res.json()
        setProfile(data)
        setIsEditing(data.isProfileComplete === false)
      // eslint-disable-next-line no-unused-vars
      } catch (err) {
        setMessage("Error al cargar el perfil de la empresa.")
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [token, navigate])

  const handleChange = (e) => {
    const { name, value } = e.target
    setProfile({ ...profile, [name]: value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setMessage("")

    try {
      const res = await fetch("http://localhost:8080/api/v1/company-profiles/meCompany", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(profile),
      })

      if (!res.ok) throw new Error("Error al guardar el perfil.")
      const updatedProfile = await res.json()
      setProfile(updatedProfile)
      setIsEditing(false)
      setMessage("¡Perfil guardado correctamente!")
    } catch (error) {
      setMessage(error.message)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("role")
    navigate("/auth")
  }

  if (loading) return <div className="loading-state">Cargando perfil...</div>

  return (
    <>
      <Header />
      <div className="company-dashboard">
        {/* Sidebar */}
        <div className="company-sidebar">
          <img
            className="company-logo"
            src={profile.logoUrl || "https://placehold.co/150x150/e2e8f0/fff?text=Logo"}
            alt="Logo de la empresa"
          />
          <h2 className="company-name">{profile.name}</h2>
          <p className="company-location">{profile.location}</p>

          <div className="sidebar-actions">
            <button
              className={`toggle-button ${!isEditing ? "active" : ""}`}
              onClick={() => setIsEditing(false)}
            >
              Ver Perfil
            </button>
            <button
              className={`toggle-button ${isEditing ? "active" : ""}`}
              onClick={() => setIsEditing(true)}
            >
              Editar Perfil
            </button>
            <button className="toggle-button" onClick={() => navigate("/company/job/new")}>
              Publicar trabajo
            </button>
            <button className="logout-button" onClick={handleLogout}>
              Cerrar sesión
            </button>
          </div>
        </div>

        {/* Contenido principal */}
        <div className="company-content">
          {message && <div className="status-message">{message}</div>}

          {!isEditing ? (
            <div className="company-view">
              <section className="card-about">
                <h3>Acerca de la empresa</h3>
                <p>{profile.description}</p>
              </section>

              <section className="card-details">
                <p><strong>Industria:</strong> {profile.industry}</p>
                <p><strong>Tamaño:</strong> {profile.employeeCount}</p>
                <p><strong>Año de fundación:</strong> {profile.foundedYear}</p>
                {profile.website && (
                  <p>
                    <strong>Sitio web:</strong>{" "}
                    <a href={profile.website} target="_blank" rel="noopener noreferrer">
                      {profile.website}
                    </a>
                  </p>
                )}
              </section>

              {/* Trabajos publicados */}
              <section className="company-jobs-section">
                <h3>Trabajos publicados</h3>
                {profile.jobs && profile.jobs.length > 0 ? (
                  profile.jobs.map((job) => (
                    <div key={job.id} className="company-job-card">
                      <h4 className="company-job-title">{job.title}</h4>
                      <p><strong>Ubicación:</strong> {job.location}</p>
                      <p className="company-job-description">{job.description}</p>
                      <p><strong>Salario:</strong> {job.salary}</p>
                      <p><strong>Estado:</strong> {job.status}</p>

                      {/* Botones de acción */}
                      <div className="job-card-actions">
                        <button
                          className="edit-job-button"
                          onClick={() => navigate(`/company/job/edit/${job.id}`)}
                        >
                          Editar
                        </button>
                        <button
                          className="delete-job-button"
                          onClick={async () => {
                            if (!window.confirm("¿Estás seguro de eliminar este trabajo?")) return;

                            try {
                              const res = await fetch(`http://localhost:8080/api/v1/jobs/meCompany/${job.id}`, {
                                method: "DELETE",
                                headers: { Authorization: `Bearer ${token}` },
                              });

                              // Mejorar manejo de errores
                              if (!res.ok) {
                                const errorText = await res.text();
                                let errorMessage = "Error al eliminar el trabajo";
                                try {
                                  const errorData = JSON.parse(errorText);
                                  errorMessage = errorData.error || errorMessage;
                                } catch {
                                  errorMessage = `Error ${res.status}: ${errorText}`;
                                }
                                throw new Error(errorMessage);
                              }
                              
                              // Actualizamos la lista de trabajos en el estado
                              setProfile({
                                ...profile,
                                jobs: profile.jobs.filter((j) => j.id !== job.id),
                              });
                              
                              alert("Trabajo eliminado correctamente");
                              
                            } catch (error) {
                              console.error("Error al eliminar:", error);
                              alert(`Error: ${error.message}`);
                            }
                          }}
                        >
                          Eliminar
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <p>No hay trabajos publicados aún.</p>
                )}
              </section>

            </div>
          ) : (
            <div className="company-edit">
              <form className="edit-form" onSubmit={handleSubmit}>
                <div className="form-field">
                  <label>Nombre de la empresa</label>
                  <input name="name" value={profile.name} onChange={handleChange} required />
                </div>

                <div className="form-field">
                  <label>Ubicación</label>
                  <input name="location" value={profile.location} onChange={handleChange} required />
                </div>

                <div className="form-field">
                  <label>Industria</label>
                  <input name="industry" value={profile.industry} onChange={handleChange} />
                </div>

                <div className="form-field">
                  <label>Descripción</label>
                  <textarea name="description" value={profile.description} onChange={handleChange} />
                </div>

                <div className="form-field">
                  <label>Sitio web</label>
                  <input type="url" name="website" value={profile.website} onChange={handleChange} />
                </div>

                <div className="form-field">
                  <label>Logo URL</label>
                  <input type="url" name="logoUrl" value={profile.logoUrl} onChange={handleChange} />
                </div>

                <div className="form-field">
                  <label>Tamaño de la empresa</label>
                  <input name="employeeCount" value={profile.employeeCount} onChange={handleChange} />
                </div>

                <div className="form-field">
                  <label>Año de fundación</label>
                  <input type="number" name="foundedYear" value={profile.foundedYear} onChange={handleChange} />
                </div>

                <button type="submit" className="save-button">Guardar Cambios</button>
              </form>
            </div>
          )}
        </div>
      </div>
    </>
  )
}