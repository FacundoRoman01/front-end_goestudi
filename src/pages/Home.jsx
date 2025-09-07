import React, { useState, useEffect } from 'react';
import Header from "../components/Header.jsx";
import SearchPage from "../components/SearchPage.jsx";
import JobCard from "../components/JobCard.jsx";
import LoadingSpinner from "../components/LoadingSpinner.jsx";
import "../css/Home.css";
import axios from 'axios';

const Home = () => {
    const [jobs, setJobs] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchJobs = async (filters) => {
        setIsLoading(true);
        setError(null);
        try {
            const params = new URLSearchParams();
            if (filters.keyword) params.append('keyword', filters.keyword);
            if (filters.location) params.append('location', filters.location);
            if (filters.isInternship !== null) params.append('isInternship', filters.isInternship);
            if (filters.isPartTime !== null) params.append('isPartTime', filters.isPartTime);

            const response = await axios.get(`http://localhost:8080/api/v1/jobs?${params.toString()}`);
            setJobs(response.data);
        } catch (err) {
            console.error("Error al obtener los trabajos:", err);
            setError("Error al cargar los trabajos. Por favor, inténtelo de nuevo más tarde.");
            setJobs([]);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchJobs({ keyword: null, location: null, isInternship: null, isPartTime: null });
    }, []);

    const handleSearch = (filters) => {
        fetchJobs(filters);
    };

    return (
        <div>
            <Header />
            <SearchPage onSearch={handleSearch} />
            <div className="job-grid-container">
                {isLoading ? (
                    <LoadingSpinner />
                ) : error ? (
                    <p className="error-message">{error}</p>
                ) : jobs.length > 0 ? (
                    jobs.map((job, index) => (
                        <JobCard
                            key={index}
                            company={job.company}
                            location={job.location}
                            title={job.title}
                            isPaid={job.isPaid}
                            postedAgo={job.postedAgo}
                            jobDetails={job.jobDetails}
                            isInternship={job.isInternship}
                            isPartTime={job.isPartTime}
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