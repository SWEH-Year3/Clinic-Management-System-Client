import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../Context/AuthContext';
import './DoctorCard.css';

const DoctorCard = ({ keyID,doctor}) => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleViewDoctor = () => {
    navigate(`/view-doctor/${doctor.doctorId}`, { state: { doctor } });
  };

  const handleChatWithDoctor = () => {
    navigate(`/chat/${doctor.name}/${doctor.doctorId}`);
  };

  const renderActions = () => {
    switch(user?.role) {
      case 'admin':
        return (
          <div className="split-button">
            <button onClick={handleViewDoctor} className="view-btn">
              <span>View</span>
            </button>
          </div>
        );
      case 'patient':
        return (
          <div className="split-button">
            <button onClick={handleViewDoctor} className="view-btn">
              <span>View</span>
            </button>
            <button onClick={handleChatWithDoctor} className="chat-btn">
              <span>Chat</span>
            </button>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="doctor-card" key={keyID}>
      <div className="profile-photo-container">
        <img 
          src={doctor.profilePhoto || '/assets/doctor.svg'} 
          alt={`Dr. ${doctor.name}`} 
          className="profile-photo"
        />
      </div>

      <div className="card-content">
        <div className="doctor-info">
          <h3 className="doctor-name">{doctor.name}</h3>
          <div className="info-row">
            <span className="label">Specialty</span>
            <span className="value">{doctor.specialty}</span>
          </div>
          <div className="info-row">
            <span className="label">Phone</span>
            <span className="value">{doctor.phone}</span>
          </div>
          <div className="info-row">
            <span className="label">Price</span>
            <span className="value">{`${doctor?.price} EG`}</span>
          </div>
        </div>

        {renderActions()}
      </div>
    </div>
  );
};

export default DoctorCard;