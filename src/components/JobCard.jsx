import { useState } from 'react';
import '../css/JobCard.css';
import { FaRegClock, FaMoneyBillAlt, FaBookmark, FaRegBookmark } from 'react-icons/fa';
import Modal from '../components/Modal.jsx';

// Añade isInternship y isPartTime a los props
const JobCard = ({ company, location, title, isPaid, jobDetails,  isInternship, isPartTime }) => {
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
        <div className="job-card">
            <div className="job-header">
                <div className="company-logo">
                    <div className="logo-placeholder"></div>
                </div>
                <div className="company-info">
                    <h3 className="company-name">{company}</h3>
                    <p className="company-location">{location}</p>
                </div>
                {/* Nueva sección para mostrar los tipos de trabajo */}
                <div className="job-type-badges">
                    {isInternship && <span className="badge internship-badge">Pasantía</span>}
                    {isPartTime && <span className="badge parttime-badge">Part-Time</span>}
                </div>
                {/* <div className="job-time">
                    <FaRegClock />
                    <span>{postedAgo}</span>
                </div> */}
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
                <button className="btn btn-apply"  onClick={handleCardClick}>Aplicar</button >
            </div>

            <Modal show={showModal} onClose={handleCloseModal}>
                <div className="modal-content-details">
                    <h3>{title}</h3>
                    <h4>{company} - {location}</h4>
                    <p>{jobDetails}</p>
                </div>
            </Modal>
        </div>
    );
};

export default JobCard;