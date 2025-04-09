import React from 'react';
import './DoctorCard.css';
import doctorImg from '../../../public/assets/doctor.svg';

const DoctorCard = ({ doctor, onDelete, onEdit }) => {
  return (
    <div className="doctor-card">
      <div className="profile-photo-container">
        <img src={doctorImg} alt={`${doctor.name}`} className="profile-photo" />
      </div>

      <div className="card-content">
        <div className="doctor-info">
          <h3 className="doctor-name">{doctor.name}</h3>
          <div className="info-row">
            <span className="label">Phone</span>
            <span className="value">{doctor.phone}</span>
          </div>
          <div className="info-row">
            <span className="label">Speciality</span>
            <span className="value">{doctor.specialty}</span>
          </div>
          <div className="info-row">
            <span className="label">Price</span>
            <span className="value">{doctor.price || "$500 / Session"}</span>
          </div>
        </div>

        <div className="split-button">
          <button
            onClick={() => onEdit(doctor)}
            className="edit-btn"
            aria-label="Edit doctor"
          >
            <span>Edit</span>
          </button>
          <button
            onClick={() => onDelete(doctor.id)}
            className="delete-btn"
            aria-label="Delete doctor"
          >
            <span>Delete</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default DoctorCard;