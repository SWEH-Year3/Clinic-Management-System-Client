import React from 'react';
import { X, User } from 'lucide-react';
import './AddDocForm.css';

const AddDocForm = ({ isOpen, onClose, onAdd }) => {
  const [newDoctor, setNewDoctor] = React.useState({
    name: '',
    phone: '',
    specialty: '',
    price: '',
    profilePhoto: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewDoctor(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newDoctor.name && newDoctor.specialty) {
      onAdd({
        ...newDoctor,
        id: Date.now(),
        email: `${newDoctor.name.replace(/\s+/g, '').toLowerCase()}@example.com`
      });
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-card-container">
        <div className="doctor-card modal-card">
          <button className="close-btn" onClick={onClose}>
            <X size={20} />
          </button>
          
          <div className="profile-photo-container">
            <div className="profile-photo-placeholder">
              <User size={40} />
            </div>
          </div>
          
          <form onSubmit={handleSubmit} className="card-content">
            <div className="doctor-info">
              <input
                type="text"
                name="name"
                value={newDoctor.name}
                onChange={handleChange}
                placeholder="Doctor Name"
                className="doctor-name-input"
                required
              />
              
              <div className="info-row">
                <span className="label">Phone</span>
                <input
                  type="text"
                  name="phone"
                  value={newDoctor.phone}
                  onChange={handleChange}
                  placeholder="e.g. [202] 256 987"
                  className="value-input"
                />
              </div>
              
              <div className="info-row">
                <span className="label">Speciality</span>
                <input
                  type="text"
                  name="specialty"
                  value={newDoctor.specialty}
                  onChange={handleChange}
                  placeholder="e.g. Dermatology"
                  className="value-input"
                  required
                />
              </div>
              
              <div className="info-row">
                <span className="label">Price</span>
                <input
                  type="text"
                  name="price"
                  value={newDoctor.price}
                  onChange={handleChange}
                  placeholder="e.g. $500/session"
                  className="value-input"
                />
              </div>
            </div>
            
            <button type="submit" className="add-submit-btn">
              <span>Add</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddDocForm;