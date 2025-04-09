import React from 'react';

const AdminDashboard = () => {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded shadow">
          <h3 className="font-semibold">Doctors</h3>
          <p className="text-3xl">24</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h3 className="font-semibold">Appointments</h3>
          <p className="text-3xl">156</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h3 className="font-semibold">Patients</h3>
          <p className="text-3xl">89</p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;