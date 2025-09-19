import { useState, useEffect } from "react";
import { X, MapPin, Clock, DollarSign, Briefcase } from "lucide-react";
import "../css/Modal.css";

export default function Modal({ 
  job, 
  isOpen, 
  onClose, 
  onApply, 
  onSave, 
  isApplicationView = false, 
  appliedCoverLetter = "" 
}) {
  // 🔹 Guardamos la cover letter en localStorage usando el ID del trabajo
  const [coverLetter, setCoverLetter] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (isApplicationView && appliedCoverLetter) {
        // Si estamos viendo una postulación, mostramos la cover letter enviada
        setCoverLetter(appliedCoverLetter);
      } else {
        // Comportamiento normal: cargar desde localStorage
        const savedLetter = localStorage.getItem(`coverLetter_${job.id}`) || "";
        setCoverLetter(savedLetter);
      }
    }
  }, [isOpen, job.id, isApplicationView, appliedCoverLetter]);

  const handleCoverLetterChange = (e) => {
    if (isApplicationView) return; // No permitir edición en vista de postulación
    
    const value = e.target.value;
    setCoverLetter(value);
    localStorage.setItem(`coverLetter_${job.id}`, value); // 🔹 Guardamos en localStorage mientras se escribe
  };

  const handleApplyClick = async () => {
    if (!onApply || isApplicationView) return;
    setLoading(true);
    await onApply(coverLetter);
    setLoading(false);
    localStorage.removeItem(`coverLetter_${job.id}`); // 🔹 Limpiamos localStorage después de aplicar
  };

  if (!isOpen) return null;

  return (
    <div className="job-modal-overlay" onClick={onClose}>
      <div className="job-modal-container" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="job-modal-header">
          <div className="job-modal-header-content">
            <h2 className="job-modal-title">{job.title}</h2>
            <h3 className="job-modal-company">{job.companyName}</h3>
            <div className="job-modal-location">
              <MapPin className="job-modal-location-icon" />
              <span>{job.location}</span>
            </div>
          </div>
          <button onClick={onClose} className="job-modal-close-button" aria-label="Cerrar modal">
            <X size={24} />
          </button>
        </div>

        {/* Key Details */}
        <div className="job-modal-details">
          <div className="job-modal-badges">
            {job.isPaid && (
              <div className="job-modal-badge job-modal-badge-paid">
                <DollarSign size={16} />
                <span>Trabajo Remunerado</span>
              </div>
            )}
            {job.isInternship && (
              <div className="job-modal-badge job-modal-badge-internship">
                <Briefcase size={16} />
                <span>Pasantía</span>
              </div>
            )}
            {job.isPartTime && (
              <div className="job-modal-badge job-modal-badge-part-time">
                <Clock size={16} />
                <span>Tiempo Parcial</span>
              </div>
            )}
          </div>
        </div>

        {/* Main Content */}
        <div className="job-modal-content">
          <div className="job-modal-section">
            <h4 className="job-modal-section-title">Descripción del trabajo</h4>
            <p className="job-modal-section-text">{job.description}</p>
          </div>

          <div className="job-modal-section">
            <h4 className="job-modal-section-title">Detalles del puesto</h4>
            <p className="job-modal-section-text">{job.jobDetails}</p>
          </div>

          <div className="job-modal-section">
            <h4 className="job-modal-section-title">Requisitos</h4>
            <div className="job-modal-requirements">
              {job.requirements && job.requirements.split("\n").map((req, index) => (
                <p key={index} className="job-modal-requirement-item">
                  {req}
                </p>
              ))}
            </div>
          </div>

          {/* Cover Letter */}
          <div className="job-modal-section">
            <h4 className="job-modal-section-title">
              {isApplicationView ? "Carta de presentación enviada" : "Carta de presentación"}
            </h4>
            <textarea
              className={`job-modal-cover-letter ${isApplicationView ? 'read-only' : ''}`}
              value={coverLetter}
              onChange={handleCoverLetterChange}
              placeholder={isApplicationView ? "" : "Escribe tu carta de presentación..."}
              rows={5}
              readOnly={isApplicationView}
            />
            {isApplicationView && (
              <p className="cover-letter-note">
                Esta es la carta de presentación que enviaste con tu postulación.
              </p>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="job-modal-footer">
          <div className="job-modal-footer-info">
            <div className="job-modal-status">
              <span className="job-modal-status-badge">{job.status}</span>
            </div>
            <div className="job-modal-meta">
              <p className="job-modal-posted">{job.postedAgo}</p>
              <p className="job-modal-deadline">{job.deadline}</p>
            </div>
          </div>

          <div className="job-modal-actions">
            {!isApplicationView && (
              <>
                <button onClick={onSave} className="job-modal-button job-modal-button-secondary">
                  Guardar
                </button>
                <button
                  onClick={handleApplyClick}
                  className="job-modal-button job-modal-button-primary"
                  disabled={loading}
                >
                  {loading ? "Enviando..." : "Aplicar"}
                </button>
              </>
            )}
            {isApplicationView && (
              <button 
                onClick={onClose} 
                className="job-modal-button job-modal-button-primary"
              >
                Cerrar
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}