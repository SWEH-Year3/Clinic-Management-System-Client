import React, { useState } from 'react';
import axios from 'axios';
import { toaster } from '../../components/ui/toaster';
import { useAuth } from '../../Context/AuthContext';
import '../Auth/ClinicAuth.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUser,
  faEnvelope,
  faLock,
  faUserTag,
  faIdCard,
  faStethoscope,
  faSignInAlt,
  faUserPlus
} from '@fortawesome/free-solid-svg-icons';

const ClinicAuth = () => {
  const [isSignIn, setIsSignIn] = useState(true);
  const [userRole, setUserRole] = useState('patient');
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    licenseNumber: '',
    specialization: ''
  });

  const { setUser } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleRoleChange = (e) => {
    setUserRole(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isSignIn && formData.password !== formData.confirmPassword) {
      toaster.create({
        type: 'error',
        title: 'Password mismatch',
        description: 'Passwords do not match.',
        meta: { closable: true }
      });
      return;
    }

    try {
      const { email, password } = formData;
      const username = email.split('@')[0];

      const response = await axios.get('http://localhost:3000/login-return');
      const matchedUser = response.data.find(u => u.name === username && password === username);

      if (!matchedUser) {
        toaster.create({
          type: 'error',
          title: 'Invalid credentials',
          description: 'Username or password is incorrect.',
          meta: { closable: true }
        });
        return;
      }

      if (!isSignIn) {
        matchedUser.role = userRole;
        if (userRole === 'doctor') {
          matchedUser.licenseNumber = formData.licenseNumber;
          matchedUser.specialization = formData.specialization;
        }
      }

      setUser(matchedUser);
      toaster.create({
        type: 'success',
        title: `Welcome ${matchedUser.name}`,
        description: `${isSignIn ? 'Login' : 'Registration'} successful!`,
        meta: { closable: true }
      });
    } catch (error) {
      toaster.create({
        type: 'error',
        title: isSignIn ? 'Login failed' : 'Registration failed',
        description: `Something went wrong while ${isSignIn ? 'logging in' : 'registering'}.`,
        meta: { closable: true }
      });
    }
  };

  const toggleAuthMode = () => {
    setIsSignIn(!isSignIn);
  };

  return (
    <div className="auth-container">
      <div className="medical-background"></div>
      <div className="auth-content">
        <div className="title-container">
          <h1>Wellness</h1>
          <p className="tagline">Professional Healthcare Management</p>
        </div>

        <div className="auth-tabs">
          <button className={`tab ${isSignIn ? 'active' : ''}`} onClick={() => setIsSignIn(true)}>Sign In</button>
          <button className={`tab ${!isSignIn ? 'active' : ''}`} onClick={() => setIsSignIn(false)}>Sign Up</button>
          <div className={`tab-indicator ${isSignIn ? 'sign-in' : 'sign-up'}`} />
        </div>

        <form onSubmit={handleSubmit} className={`auth-form ${isSignIn ? 'sign-in' : 'sign-up'}`}>
          {!isSignIn && (
            <>
              <div className="form-group">
                <label htmlFor="fullName">Full Name</label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                  placeholder={userRole === 'doctor' ? "Dr. John Smith" : "John Smith"}
                />
                <FontAwesomeIcon icon={faUser} className="input-icon" />
              </div>

              <div className="form-group">
                <label htmlFor="userRole">I am a:</label>
                <select
                  id="userRole"
                  name="userRole"
                  value={userRole}
                  onChange={handleRoleChange}
                  className="form-select"
                  required
                >
                  <option value="patient">Patient</option>
                  <option value="doctor">Doctor</option>
                  <option value="admin">Administrator</option>
                </select>
                <FontAwesomeIcon icon={faUserTag} className="input-icon" />
              </div>

              {userRole === 'doctor' && !isSignIn && (
                <>
                  <div className="form-group">
                    <label htmlFor="licenseNumber">Medical License Number</label>
                    <input
                      type="text"
                      id="licenseNumber"
                      name="licenseNumber"
                      value={formData.licenseNumber}
                      onChange={handleChange}
                      required
                      placeholder="MD-123456"
                    />
                    <FontAwesomeIcon icon={faIdCard} className="input-icon" />
                  </div>
                  <div className="form-group">
                    <label htmlFor="specialization">Specialization</label>
                    <input
                      type="text"
                      id="specialization"
                      name="specialization"
                      value={formData.specialization}
                      onChange={handleChange}
                      required
                      placeholder="Cardiology"
                    />
                    <FontAwesomeIcon icon={faStethoscope} className="input-icon" />
                  </div>
                </>
              )}
            </>
          )}

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="user@example.com"
            />
            <FontAwesomeIcon icon={faEnvelope} className="input-icon" />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="••••••••"
              minLength="6"
            />
            <FontAwesomeIcon icon={faLock} className="input-icon" />
          </div>

          {!isSignIn && (
            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                placeholder="••••••••"
                minLength="6"
              />
              <FontAwesomeIcon icon={faLock} className="input-icon" />
            </div>
          )}

          <button type="submit" className="submit-btn">
            {isSignIn ? 'Sign In' : 'Create Account'}
            <FontAwesomeIcon 
              icon={isSignIn ? faSignInAlt : faUserPlus} 
              className="btn-icon" 
            />
          </button>
        </form>

        <div className="auth-footer">
          {isSignIn ? (
            <p>Don't have an account? <button type="button" onClick={toggleAuthMode} className="toggle-btn">Register here</button></p>
          ) : (
            <p>Already registered? <button type="button" onClick={toggleAuthMode} className="toggle-btn">Sign in here</button></p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClinicAuth;