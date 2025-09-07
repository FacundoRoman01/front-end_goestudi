import React, { useState, useEffect } from 'react';
import Header from "../components/Header.jsx";
import SearchPage from "../components/SearchPage.jsx";
import JobCard from "../components/JobCard.jsx";
import "../css/Home.css";
import axios from 'axios';

const Home = () => {
    // El estado para guardar los trabajos obtenidos de la API
    const [jobs, setJobs] = useState([]);

    // La función que se encarga de llamar a la API
    const fetchJobs = async (keyword = '') => {
        try {
            // Realiza la petición GET a tu endpoint de Spring Boot
            const response = await axios.get("http://localhost:8080/api/v1/jobs", {
                params: { keyword: keyword }
            });
            // Actualiza el estado con la lista de trabajos recibida
            setJobs(response.data);
        } catch (error) {
            console.error("Error al obtener los trabajos:", error);
            // Puedes mostrar un mensaje de error en la UI si la llamada falla
        }
    };

    // Este hook se ejecuta solo una vez cuando el componente se monta,
    // cargando todos los trabajos iniciales.
    useEffect(() => {
        fetchJobs();
    }, []);

    return (
        <div>
            <Header />
            {/* Le pasas la función `fetchJobs` al componente del buscador */}
            <SearchPage onSearch={fetchJobs} />
            <div className="job-grid-container">
                {jobs.length > 0 ? (
                    jobs.map((job, index) => (
                        <JobCard
                            key={index} // Idealmente, usar `job.id` si la API lo devuelve
                            company={job.company}
                            location={job.location}
                            title={job.title}
                            isPaid={job.isPaid}
                            postedAgo={job.postedAgo}
                            jobDetails={job.jobDetails}
                        />
                    ))
                ) : (
                    <p>No se encontraron trabajos. Intenta buscar otro título.</p>
                )}
            </div>
        </div>
    );
};

export default Home;