// src/pages/CandidatesApplication.jsx
import { useState, useEffect } from 'react';
import { Calendar, User, MapPin, Eye, Loader } from 'lucide-react';
import Modal from '../components/Modal.jsx';
import "../css/UserApplications.css"; 
import Header from '../components/Header.jsx';

const CandidatesApplication = () => {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedApplication, setSelectedApplication] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [filter, setFilter] = useState('all');

    useEffect(() => {
        fetchCandidatesApplications();
    }, []);

    const fetchCandidatesApplications = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await fetch("http://localhost:8080/api/applications/company/candidates", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });
            if (!response.ok) throw new Error("Error al cargar los candidatos");
            const data = await response.json();
            setApplications(data);
        } catch (error) {
            console.error("Error fetching candidates:", error);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const getStatusClass = (status) => {
        switch (status?.toUpperCase()) {
            case 'PENDING': return 'ua-status-pending';
            case 'ACCEPTED': return 'ua-status-accepted';
            case 'REJECTED': return 'ua-status-rejected';
            case 'REVIEWED': return 'ua-status-review';
            default: return 'ua-status-pending';
        }
    };

    const getStatusText = (status) => {
        switch (status?.toUpperCase()) {
            case 'PENDING': return 'Pendiente';
            case 'ACCEPTED': return 'Aceptado';
            case 'REJECTED': return 'Rechazado';
            case 'REVIEWED': return 'En Revisión';
            default: return 'Pendiente';
        }
    };

    const filteredApplications = applications.filter(app => filter === 'all' ? true : app.status?.toUpperCase() === filter.toUpperCase());

    const handleViewDetails = (application) => {
        setSelectedApplication(application);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedApplication(null);
    };

    if (loading) return (
        <div className="ua-container">
            <div className="ua-loader">
                <Loader className="ua-spin" />
                <p>Cargando candidatos...</p>
            </div>
        </div>
    );

    if (error) return (
        <div className="ua-container">
            <div className="ua-error-box">
                <p>Error: {error}</p>
                <button className="ua-button ua-button-red" onClick={fetchCandidatesApplications}>Reintentar</button>
            </div>
        </div>
    );

    return (
        <>
        <Header />
        <div className="ua-container">
            <div className="ua-header">
                <h1>Candidatos a mis trabajos</h1>
                <p>Revisa las postulaciones de los candidatos a tus ofertas</p>
            </div>

            <div className="ua-filters">
                {['all', 'pending', 'accepted', 'rejected'].map(f => (
                    <button
                        key={f}
                        className={`ua-button ${filter === f ? 'ua-button-active' : ''}`}
                        onClick={() => setFilter(f)}
                    >
                        {f === 'all' ? `Todas (${applications.length})` :
                         f === 'pending' ? `Pendientes (${applications.filter(a => a.status?.toUpperCase() === 'PENDING').length})` :
                         f === 'accepted' ? `Aceptadas (${applications.filter(a => a.status?.toUpperCase() === 'ACCEPTED').length})` :
                         `Rechazadas (${applications.filter(a => a.status?.toUpperCase() === 'REJECTED').length})`}
                    </button>
                ))}
            </div>

            <div className="ua-list">
                {filteredApplications.length === 0 ? (
                    <div className="ua-empty">
                        <p>No tienes candidatos {filter !== 'all' && `con estado "${getStatusText(filter)}"`}</p>
                    </div>
                ) : (
                    filteredApplications.map(app => (
                        <div key={app.id} className="ua-card">
                            <div className="ua-card-header">
                                <div className="ua-card-info">
                                    <h3>{app.job?.title || 'Título no disponible'}</h3>
                                    <div className="ua-card-company">
                                        <User /> {app.candidate?.fullName || 'Candidato sin nombre'}
                                    </div>
                                    <div className="ua-card-details">
                                        <span><MapPin /> {app.job?.location || 'Ubicación no disponible'}</span>
                                        <span><Calendar /> {new Date(app.appliedAt || app.createdAt).toLocaleDateString('es-ES')}</span>
                                    </div>
                                </div>
                                <div className="ua-card-actions">
                                    <span className={`ua-status ${getStatusClass(app.status)}`}>{getStatusText(app.status)}</span>
                                    <button className="ua-button ua-button-blue" onClick={() => handleViewDetails(app)}><Eye /> Ver Detalles</button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {selectedApplication && (
                <Modal
                    job={{
                        id: selectedApplication.job?.id,
                        title: selectedApplication.job?.title || 'Título no disponible',
                        location: selectedApplication.job?.location || 'Ubicación no disponible',
                        description: selectedApplication.job?.description || 'Descripción no disponible',
                        requirements: selectedApplication.job?.requirements || "No se especificaron requisitos",
                        status: getStatusText(selectedApplication.status)
                    }}
                    isOpen={showModal}
                    onClose={handleCloseModal}
                    onApply={null}
                    onSave={() => {}}
                    isApplicationView={true}
                    appliedCoverLetter={selectedApplication.coverLetter}
                />
            )}
        </div>
        </>
    );
};

export default CandidatesApplication;
