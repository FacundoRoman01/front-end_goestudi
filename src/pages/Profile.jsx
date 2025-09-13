import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import Header from "../components/Header.jsx"
import "../css/Profile.css"

export default function Profile() {
  const [profile, setProfile] = useState(null)
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState("")
  const navigate = useNavigate()
  const token = localStorage.getItem("token")

  useEffect(() => {
    if (!token) return navigate("/auth")

    setLoading(true)
    fetch("http://localhost:8080/api/v1/profiles/user", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(async (res) => {
        if (res.status === 404) {
          setProfile({
            fullName: "",
            location: "",
            education: "",
            skills: "",
            description: "",
            profilePictureUrl: "",
            cvUrl: "",
          })
          setIsEditing(true)
          return null
        }
        if (!res.ok) throw new Error("Error al cargar el perfil.")
        return res.json()
      })
      .then((data) => {
        if (data) {
          setProfile(data)
          setIsEditing(data.isProfileComplete === false)
        }
      })
      .catch(() => setMessage("Error al cargar el perfil."))
      .finally(() => setLoading(false))
  }, [token, navigate])

  const handleChange = (e) => {
    const { name, value } = e.target
    setProfile({ ...profile, [name]: value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setMessage("")

    try {
      const res = await fetch("http://localhost:8080/api/v1/profiles/user", {
        method: isEditing ? "POST" : "PUT",
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
      <div className="profile-dashboard">
        {/* Sidebar */}
        <div className="profile-sidebar">
          <img
            className="profile-avatar"
            src={profile.profilePictureUrl || "https://placehold.co/150x150/e2e8f0/fff?text=Perfil"}
            alt="Foto de perfil"
          />
          <h2 className="profile-name">{profile.fullName}</h2>
          <p className="profile-location">{profile.location}</p>

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
            <button className="logout-button" onClick={handleLogout}>
              Cerrar sesión
            </button>
          </div>
        </div>

        {/* Info Hub */}
        <div className="profile-content">
          {message && <div className="status-message">{message}</div>}

          {!isEditing ? (
            <div className="profile-view">
              <section className="card-about">
                <h3>Acerca de Mí</h3>
                <p>{profile.description}</p>
              </section>

              <section className="card-education">
                <h3>Educación</h3>
                <p>{profile.education}</p>
              </section>

              <section className="card-skills">
                <h3>Habilidades</h3>
                <div className="skills-grid">
                  {profile.skills &&
                    profile.skills.split(",").map((skill, index) => (
                      <span key={index} className="skill-chip">
                        {skill.trim()}
                      </span>
                    ))}
                </div>
              </section>
                    
              {profile.cvUrl && (
                
                <a
                  href={profile.cvUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="cv-link"
                >
                  Ver CV
                </a>
              )}
            </div>
          ) : (
            <div className="profile-edit">
              <form className="edit-form" onSubmit={handleSubmit}>
                <div className="form-field">
                  <label>Nombre completo</label>
                  <input
                    name="fullName"
                    value={profile.fullName}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-field">
                  <label>Ubicación</label>
                  <input
                    name="location"
                    value={profile.location}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-field">
                  <label>Educación</label>
                  <input
                    name="education"
                    value={profile.education}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-field form-field-full">
                  <label>Descripción</label>
                  <textarea
                    name="description"
                    value={profile.description}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-field">
                  <label>Habilidades (separadas por comas)</label>
                  <input
                    name="skills"
                    placeholder="Ej: Java, React, SQL"
                    value={profile.skills}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-field">
                  <label>URL de la foto de perfil</label>
                  <input
                    type="url"
                    name="profilePictureUrl"
                    value={profile.profilePictureUrl}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-field">
                  <label>URL del CV</label>
                  <input
                    type="url"
                    name="cvUrl"
                    value={profile.cvUrl}
                    onChange={handleChange}
                  />
                </div>

                <button type="submit" className="save-button">
                  Guardar Cambios
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
