import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

import Header from "../components/Header";
import "../css/JobCreateForm.css";

export default function JobCreateForm() {
  const { jobId } = useParams(); // Si es edición, viene desde la ruta
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [jobDetails, setJobDetails] = useState("");
  const [requirements, setRequirements] = useState("");
  const [salary, setSalary] = useState("");
  const [isPaid, setIsPaid] = useState(true);
  const [isInternship, setIsInternship] = useState(false);
  const [isPartTime, setIsPartTime] = useState(false);
  const [deadline, setDeadline] = useState("");
  const [status, setStatus] = useState("ACTIVE");
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  // Cargar datos si es edición
  useEffect(() => {
    if (jobId && token) {
      fetch(`http://localhost:8080/api/v1/jobs/meCompany/${jobId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.json())
        .then((data) => {
          setTitle(data.title || "");
          setLocation(data.location || "");
          setDescription(data.description || "");
          setJobDetails(data.jobDetails || "");
          setRequirements(data.requirements || "");
          setSalary(data.salary || "");
          setIsPaid(data.isPaid ?? true);
          setIsInternship(data.isInternship ?? false);
          setIsPartTime(data.isPartTime ?? false);
          setDeadline(data.deadline ? new Date(data.deadline).toISOString().slice(0,16) : "");
          setStatus(data.status || "ACTIVE");
        })
        .catch(console.error);
    }
  }, [jobId, token]);

const handleSubmit = async (e) => {
  e.preventDefault();

  if (!token) {
    alert("No estás autenticado. Inicia sesión primero.");
    return;
  }

  try {
    const url = jobId
      ? `http://localhost:8080/api/v1/jobs/meCompany/${jobId}` // PUT para editar
      : "http://localhost:8080/api/v1/jobs/createJob";          // POST para crear
    const method = jobId ? "PUT" : "POST";

    // Preparar los datos
    const jobData = {
      title,
      location,
      description,
      jobDetails,
      requirements,
      salary: salary ? parseFloat(salary) : null,
      isPaid,
      isInternship,
      isPartTime,
      deadline: deadline ? new Date(deadline).toISOString() : null,
      status,
    };

    console.log("Enviando datos:", jobData); // Debug

    const res = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(jobData),
    });

    console.log("Response status:", res.status); // Debug
    console.log("Response headers:", res.headers.get("content-type")); // Debug

    // Obtener el texto de la respuesta primero
    const responseText = await res.text();
    console.log("Raw response:", responseText); // Debug

    let data;
    try {
      // Intentar parsear como JSON solo si no está vacío
      data = responseText ? JSON.parse(responseText) : {};
    } catch (parseError) {
      console.error("Error parsing JSON:", parseError);
      // Si no es JSON válido, crear un objeto de error con el texto
      data = { error: responseText || "Error desconocido del servidor" };
    }

    if (!res.ok) {
      const errorMessage = data.message || data.error || `Error ${res.status}: ${responseText}`;
      throw new Error(errorMessage);
    }

    alert(jobId ? "Trabajo actualizado ✅" : "Trabajo publicado ✅");
    navigate("/company/profile");
    
  } catch (error) {
    console.error("Error completo:", error);
    alert(`Error: ${error.message}`);
  }
};
  return (
    <>
      <Header />
      <div className="job-create-container">
       <h1>{jobId ? "Editar Trabajo" : "Publicar Trabajo"}</h1>
        <form onSubmit={handleSubmit} className="job-create-form">
          <input
            type="text"
            placeholder="Título del trabajo"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <input
            type="text"
            placeholder="Ubicación"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            required
          />

          <textarea
            placeholder="Descripción"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />

          <textarea
            placeholder="Detalles del trabajo"
            value={jobDetails}
            onChange={(e) => setJobDetails(e.target.value)}
          />

          <textarea
            placeholder="Requisitos"
            value={requirements}
            onChange={(e) => setRequirements(e.target.value)}
          />

          <input
            type="number"
            step="0.01"
            placeholder="Salario"
            value={salary}
            onChange={(e) => setSalary(e.target.value)}
          />

          <label>
            <input
              type="checkbox"
              checked={isPaid}
              onChange={(e) => setIsPaid(e.target.checked)}
            />
            Trabajo remunerado
          </label>

          <label>
            <input
              type="checkbox"
              checked={isInternship}
              onChange={(e) => setIsInternship(e.target.checked)}
            />
            Pasantía
          </label>

          <label>
            <input
              type="checkbox"
              checked={isPartTime}
              onChange={(e) => setIsPartTime(e.target.checked)}
            />
            Part-time
          </label>

          <input
            type="datetime-local"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
          />

          <select value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="ACTIVE">Activo</option>
            <option value="INACTIVE">Inactivo</option>
            <option value="CLOSED">Cerrado</option>
          </select>

          <button type="submit">Publicar</button>
        </form>
      </div>
    </>
  );
}
