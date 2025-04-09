import React from 'react';
import './EditDoctorModal.css';
import { X, Upload, User } from 'lucide-react';

class EditDoctorModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: props.doctor.name,
      specialty: props.doctor.specialty,
      email: props.doctor.email,
      phone: props.doctor.phone,
      isActive: props.doctor.isActive,
      profilePhoto: props.doctor.profilePhoto,
      previewPhoto: props.doctor.profilePhoto,
      errors: {}
    };
  }

  handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    this.setState({
      [name]: type === 'checkbox' ? checked : value,
      errors: {
        ...this.state.errors,
        [name]: null
      }
    });
  };

  handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        this.setState({
          previewPhoto: reader.result,
          profilePhoto: file
        });
      };
      reader.readAsDataURL(file);
    }
  };

  validate = () => {
    const errors = {};
    if (!this.state.name.trim()) errors.name = 'Name is required';
    if (!this.state.specialty.trim()) errors.specialty = 'Specialty is required';
    if (!this.state.email.trim()) errors.email = 'Email is required';
    if (!this.state.phone.trim()) errors.phone = 'Phone is required';
    
    this.setState({ errors });
    return Object.keys(errors).length === 0;
  };

  handleSubmit = (e) => {
    e.preventDefault();
    if (this.validate()) {
      const updatedDoctor = {
        ...this.props.doctor,
        name: this.state.name,
        specialty: this.state.specialty,
        email: this.state.email,
        phone: this.state.phone,
        isActive: this.state.isActive,
        profilePhoto: this.state.profilePhoto
      };
      this.props.onSave(updatedDoctor);
    }
  };

  render() {
    const { onClose } = this.props;
    const { name, specialty, email, phone, isActive, previewPhoto, errors } = this.state;

    return (
      <div className="modal-overlay">
        <div className="modal-container">
          <button className="close-btn" onClick={onClose}>
            <X size={20} />
          </button>
          
          <h2 className="modal-title">Edit Doctor</h2>
          
          <div className="photo-upload-container">
            <div className="photo-preview">
              {previewPhoto ? (
                <img src={previewPhoto} alt="Profile preview" className="profile-preview" />
              ) : (
                <div className="empty-photo">
                  <User size={48} />
                </div>
              )}
            </div>
            <label className="upload-btn">
              <Upload size={16} />
              <span>Change Photo</span>
              <input 
                type="file" 
                accept="image/*"
                onChange={this.handlePhotoChange}
                className="hidden"
              />
            </label>
          </div>
          
          <form onSubmit={this.handleSubmit} className="doctor-form">
            <div className="form-group">
              <label>Full Name</label>
              <input
                type="text"
                name="name"
                value={name}
                onChange={this.handleChange}
                className={errors.name ? 'error' : ''}
              />
              {errors.name && <span className="error-message">{errors.name}</span>}
            </div>
            
            <div className="form-group">
              <label>Specialty</label>
              <input
                type="text"
                name="specialty"
                value={specialty}
                onChange={this.handleChange}
                className={errors.specialty ? 'error' : ''}
              />
              {errors.specialty && <span className="error-message">{errors.specialty}</span>}
            </div>
            
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={email}
                onChange={this.handleChange}
                className={errors.email ? 'error' : ''}
              />
              {errors.email && <span className="error-message">{errors.email}</span>}
            </div>
            
            <div className="form-group">
              <label>Phone</label>
              <input
                type="tel"
                name="phone"
                value={phone}
                onChange={this.handleChange}
                className={errors.phone ? 'error' : ''}
              />
              {errors.phone && <span className="error-message">{errors.phone}</span>}
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
  }
}

export default EditDoctorModal;