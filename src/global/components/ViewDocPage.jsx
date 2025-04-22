import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Container, Row, Col, Table, Button, Spinner, Alert, Modal, Form } from 'react-bootstrap';
import EditDoctorModal from '../components/Admin/EditDoctorModal'; 
import EditAppointmentModal from '../components/Admin/EditAppointmentModal';


const ViewDocPage = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const doctor = state?.doctor;
  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDeleteAppointmentModal, setShowDeleteAppointmentModal] = useState(false);
  const [appointmentToDelete, setAppointmentToDelete] = useState(null);
  const [showAddAppointmentModal, setShowAddAppointmentModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showEditAppointmentModal, setShowEditAppointmentModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [newAppointment, setNewAppointment] = useState({
    date: '',
    time: '',
    doctorId: doctor?.id || '',
    doctorName: doctor?.name || '',
  });

  const user = JSON.parse(localStorage.getItem('user'));
  const role = user?.role;

  const handleSaveDoctor = async (updatedDoctor) => {
    try {
      setLoading(true);
      const requestBody = {
        name: updatedDoctor.name,
        specialty: updatedDoctor.specialty,
        email: updatedDoctor.email,
        phone: updatedDoctor.phone
      };

      const response = await fetch(`http://localhost:3000/doctors/${doctor.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) throw new Error('Failed to update doctor');

      const savedDoctor = await response.json();
      setShowEditModal(false);
      navigate('.', { state: { ...state, doctor: savedDoctor }, replace: true });
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await fetch('http://localhost:3000/appointments');
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

        const data = await response.json();
        setAppointments(data);
        if (doctor?.id) {
          const filtered = data.filter(appt => appt.doctorId.toString() === doctor.id.toString());
          setFilteredAppointments(filtered);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, [doctor?.id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewAppointment(prev => ({ ...prev, [name]: value }));
  };

  const handleAddAppointment = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:3000/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newAppointment,
          date: new Date(newAppointment.date).toISOString().split('T')[0]
        }),
      });

      if (!response.ok) throw new Error('Failed to add appointment');

      const addedAppointment = await response.json();
      setAppointments(prev => [...prev, addedAppointment]);
      setFilteredAppointments(prev => [...prev, addedAppointment]);
      setShowAddAppointmentModal(false);
      setNewAppointment({
        date: '',
        time: '',
        doctorId: doctor?.id || '',
        doctorName: doctor?.name || '',
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteDoctor = async () => {
    try {
      const response = await fetch(`http://localhost:3000/doctors/${doctor.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      navigate('/admin/doctors', { state: { message: 'Doctor deleted successfully' } });
    } catch (err) {
      setError(err.message);
    } finally {
      setShowDeleteModal(false);
    }
  };

  const handleDeleteAppointment = async () => {
    try {
      const response = await fetch(`http://localhost:3000/appointments/${appointmentToDelete.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      setAppointments(prev => prev.filter(appt => appt.id !== appointmentToDelete.id));
      setFilteredAppointments(prev => prev.filter(appt => appt.id !== appointmentToDelete.id));
      setAppointmentToDelete(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setShowDeleteAppointmentModal(false);
    }
  };
  const handleSaveAppointment = async (updatedAppointment) => {
    try {
      setLoading(true);
      const response = await axios.put(
        `http://localhost:3000/appointments/${updatedAppointment.id}`,
        updatedAppointment,
        {
          headers: { 'Content-Type': 'application/json' }
        }
      );
  
      const savedAppointment = response.data;
      
      setAppointments(prev => 
        prev.map(appt => 
          appt.id === savedAppointment.id ? savedAppointment : appt
        )
      );
      
      setFilteredAppointments(prev => 
        prev.map(appt => 
          appt.id === savedAppointment.id ? savedAppointment : appt
        )
      );
      
      setShowEditAppointmentModal(false);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to update appointment');
    } finally {
      setLoading(false);
    }
  };
  const confirmDeleteAppointment = (appointment) => {
    setAppointmentToDelete(appointment);
    setShowDeleteAppointmentModal(true);
  };
  const handleBookAppointment = async (appointment) => {
    try {
      setLoading(true);
      const response = await axios.put(
        `http://localhost:3000/appointments/${appointment.id}`,
        {
          ...appointment,
          state: 'pending',
          patientId: user.id,
          patientName: user.name,
          patientPhone: user.phone,
          patientEmail: user.email
        }
      );
  
      const updatedAppointment = response.data;
      
      // Update the appointments list
      setAppointments(prev => 
        prev.map(appt => 
          appt.id === appointment.id ? updatedAppointment : appt
        )
      );
      
      setFilteredAppointments(prev => 
        prev.map(appt => 
          appt.id === appointment.id ? updatedAppointment : appt
        )
      );
      
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!doctor) {
    return (
      <Container className="mt-5">
        <Alert variant="danger">Doctor not found</Alert>
      </Container>
    );
  }

  return (
    <Container className="my-4 d-flex" style={{ minHeight: '80vh' }}>
        <Row className="align-items-center w-100"> 
        <Col md={4} className="mb-4">
  <div
    className="doctor-card d-flex flex-column justify-content-center align-items-start"
    style={{ position: 'relative', height: '100%', padding: '20px' }}
  >
    <div className="d-flex justify-content-center w-100 mb-3">
      <div className="profile-photo-container">
        <img 
          src={doctor.profilePhoto || '/assets/doctor.svg'} 
          alt={`Dr. ${doctor.name}`} 
          className="profile-photo"
          style={{ width: '140px', height: '170px', objectFit: 'cover', borderRadius: '50%' }}
        />
      </div>
    </div>

    <div
      className="card-content"
      style={{
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
      }}
    >
      <h3 className="doctor-name">{doctor.name}</h3>

      <div className="info-row d-flex align-items-center">
        <span
          style={{
            width: '112px',
            height: '39px',
            fontFamily: 'Inter, sans-serif',
            fontWeight: 700,
            fontSize: '20px',
          }}
        >
          Specialty
        </span>
        <span
          style={{
            width: '193px',
            height: '30px',
            fontFamily: 'Inter, sans-serif',
            fontWeight: 400,
            fontStyle: 'italic',
            fontSize: '20px',
            marginLeft: '15px',
          }}
        >
          {doctor.specialty}
        </span>
      </div>

      <div className="info-row d-flex align-items-center">
        <span
          style={{
            width: '112px',
            height: '39px',
            fontFamily: 'Inter, sans-serif',
            fontWeight: 700,
            fontSize: '20px',
          }}
        >
          Phone
        </span>
        <span
          style={{
            width: '193px',
            height: '30px',
            fontFamily: 'Inter, sans-serif',
            fontWeight: 400,
            fontStyle: 'italic',
            fontSize: '20px',
            marginLeft: '15px',
          }}
        >
          {doctor.phone}
        </span>
      </div>

      <div className="info-row d-flex align-items-center">
        <span
          style={{
            width: '112px',
            height: '39px',
            fontFamily: 'Inter, sans-serif',
            fontWeight: 700,
            fontSize: '20px',
          }}
        >
          Price
        </span>
        <span
          style={{
            width: '193px',
            height: '30px',
            fontFamily: 'Inter, sans-serif',
            fontWeight: 400,
            fontStyle: 'italic',
            fontSize: '20px',
            marginLeft: '15px',
          }}
        >
          {doctor.price || '$200/session'}
        </span>
      </div>

      {role === 'admin' && (
        <div className="split-button mt-3">
          <Button onClick={() => setShowEditModal(true)} className="edit-btn">Edit</Button>
          <Button onClick={() => setShowDeleteModal(true)} className="delete-btn">Delete</Button>
        </div>
      )}
    </div>
  </div>
</Col>


    <Col md={8}>
      
        {loading ? (
          <div className="text-center py-4">
            <Spinner animation="border" role="status">
              <span className="visually-hidden">Loading...</span>
            </Spinner>
            <p className="mt-2">Loading appointments...</p>
          </div>
        ) : error ? (
          <Alert variant="danger">{error}</Alert>
        ) : filteredAppointments.length === 0 ? (
          <Alert variant="info">No appointments found for this doctor</Alert>
        ) : (
      <Table striped hover responsive className="mt-5" style={{ width: '800px' }}>
        <thead>
          <tr>
            <th>Date</th>
            <th>Time</th>
            <th>{role === 'patient' ? 'Book' : 'Actions'}</th>
          </tr>
        </thead>
        <tbody>
          {filteredAppointments.map((appointment) => (
            <tr key={appointment.id}>
              <td>{new Date(appointment.date).toLocaleDateString()}</td>
              <td>{appointment.time}</td>
              <td>
              {role === 'patient' ? (
                appointment.state === 'open' ? (
                  <button
                    style={{
                      backgroundColor: "#1A2142",
                      color: "white",
                      border: "2px solid #1A2142",
                      padding: "5px 10px",
                      borderRadius: "5px"
                    }}
                    onClick={() => handleBookAppointment(appointment)}
                  >
                    Book
                  </button>
                ) : appointment.state === 'pending' ? (
                  <button
                    style={{
                      backgroundColor: "#FFA500",
                      color: "white",
                      border: "2px solid #FFA500",
                      padding: "5px 10px",
                      borderRadius: "5px",
                      cursor: 'not-allowed'
                    }}
                    disabled
                  >
                    Pending
                  </button>
                ) : appointment.state === 'ongoing' ? (
                  <button
                    style={{
                      backgroundColor: "#4CAF50",
                      color: "white",
                      border: "2px solid #4CAF50",
                      padding: "5px 10px",
                      borderRadius: "5px",
                      cursor: 'not-allowed'
                    }}
                    disabled
                  >
                    On Going
                  </button>
                ) : appointment.state === 'canceled' ? (
                  <button
                    style={{
                      backgroundColor: "#f44336",
                      color: "white",
                      border: "2px solid #f44336",
                      padding: "5px 10px",
                      borderRadius: "5px",
                      cursor: 'not-allowed'
                    }}
                    disabled
                  >
                    Canceled
                  </button>
                ) : null
              ) : (
                  <>
                <button
                  style={{
                    backgroundColor: "transparent",
                    color: "#6c757d",
                    border: "2px solid #6c757d",
                    padding: "5px 10px",
                    borderRadius: "5px",
                    marginRight: "8px"
                  }}
                  onClick={() => {
                    setSelectedAppointment(appointment);
                    setShowEditAppointmentModal(true);
                  }}
                >
                  Edit
                </button>
                    <button
                      style={{
                        backgroundColor: "transparent",
                        color: "#dc3545",
                        border: "2px solid #dc3545",
                        padding: "5px 10px",
                        borderRadius: "5px"
                      }}
                      onClick={() => confirmDeleteAppointment(appointment)}
                    >
                      Delete
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
        )}
    

      {role === 'admin' && (
        <div className="text-center mt-3">
          <Button
           onClick={() => setShowAddAppointmentModal(true)}
           style={{ width: '304px', height: '56px' ,
            backgroundColor: "#1A2142"
           }}>
            Add Time
          </Button>
        </div>
      )}
    </Col>
  </Row>

      {/* Modals */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete {doctor.name}? This action cannot be undone.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>Cancel</Button>
          <Button variant="danger" onClick={handleDeleteDoctor}>Delete</Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showDeleteAppointmentModal} onHide={() => setShowDeleteAppointmentModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {appointmentToDelete && (
            <>
              <p>Are you sure you want to delete this appointment?</p>
              <p><strong>Date:</strong> {new Date(appointmentToDelete.date).toLocaleDateString()}</p>
              <p><strong>Time:</strong> {appointmentToDelete.time}</p>
              {appointmentToDelete.patientName && (
                <p><strong>Patient:</strong> {appointmentToDelete.patientName}</p>
              )}
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteAppointmentModal(false)}>Cancel</Button>
          <Button variant="danger" onClick={handleDeleteAppointment}>Delete Appointment</Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showAddAppointmentModal} onHide={() => setShowAddAppointmentModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add New Appointment</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Date</Form.Label>
              <Form.Control
                type="date"
                name="date"
                value={newAppointment.date}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Time</Form.Label>
              <Form.Control
                type="time"
                name="time"
                value={newAppointment.time}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowAddAppointmentModal(false)}>Cancel</Button>
          <Button variant="primary" onClick={handleAddAppointment} disabled={loading}>
            {loading ? 'Adding...' : 'Add Appointment'}
          </Button>
        </Modal.Footer>
      </Modal>

      {showEditModal && (
        <EditDoctorModal
          doctor={doctor}
          onClose={() => setShowEditModal(false)}
          onSave={handleSaveDoctor}
        />
      )}
      {showEditAppointmentModal && (
  <EditAppointmentModal
    show={showEditAppointmentModal}
    onClose={() => setShowEditAppointmentModal(false)}
    appointment={selectedAppointment}
    onSave={handleSaveAppointment}
    loading={loading}
  />
)}
    </Container>
  );
};

export default ViewDocPage;