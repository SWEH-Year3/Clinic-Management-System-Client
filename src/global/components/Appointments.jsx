/* eslint-disable no-unused-vars */
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
    
    const [selectedState, setSelectedState] = useState({});
    const [appointments, setAppointments] = useState([]);
    const [loader, setLoader] = useState(true);
    const [reload, setReload] = useState(false);


    // Load appointments
    useEffect(() => {
        setLoader(true);
        let URL = "";
        // console.log(role);
        switch (role) {
            case 'patient':
                URL = `/api/Appointment/${JSON.parse(localStorage.getItem('user')).id}/patient`;
                break;
            case 'doctor':
                URL = `/api/Appointment/${JSON.parse(localStorage.getItem('user')).id}/doctor`;
                break;
            case 'admin':
                URL = `/api/Appointment/`;
                break;
        }
        axios.get(`https://localhost:7195${URL}`,
        {
            headers: {
                'Authorization': `Bearer ${JSON.parse(localStorage.getItem('user')).token}`,
            },
        }
        )
            .then((response) => {
            // console.log(response.data);
            setAppointments(response.data);
        })
        .catch((error) => {
            console.warn('Error loading appointments:', error);
        })
        .finally(() => {
            setLoader(false);
        });
    }, [reload]);

//TODO: update a]ointment state to open and set patientID = null
    const handleCancel = (appointmentId) => {
        setLoader(true);
        setSelectedState(appointments.find(appointment => appointment.id === appointmentId));
        axios.put(`https://localhost:7195/api/Appointment/${appointmentId}/Admin`, {
            state: 'open',
            patientId: "not found"
        }, {

            headers: {
                'Authorization': `Bearer ${JSON.parse(localStorage.getItem('user')).token}`,
            },
        })
        .then((response) => {
            // console.log('Appointment canceled successfully:', response.data);
            setReload(!reload);
        })
        .catch((error) => {
            console.warn('Error canceling appointment:', error);
        }).finally(() => {
            setLoader(false);
            setSelectedState({});
        });
    };
    const handleStateChange = (appointment, newState) => {
        setLoader(true);
        setSelectedState(appointment);
        let URL = "";
        switch (role) {
            case 'admin':
                URL = `/api/Appointment/${appointment.id}/Admin`;
                break;
            case 'doctor':
                URL = `/api/Appointment/${appointment.id}/treat`;
                break;
        }
        axios.put(`https://localhost:7195${URL}`,
            {
                state: newState,
                patientId: appointment.patientId
             },
            {
                headers: {
                    'Authorization': `Bearer ${JSON.parse(localStorage.getItem('user')).token}`,
                },
            })
        .then((response) => {
            // console.log('Appointment state updated successfully:', response.data);
            setReload(!reload);
        })
        .catch((error) => {
            console.warn('Error updating appointment state:', error);
        }).finally(() => {
            setLoader(false);
            setSelectedState({});
        });
    };

    const handleSearch = async (event) => {
        // console.log(event.target.value);
        event.preventDefault();
        try {
            //   const response = await fetch("http://localhost:3000/doctors");
            const response = await axios.get(`https://localhost:7195/api/Appointment/doctor/search?Name=${event.target.value}`);
            // console.log(response.data);
            switch (role) {
                case 'patient':
                    setAppointments(response.data.filter(appointment => appointment.patientId === user.id));
                    break;
                case 'doctor':
                    setAppointments(response.data.filter(appointment => appointment.doctorId === user.id));
                    break;
                case 'admin':
                    setAppointments(response.data);
                    break;
            }
            // setAppointments(response.data);

        } catch (error) {
            setReload(!reload);
        }
    }
    return (
        <div className="container pt-5">
            {!isDoctor && (
                    <div className="container-fluid w-50 my-3">
                    <form className="d-flex" role="search" onChange={handleSearch}>
                        <input className="form-control me-2" type="search" placeholder="Search By Doctor Name" aria-label="Search" list="doctors" />
                        {/* <button className="btn btn-outline-primary" type="submit">Search</button> */}
                        <datalist id="doctors">
                            {appointments.map((appointment) => (
                                <option key={appointment.id} value={appointment.doctorName} />
                            ))}
                        </datalist>
                    </form>
                </div>
            )}
        <table className="table  table-hover text-start">
            <thead>
            <tr className='table-secondary'>
                {(isPatient || isAdmin) && <th>Doctor</th>}
                {(isDoctor || isAdmin) && <th>Patient</th>}
                {isPatient && <th>Specialty</th>}
                {(isDoctor || isAdmin) && <th>Phone</th>}
                <th>Time / Date</th>
                <th>State</th>
                <th className="text-center">Action</th>
            </tr>
            </thead>
            <tbody>
            { appointments.length > 0 && appointments.map((appointment) => (
                <tr key={appointment.id}>
                {(isPatient || isAdmin) && <td>{appointment.doctorName}</td>}
                {(isDoctor || isAdmin) && <td>{appointment.patientName}</td>}
                {isPatient && <td>{appointment.specialty}</td>}
                {(isDoctor || isAdmin) && <td>{appointment.phone}</td>}
                <td>{appointment.time} / {appointment.date}</td>
                    <td style={{
                        textTransform: 'capitalize', color: appointment.state === 'closed' ? 'gray' : appointment.state === 'pending' ? 'orange' : appointment.state === 'ongoing' ? 'green' : 'red'}}>{appointment.state}</td>
                <td className="text-center">
                    <div className="action-buttons">
                            {
                                loader && selectedState?.id === appointment.id ? (
                                    <div className="spinner-border " role="status">
                                        <span className="visually-hidden">Loading...</span>
                                    </div>
                                ) :
                                    (
                                        <>
                                            {isPatient && appointment.state === 'closed' && (
                                                <div className="patient-closed">
                                                    <button className="btn btn-outline-primary me-2" onClick={() => navigate(`/view-doctor/${appointment.doctorId}`)}>
                                                        View
                                                    </button>
                                                    <button className="btn btn-outline-primary" onClick={() => navigate(`/prescriptions/${appointment.id}`)}>
                                                        Prescription
                                                    </button>
                                                </div>
                                            )}

                                            {isPatient && appointment.state === 'pending' && (
                                                <div className="patient-pending">
                                                    <button className="btn btn-outline-primary me-2" onClick={() => navigate(`/view-doctor/${appointment.doctorId}`)}>
                                                        View
                                                    </button>
                                                    <button className="btn btn-outline-danger" onClick={() => handleCancel(appointment.id)}>
                                                        Cancel
                                                    </button>
                                                </div>
                                            )}

                                            {isPatient && appointment.state === 'ongoing' && (
                                                <div className="patient-ongoing">
                                                    <button className="btn btn-outline-primary me-2" onClick={() => navigate(`/view-doctor/${appointment.doctorId}`)}>
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
                                                        {/* <button className="btn btn-outline-warning" onClick={() => navigate(`/doctors/${appointment.doctorId}`)}>
                                                            Reschedule
                                                        </button> */}
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
                                        </>
                                    )
                        }    
                    
                    </div>
                </td>
                </tr>
            ))}
            {!loader && appointments.length === 0 && <tr><td colSpan="7">No appointments found.</td></tr>}
                {loader && appointments.length === 0 && (<tr><td colSpan="7" className="text-center py-3">
                <div className="spinner-border " role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
                </td></tr>)}
                </tbody>
        </table>
        </div>
    
    )
}

export default Appointments