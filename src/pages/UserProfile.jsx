// src/pages/UserProfile.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function UserProfile() {
  const [profile, setProfile] = useState({
    fullName: "",
    description: "",
    location: "",
    education: "",
    skills: "",
    profilePictureUrl: "",
    cvUrl: "",
  });

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      navigate("/auth");
      return;
    }

    const fetchProfile = async () => {
      try {
        const res = await fetch("http://localhost:8080/api/v1/profiles/user", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) throw new Error("No se pudo cargar el perfil");

        const data = await res.json();
        setProfile({
          fullName: data.fullName || "",
          description: data.description || "",
          location: data.location || "",
          education: data.education || "",
          skills: data.skills || "",
          profilePictureUrl: data.profilePictureUrl || "",
          cvUrl: data.cvUrl || "",
        });
      } catch (err) {
        console.error(err);
        // Si no hay perfil, dejamos el formulario vacío
      }
    };

    fetchProfile();
  }, [token, navigate]);

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:8080/api/v1/profiles/user", {
        method: "POST", // PUT si tu backend soporta actualizar
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(profile),
      });

      if (!res.ok) throw new Error("Error al guardar el perfil");

      alert("Perfil guardado correctamente");
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };

  return (
    <div className="profile-container">
      <h1>Mi Perfil</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="fullName"
          placeholder="Nombre completo"
          value={profile.fullName}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="location"
          placeholder="Ubicación"
          value={profile.location}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="education"
          placeholder="Educación"
          value={profile.education}
          onChange={handleChange}
          required
        />
        <textarea
          name="description"
          placeholder="Descripción"
          value={profile.description}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="skills"
          placeholder="Habilidades (separadas por comas)"
          value={profile.skills}
          onChange={handleChange}
        />
        <input
          type="url"
          name="profilePictureUrl"
          placeholder="URL de foto de perfil"
          value={profile.profilePictureUrl}
          onChange={handleChange}
        />
        <input
          type="url"
          name="cvUrl"
          placeholder="URL de CV"
          value={profile.cvUrl}
          onChange={handleChange}
        />
        <button type="submit">Guardar Perfil</button>
      </form>
    </div>
  );
}
