import React from 'react'
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../Context/AuthContext';

const Appointments = () => {

    const navigate = useNavigate();
    const { user } = useAuth();

    const role = user.role;
    const isDoctor = role === 'doctor';
    const isPatient = role === 'patient';
    const isAdmin = role === 'admin';

    const [appointments, setAppointments] = useState([]);


    // Load appointments
    useEffect(() => {

        axios.get(`http://localhost:3000/appointments`)
        .then((response) => {
            setAppointments(response.data);
        })
        .catch((error) => {
            console.warn('Error loading appointments:', error);
        });
    }, [appointments]);

//TODO: update a]ointment state to open and set patientID = null
    const handleCancel = (appointmentId) => {
        axios.delete(`http://localhost:3000/appointments/${appointmentId}`)
        .then((response) => {
            console.log('Appointment canceled successfully:', response.data);
            
        })
        .catch((error) => {
            console.warn('Error canceling appointment:', error);
        });
    };

    const handleStateChange = (appointment, newState) => {
        axios.put(`http://localhost:3000/appointments/${appointment.id}`, { ...appointment ,state: newState })
        .then((response) => {
            console.log('Appointment state updated successfully:', response.data);
            
        })
        .catch((error) => {
            console.warn('Error updating appointment state:', error);
        });
    };

    return (
        <div className="container pt-5">
        <table className="table  table-hover text-start">
            <thead>
            <tr className='table-secondary'>
                {isPatient && <th>Doctor</th>}
                {(isDoctor || isAdmin) && <th>Patient</th>}
                {isPatient && <th>Specialty</th>}
                {(isDoctor || isAdmin) && <th>Phone</th>}
                <th>Time / Date</th>
                <th>State</th>
                <th className="text-center">Action</th>
            </tr>
            </thead>
            <tbody>
            {appointments.map((appointment) => (
                <tr key={appointment.id}>
                {isPatient && <td>{appointment.doctorName}</td>}
                {(isDoctor || isAdmin) && <td>{appointment.patientName}</td>}
                {isPatient && <td>{appointment.specialty}</td>}
                {(isDoctor || isAdmin) && <td>{appointment.patientPhone}</td>}
                <td>{appointment.time} / {appointment.date}</td>
                <td>{appointment.state}</td>
                <td className="text-center">
                    <div className="action-buttons">
                    {isPatient && appointment.state === 'closed' && (
                        <div className="patient-closed">
                        <button className="btn btn-outline-primary me-2" onClick={() => navigate(`/doctors/${appointment.doctorId}`)}>
                            View
                        </button>
                        <button className="btn btn-outline-primary" onClick={() => navigate(`/prescriptions/${appointment.id}`)}>
                            Prescription
                        </button>
                        </div>
                    )}

                    {isPatient && appointment.state === 'pending' && (
                        <div className="patient-pending">
                        <button className="btn btn-outline-primary me-2" onClick={() => navigate(`/doctors/${appointment.doctorId}`)}>
                            View
                        </button>
                        <button className="btn btn-outline-danger" onClick={() => handleCancel(appointment.id)}>
                            Cancel
                        </button>
                        </div>
                    )}

                    {isPatient && appointment.state === 'ongoing' && (
                        <div className="patient-ongoing">
                        <button className="btn btn-outline-primary me-2" onClick={() => navigate(`/doctors/${appointment.doctorId}`)}>
                            View
                        </button>
                        <button className="btn btn-outline-danger" onClick={() => handleCancel(appointment.id)}>
                            Cancel
                        </button>
                        </div>
                    )}

                    {isAdmin && appointment.state === 'ongoing' && (
                        <div className="admin-ongoing">
                        <button className="btn btn-outline-danger me-2" onClick={() => handleCancel(appointment.id)}>
                            Cancel
                        </button>
                        <button className="btn btn-outline-warning" onClick={() => navigate(`/doctors/${appointment.doctorId}`)}>
                            Reschedule
                        </button>
                        </div>
                    )}

                    {isAdmin && appointment.state === 'pending' && (
                        <div className="admin-pending">
                        <button className="btn btn-outline-success me-2" onClick={() => handleStateChange(appointment, 'ongoing')}>
                            Accept
                        </button>
                        <button className="btn btn-outline-danger" onClick={() => handleCancel(appointment.id)}>
                            Cancel
                        </button>
                        </div>
                    )}

                    {isDoctor && appointment.state === 'ongoing' && (
                        <div className="doctor-ongoing">
                        <button className="btn btn-outline-success me-2" onClick={() => handleStateChange(appointment, 'closed')}>
                            Treat
                        </button>
                        <button className="btn btn-outline-primary" onClick={() => navigate(`/prescriptions/${appointment.id}`)}>
                            Prescription
                        </button>
                        </div>
                    )}

                    {isDoctor && appointment.state === 'closed' && (
                        <div className="doctor-closed">
                        <button className="btn btn-outline-primary" onClick={() => navigate(`/prescriptions/${appointment.id}`)}>
                            Prescription
                        </button>
                        </div>
                    )}
                    </div>
                </td>
                </tr>
            ))}
            </tbody>
        </table>
        </div>
    
    )
}

export default Appointments