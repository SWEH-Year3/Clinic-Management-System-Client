import React from 'react';
import './EditDoctorModal.css';
import { X } from 'lucide-react';

const EditDoctorModal = ({ doctor, onClose, onSave }) => {
  const [formData, setFormData] = React.useState({
    name: doctor?.name || '',
    specialty: doctor?.specialty || '',
    phone: doctor?.phone || '',
    email: doctor?.email || '',
    price: doctor?.price || ''
  });
    // console.log(doctor);
  const [errors, setErrors] = React.useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
   
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name?.trim()) newErrors.name = 'Name is required';
    if (!formData.specialty?.trim()) newErrors.specialty = 'Specialty is required';
    if (!formData.phone?.trim()) newErrors.phone = 'Phone is required';
    if (!formData.email?.trim()) newErrors.email = 'Email is required';
    if (!formData.price?.trim()) newErrors.price = 'Price is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      const updatedDoctor = {
        ...doctor,
        ...formData
    };
    // console.log(updatedDoctor)    
      onSave(updatedDoctor);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <button className="close-btn" onClick={onClose}>
          <X size={20} />
        </button>
        
        <h2 className="modal-title">Edit Doctor</h2>
        
        <form onSubmit={handleSubmit} className="doctor-form">
          <div className="form-group">
            <label>Full Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={errors.name ? 'error' : ''}
            />
            {errors.name && <span className="error-message">{errors.name}</span>}
          </div>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={errors.email ? 'error' : ''}
            />
            {errors.email && <span className="error-message">{errors.email}</span>}
          </div>
          
          <div className="form-group">
            <label>Specialty</label>
            <input
              type="text"
              name="specialty"
              value={formData.specialty}
              onChange={handleChange}
              className={errors.specialty ? 'error' : ''}
            />
            {errors.specialty && <span className="error-message">{errors.specialty}</span>}
          </div>
          
          
          
          <div className="form-group">
            <label>Phone</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className={errors.phone ? 'error' : ''}
            />
            {errors.phone && <span className="error-message">{errors.phone}</span>}
          </div>
          <div className="form-group">
            <label>Price</label>
            <input
              type="text"
              name="price"
              value={formData.price}
              onChange={handleChange}
              className={errors.price ? 'error' : ''}
            />
            {errors.price && <span className="error-message">{errors.price}</span>}
          </div>
          
          <div className="form-actions">
            <button type="button" className="cancel-btn" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="save-btn">
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditDoctorModal;