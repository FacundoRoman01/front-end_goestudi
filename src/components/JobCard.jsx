import { useState } from 'react';
import { FaMoneyBillAlt, FaBookmark, FaRegBookmark } from 'react-icons/fa';
import toast from 'react-hot-toast';
import Modal from '../components/Modal.jsx';
import '../css/JobCard.css';

const JobCard = ({ id, company, location, title, isPaid, jobDetails, isInternship, isPartTime, postedAgo, salary, description, status, deadline, requirements }) => {
    const [isSaved, setIsSaved] = useState(false);
    const [showModal, setShowModal] = useState(false);

    const handleSaveClick = (e) => {
        e.stopPropagation();
        const newSavedState = !isSaved;
        setIsSaved(newSavedState);

        if (newSavedState) {
            toast.success(`Trabajo "${title}" guardado exitosamente`, {
                className: 'toast-success',
                icon: '💾',
            });
        } else {
            toast(`Trabajo "${title}" removido de guardados`, {
                className: 'toast-error',
                icon: '🗑️',
            });
        }
    };

    const handleCardClick = () => setShowModal(true);
    const handleCloseModal = () => setShowModal(false);

    // Función para aplicar al trabajo
    const handleApply = async (coverLetter) => {
        // Mostrar toast de carga
        const loadingToast = toast.loading('Enviando postulación...', {
            className: 'toast-loading',
        });

        try {
            const token = localStorage.getItem("token");

            const response = await fetch("http://localhost:8080/api/applications/apply", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    jobId: id,
                    coverLetter: coverLetter,
                }),
            });

            if (!response.ok) throw new Error("Error al postular");

            toast.success(`¡Postulación enviada con éxito a ${title}!`, {
                id: loadingToast,
                className: 'toast-success',
                icon: '🎉',
            });

            setShowModal(false);
        } catch (error) {
            console.error(error);

            // Reemplazar el toast de carga con uno de error
            toast.error("No se pudo enviar la postulación. Inténtalo de nuevo.", {
                id: loadingToast,
                className: 'toast-error',
                icon: '❌',
            });
        }
    };

    return (
        <div className="job-card" onClick={handleCardClick}>
            <div className="job-header">
                <div className="company-logo_cards">
                    <div className="logo-placeholder"></div>
                </div>
                <div className="company-info">
                    <h3 className="company-name_card">{company}</h3>
                    <p className="company-location">{location}</p>
                </div>
                <div className="job-type-badges">
                    {isInternship && <span className="badge internship-badge">Pasantía</span>}
                    {isPartTime && <span className="badge parttime-badge">Part-Time</span>}
                </div>
            </div>

            <div className="job-body">
                <h2 className="job-title">{title}</h2>
                {isPaid && (
                    <div className="job-details">
                        <div className="salary-info">
                            <FaMoneyBillAlt />
                            <span>Trabajo remunerado</span>
                        </div>
                    </div>
                )}
            </div>

            <div className="job-footer">
                <button className={`btn btn-save ${isSaved ? 'saved' : ''}`} onClick={handleSaveClick}>
                    {isSaved ? <FaBookmark /> : <FaRegBookmark />}
                    <span>{isSaved ? 'Guardado' : 'Guardar'}</span>
                </button>
                <button className="btn btn-apply" onClick={(e) => { e.stopPropagation(); setShowModal(true); }}>
                    Detalle
                </button>
            </div>

            <Modal
                job={{
                    id,
                    companyName: company,
                    location,
                    title,
                    isPaid,
                    isInternship,
                    isPartTime,
                    salary,
                    description,
                    jobDetails,
                    status,
                    postedAgo,
                    deadline,
                    requirements: requirements || "No se especificaron requisitos"
                }}
                isOpen={showModal}
                onClose={handleCloseModal}
                onApply={handleApply} // sigue siendo la función de envío al backend
                onSave={() => setIsSaved(true)}
            />
        </div>
    );
};

export default JobCard;