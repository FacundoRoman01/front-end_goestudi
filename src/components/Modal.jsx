import React from "react";
import { X, MapPin, Clock, DollarSign, Briefcase } from "lucide-react";
import "../css/Modal.css";

export default function Modal({ job, isOpen, onClose, onApply, onSave }) {
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
          <button
            onClick={onClose}
            className="job-modal-close-button"
            aria-label="Cerrar modal"
          >
            <X size={24} />
          </button>
        </div>

        {/* Key Details Section */}
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
          {/* {job.salary && (
            <div className="job-modal-salary">
              <strong>Salario: </strong>
              {job.salary}
            </div>
          )} */}
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
              {job.requirements.split("\n").map((req, index) => (
                <p key={index} className="job-modal-requirement-item">
                  {req}
                </p>
              ))}
            </div>
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
            <button
              onClick={onSave}
              className="job-modal-button job-modal-button-secondary"
            >
              Guardar
            </button>
            <button
              onClick={onApply}
              className="job-modal-button job-modal-button-primary"
            >
              Aplicar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
