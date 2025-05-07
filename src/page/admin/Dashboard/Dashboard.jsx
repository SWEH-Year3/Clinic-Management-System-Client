import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer} from 'recharts';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../Context/AuthContext';
import './dashboard.css';
const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const Dashboard = () => {
    const [doctors, setDoctors] = useState([]);
    const [loader, setLoader] = useState(true);
    const navigate = useNavigate();
    const [selectedDoctor, setSelectedDoctor] = useState(null);
    const { id } = useParams();
    const { user } = useAuth();
    const [chartData, setChartData] = useState(
        months.map((month) => ({ name: month, appointments: 0 }))
    );

    useEffect(() => {
        //update url
        // axios.get('http://localhost:3000/dashboard')
        if (id)
        {
            axios.get(`https://localhost:7195/api/Dashboard/${id}`,
                {
                    headers: {
                        'Authorization': `Bearer ${user.token}`,
                    },
                }
            )
            .then((response) => {
                setChartData(response.data?.monthlyAppointments.map((item) => ({
                    ...item,
                    month: months[new Date(item.month).getMonth()]
                })));
                console.log(response.data);
            })
            .catch((error) => {
                console.error('Error fetching doctor data:', error);
            }).finally(() => {
                setLoader(false);
            });
        }
    }, [id]);

    useEffect(() => {
        //update url
        // axios.get('http://localhost:3000/dashboard')
        
            axios.get(`https://localhost:7195/api/Report`,
                {
                    headers: {
                        'Authorization': `Bearer ${user.token}`,
                    },
                }
            )
            .then((response) => {
                console.log(response.data);
                setDoctors(response.data);
            })
            .catch((error) => {
                console.error('Error fetching doctor data:', error);
            }).finally(() => {
                setLoader(false);
            });
        
    }, []);

    const handleReportClick = (doctor) => {
        setSelectedDoctor(doctor);

        // const updatedData = months.map((month, index) => ({
        // name: month,
        // appointments: doctor.appointments[index],
        // }));
        // setChartData(updatedData);
        navigate(`/admin/dashboard/${doctor.doctorId}`);
    };

    return (
        <div className="container mt-5">

        {!selectedDoctor ? <div className="ReportNotFound" style={{display: "flex", justifyContent: "center", alignItems: "center"}}>
                            <img src="/assets/ReportNotFound.jpg" alt="report not found" style={{width: "35%"}}/>
                        </div> :  
        <>
            <h4 className="mb-4">Dr. {selectedDoctor.name} Appointments Report</h4>
            <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="appointmentCount" fill="rgb(26, 33, 66, 0.85)" />
                </BarChart>
            </ResponsiveContainer>
                </>}
            
        
                <div style={{maxHeight:"250px", overflow:"auto", marginBottom:"50px"}}>
                    <table className="table table-bordered table-hover table-striped mt-5 text-center table-scrollable">
                        <thead>
                        <tr>
                            <th>Doctor Name</th>
                            <th>Specialty</th>
                            <th>Total Appointments</th>
                            <th>Action</th>
                        </tr>
                        </thead>
                    <tbody>
                        {loader && <tr><td colSpan="4"><div className="spinner-border" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div></td></tr>}
                        <tr>

                        </tr>
                        {!loader && doctors.length > 0 && doctors.map((doctor, index) => (
                            <tr key={index}>
                            <td>{doctor.name}</td>
                            <td>{doctor.specialty}</td>
                                {/* <td>{doctor.monthlyAppointments.appointments.reduce((a, b) => a + b, 0)}</td> */}
                                <td>{doctor.monthlyAppointments.reduce((a, b) => a + b.appointmentCount, 0)}</td>
                            <td>
                                <button
                                style={{backgroundColor:"#1A2142", color:"white", border:"2px solid #1A2142", padding:"5px 10px", borderRadius:"5px"}}
                                onClick={() => handleReportClick(doctor)}
                                >
                                Report
                                </button>
                            </td>
                            </tr>
                        ))}
                        {!loader && doctors.length === 0 && (
                            <tr>
                            <td colSpan="4">No doctors found</td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                </div>
            
        </div>
    );
    };

export default Dashboard;
