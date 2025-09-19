import { useState, useEffect } from 'react';
import { Calendar, Building, MapPin, Eye, Loader } from 'lucide-react';
import Modal from '../components/Modal.jsx';
import "../css/UserApplications.css";
import Header from '../components/Header.jsx';

const UserApplications = () => {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedApplication, setSelectedApplication] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [filter, setFilter] = useState('all');

    useEffect(() => {
        fetchApplications();
    }, []);

    const fetchApplications = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await fetch("http://localhost:8080/api/applications/my-applications", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });
            if (!response.ok) throw new Error("Error al cargar las postulaciones");
            const data = await response.json();
            setApplications(data);
        } catch (error) {
            console.error("Error fetching applications:", error);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const getStatusClass = (status) => {
        switch (status?.toLowerCase()) {
            case 'pending':
            case 'pendiente': return 'ua-status-pending';
            case 'accepted':
            case 'aceptado': return 'ua-status-accepted';
            case 'rejected':
            case 'rechazado': return 'ua-status-rejected';
            case 'under_review':
            case 'en_revision': return 'ua-status-review';
            default: return 'ua-status-pending';
        }
    };

    const getStatusText = (status) => {
        switch (status?.toLowerCase()) {
            case 'pending': return 'Pendiente';
            case 'accepted': return 'Aceptado';
            case 'rejected': return 'Rechazado';
            case 'under_review': return 'En Revisión';
            default: return 'Pendiente';
        }
    };

    const filteredApplications = applications.filter(app => filter === 'all' ? true : app.status?.toLowerCase() === filter);

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
                <p>Cargando postulaciones...</p>
            </div>
        </div>
    );

    if (error) return (
        <div className="ua-container">
            <div className="ua-error-box">
                <p>Error: {error}</p>
                <button className="ua-button ua-button-red" onClick={fetchApplications}>Reintentar</button>
            </div>
        </div>
    );

    return (
       <>
       <Header />
        <div className="ua-container">
            {/* Header */}
            <div className="ua-header">
                <h1>Mis Postulaciones</h1>
                <p>Gestiona y revisa el estado de tus postulaciones</p>
            </div>

            {/* Filtros */}
            <div className="ua-filters">
                {['all', 'pending', 'accepted', 'rejected'].map(f => (
                    <button
                        key={f}
                        className={`ua-button ${filter === f ? 'ua-button-active' : ''}`}
                        onClick={() => setFilter(f)}
                    >
                        {f === 'all' ? `Todas (${applications.length})` :
                         f === 'pending' ? `Pendientes (${applications.filter(a => a.status?.toLowerCase() === 'pending').length})` :
                         f === 'accepted' ? `Aceptadas (${applications.filter(a => a.status?.toLowerCase() === 'accepted').length})` :
                         `Rechazadas (${applications.filter(a => a.status?.toLowerCase() === 'rejected').length})`}
                    </button>
                ))}
            </div>

            {/* Lista de postulaciones */}
            <div className="ua-list">
                {filteredApplications.length === 0 ? (
                    <div className="ua-empty">
                        <p>No tienes postulaciones {filter !== 'all' && `con estado "${getStatusText(filter)}"`}</p>
                        <a href="/jobs" className="ua-button ua-button-blue">Explorar trabajos disponibles</a>
                    </div>
                ) : (
                    filteredApplications.map(app => (
                        <div key={app.id} className="ua-card">
                            <div className="ua-card-header">
                                <div className="ua-card-info">
                                    <h3>{app.job?.title || app.jobTitle || 'Título no disponible'}</h3>
                                    <div className="ua-card-company">
                                        <Building /> {app.job?.companyName || app.companyName || 'Empresa no disponible'}
                                    </div>
                                    <div className="ua-card-details">
                                        <span><MapPin /> {app.job?.location || 'Ubicación no disponible'}</span>
                                        <span><Calendar /> {new Date(app.appliedAt || app.createdAt).toLocaleDateString('es-ES')}</span>
                                    </div>
                                    <div className="ua-card-badges">
                                        {app.job?.isPaid && <span className="ua-badge ua-badge-green">Remunerado</span>}
                                        {app.job?.isInternship && <span className="ua-badge ua-badge-blue">Pasantía</span>}
                                        {app.job?.isPartTime && <span className="ua-badge ua-badge-purple">Tiempo Parcial</span>}
                                    </div>
                                </div>
                                <div className="ua-card-actions">
                                    <span className={`ua-status ${getStatusClass(app.status)}`}>{getStatusText(app.status)}</span>
                                    <button className="ua-button ua-button-blue" onClick={() => handleViewDetails(app)}><Eye /> Ver Detalles</button>
                                </div>
                            </div>

                            {app.coverLetter && (
                                <div className="ua-cover-letter">
                                    <h4>Carta de presentación:</h4>
                                    <p>{app.coverLetter.length > 150 ? `${app.coverLetter.substring(0,150)}...` : app.coverLetter}</p>
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>

            {selectedApplication && (
                <Modal
                    job={{
                        id: selectedApplication.job?.id,
                        companyName: selectedApplication.job?.companyName || selectedApplication.companyName || 'Empresa no disponible',
                        location: selectedApplication.job?.location || 'Ubicación no disponible',
                        title: selectedApplication.job?.title || selectedApplication.jobTitle || 'Título no disponible',
                        isPaid: selectedApplication.job?.isPaid || false,
                        isInternship: selectedApplication.job?.isInternship || false,
                        isPartTime: selectedApplication.job?.isPartTime || false,
                        salary: selectedApplication.job?.salary || '',
                        description: selectedApplication.job?.description || 'Descripción no disponible',
                        jobDetails: selectedApplication.job?.jobDetails || 'Detalles no disponibles',
                        status: getStatusText(selectedApplication.status),
                        postedAgo: selectedApplication.job?.postedAgo || '',
                        deadline: selectedApplication.job?.deadline || '',
                        requirements: selectedApplication.job?.requirements || "No se especificaron requisitos"
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

export default UserApplications;
