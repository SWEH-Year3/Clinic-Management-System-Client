import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

const EditAppointmentModal = ({ 
  show, 
  onClose, 
  appointment, 
  onSave,
  loading 
}) => {
  const [editedAppointment, setEditedAppointment] = useState({
    date: appointment?.date || '',
    time: appointment?.time || '',
    state: appointment?.state || 'open'
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedAppointment(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...appointment,
      ...editedAppointment,
      date: new Date(editedAppointment.date).toISOString().split('T')[0]
    });
  };

  return (
    <Modal show={show} onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>Edit Appointment</Modal.Title>
      </Modal.Header>
      <form onSubmit={handleSubmit}>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>Date</Form.Label>
            <Form.Control
              type="date"
              name="date"
              value={editedAppointment.date}
              onChange={handleInputChange}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Time</Form.Label>
            <Form.Control
              type="time"
              name="time"
              value={editedAppointment.time}
              onChange={handleInputChange}
              required
            />
          </Form.Group>
          
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button variant="primary" type="submit" disabled={loading}>
            {loading ? 'Saving...' : 'Save Changes'}
          </Button>
        </Modal.Footer>
      </form>
    </Modal>
  );
};

export default EditAppointmentModal;