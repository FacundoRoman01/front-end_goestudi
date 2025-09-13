import { useState } from 'react';
import { FaMoneyBillAlt, FaBookmark, FaRegBookmark } from 'react-icons/fa';
import Modal from '../components/Modal.jsx';
import '../css/JobCard.css';

const JobCard = ({ id, company, location, title, isPaid, jobDetails, isInternship, isPartTime, postedAgo, salary, description, status, deadline }) => {
    const [isSaved, setIsSaved] = useState(false);
    const [showModal, setShowModal] = useState(false);

    const handleSaveClick = (e) => {
        e.stopPropagation();
        setIsSaved(!isSaved);
    };

    const handleCardClick = () => {
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };

    return (
        <div className="job-card" onClick={handleCardClick}>
            <div className="job-header">
                <div className="company-logo">
                    <div className="logo-placeholder"></div>
                </div>
                <div className="company-info">
                    <h3 className="company-name">{company}</h3>
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
                    Aplicar
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
                    requirements: "Requisito 1\nRequisito 2" // ⚡️ si tu API trae esto, pasalo aquí
                }}
                isOpen={showModal}
                onClose={handleCloseModal}
                onApply={() => alert(`Aplicaste al empleo ${title}`)}
                onSave={() => setIsSaved(true)}
            />
        </div>
    );
};

export default JobCard;
