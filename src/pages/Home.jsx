import React, { useState, useEffect } from 'react';
import Header from "../components/Header.jsx";
import SearchPage from "../components/SearchPage.jsx";
import JobCard from "../components/JobCard.jsx";
import LoadingSpinner from "../components/LoadingSpinner.jsx";
import InfiniteScroll from 'react-infinite-scroll-component';
import Footer from '../components/Footer.jsx';
import "../css/Home.css";
import axios from 'axios';

const Home = () => {
    const [jobs, setJobs] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(0); // Recuerda que Spring Data usa paginación basada en 0
    const [hasMore, setHasMore] = useState(true);
    const [currentFilters, setCurrentFilters] = useState({});

    // Unifica la lógica de la URL y la paginación
    const buildApiUrl = (filters, page) => {
        const params = new URLSearchParams();
        if (filters.keyword) params.append('keyword', filters.keyword);
        if (filters.location) params.append('location', filters.location);
        if (filters.isInternship !== null) params.append('isInternship', filters.isInternship);
        if (filters.isPartTime !== null) params.append('isPartTime', filters.isPartTime);
        params.append('page', page); // Añade el número de página
        params.append('size', 12); // Cambiado a 'size' para coincidir con Spring
        return `http://localhost:8080/api/v1/jobs?${params.toString()}`;
    };

    const fetchJobs = async (filters, pageToLoad = 0) => {
        setIsLoading(true);
        setError(null);

        try {
            const url = buildApiUrl(filters, pageToLoad);
            const response = await axios.get(url);

            // ¡EL CAMBIO CRÍTICO ESTÁ AQUÍ!
            // Accede a la propiedad 'content' para obtener la lista de trabajos
            const newJobs = response.data.content;

            // Si es la primera página, reemplaza los trabajos existentes. Si no, concaténalos.
            if (pageToLoad === 0) {
                setJobs(newJobs);
            } else {
                setJobs(prevJobs => [...prevJobs, ...newJobs]);
            }

            // Si el número de trabajos devueltos es menor al límite, no hay más para cargar
            if (newJobs.length < 12) {
                setHasMore(false);
            } else {
                setHasMore(true);
            }

        } catch (err) {
            console.error("Error al obtener los trabajos:", err);
            setError("Error al cargar los trabajos. Por favor, inténtelo de nuevo más tarde.");
            setJobs([]);
            setHasMore(false);
        } finally {
            setIsLoading(false);
        }
    };

    // Efecto inicial para cargar la primera página de trabajos
    useEffect(() => {
        const initialFilters = { keyword: null, location: null, isInternship: null, isPartTime: null };
        setCurrentFilters(initialFilters);
        fetchJobs(initialFilters, 0); // La primera página es 0
    }, []);

    // Esta función se llama desde SearchPage.jsx
    const handleSearch = (filters) => {
        setPage(0); // Reinicia la paginación a la página 0
        setCurrentFilters(filters);
        fetchJobs(filters, 0); // Carga la primera página con los nuevos filtros
    };

    const handleLoadMore = () => {
        const nextPage = page + 1;
        setPage(nextPage);
        fetchJobs(currentFilters, nextPage);
    };

    return (
        <div>
            <Header />
            <SearchPage onSearch={handleSearch} />
            <div className="jobs-wrapper">
                <div className="jobs-section">
                    {isLoading && page === 0 ? (
                        <LoadingSpinner />
                    ) : error ? (
                        <p className="error-message">{error}</p>
                    ) : jobs.length > 0 ? (
                        <InfiniteScroll
                            dataLength={jobs.length}
                            next={handleLoadMore}
                            hasMore={hasMore}
                            loader={<LoadingSpinner />}
                        //endMessage={<p className="end-message"><b>¡Has visto todos los trabajos!</b></p>}
                        >
                            <div className="job-grid">
                                {jobs.map((job) => (
                                    <JobCard
                                        key={job.id}
                                        id={job.id}                              // ✅ Añadido
                                        company={job.companyName}                // ✅ CORREGIDO: era job.company
                                        location={job.location}
                                        title={job.title}
                                        isPaid={job.isPaid}
                                        postedAgo={job.postedAgo}
                                        jobDetails={job.jobDetails}
                                        isInternship={job.isInternship}
                                        isPartTime={job.isPartTime}
                                        salary={job.salary}                      // ✅ Añadido
                                        description={job.description}            // ✅ Añadido
                                        status={job.status}                      // ✅ Añadido  
                                        // deadline={job.deadline}                  // ✅ Añadido
                                        requirements={job.requirements}          // ✅ Añadido
                                    />
                                ))}
                            </div>
                        </InfiniteScroll>
                    ) : (
                        !isLoading && <p className="no-results">No se encontraron trabajos. Intenta buscar otro título.</p>
                    )}
                </div>
            </div>
            <Footer />      

        </div>
    );
};

export default Home;