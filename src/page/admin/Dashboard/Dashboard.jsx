import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer} from 'recharts';
import 'bootstrap/dist/css/bootstrap.min.css';

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const Dashboard = () => {
    const [doctors, setDoctors] = useState([]);
    const [selectedDoctor, setSelectedDoctor] = useState(null);

    const [chartData, setChartData] = useState(
        months.map((month) => ({ name: month, appointments: 0 }))
    );

    useEffect(() => {
        //update url
        axios.get('http://localhost:3000/dashboard')
        .then((response) => {
            setDoctors(response.data);
        })
        .catch((error) => {
            console.error('Error fetching doctor data:', error);
        });
    }, []);

    const handleReportClick = (doctor) => {
        setSelectedDoctor(doctor);

        const updatedData = months.map((month, index) => ({
        name: month,
        appointments: doctor.appointments[index],
        }));
        setChartData(updatedData);
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
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="appointments" fill="rgb(26, 33, 66, 0.85)" />
                </BarChart>
            </ResponsiveContainer>
        </>}
        <table className="table table-striped mt-5">
            <thead>
            <tr>
                <th>Doctor Name</th>
                <th>Specialty</th>
                <th>Total Appointments</th>
                <th>Action</th>
            </tr>
            </thead>
            <tbody>
            {doctors.map((doctor, index) => (
                <tr key={index}>
                <td>{doctor.name}</td>
                <td>{doctor.specialty}</td>
                <td>{doctor.appointments.reduce((a, b) => a + b, 0)}</td>
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
            </tbody>
        </table>
        </div>
    );
    };

export default Dashboard;
