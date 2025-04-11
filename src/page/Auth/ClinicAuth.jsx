/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import axios from "axios";
import { toaster } from "../../components/ui/toaster";
import { toast } from "react-toastify";
import { useAuth } from "../../Context/AuthContext";
import "../Auth/ClinicAuth.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useLocation, useNavigate } from "react-router-dom";
import {
  faUser,
    faEnvelope,
  faPhone,
  faLock,
  faUserTag,
  faIdCard,
  faStethoscope,
  faSignInAlt,
  faUserPlus,
} from "@fortawesome/free-solid-svg-icons";

const ClinicAuth = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isSignIn, setIsSignIn] = useState(true);
  const [userRole, setUserRole] = useState("patient");
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    licenseNumber: "",
    specialization: "",
    phone: ""
  });

  useEffect(() => {
    if (location.pathname == "/login") {
      setIsSignIn(true);
    } else {
      setIsSignIn(false);
    }
  }, [location.pathname]);
  const { setUser, user } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isSignIn && formData.password !== formData.confirmPassword) {
      //   toaster.create({
      //     type: 'error',
      //     title: 'Password mismatch',
      //     description: 'Passwords do not match.',
      //     meta: { closable: true }
      //   });
      toast.error("Passwords do not match.");
      return;
    }

    try {
      const { email, password, fullName, phone } = formData;
      //   const username = email.split('@')[0];

        if (!isSignIn) {
          // TODO: Remove After Test
        // await axios.post("http://localhost:3000/login-return", {
        //   email,
        //   password,
        //   role: "patient",
        //   isLoggedIn: true,
        // });
        await axios.post("https://localhost:7195/api/Auth/Register", {
            email,
            name: fullName,
            password,
          phone,
        });
      }
    //   const response = await axios.get("http://localhost:3000/login-return");
        const response = await axios.post("https://localhost:7195/api/Auth/Login",
            {
                password,
                email
          }
        ).then((data) =>
        {
            const matchedUser = data.data;
            console.log(matchedUser);
            
            if (!matchedUser) {
                toast.error("Username or password is incorrect.");
                return;
            }

            if (matchedUser) {
              matchedUser.role = matchedUser.role.toLowerCase();
              // To-Do: Enable to set user in context
              setUser({
                email: matchedUser.email,
                id: matchedUser.id,
                token: matchedUser.token,
                isLoggedIn: matchedUser.isLoggedIN,
                role: matchedUser.role,
                name: matchedUser.name,
              });
              localStorage.setItem(
                "user",
                JSON.stringify({
                  email: matchedUser.email,
                  id: matchedUser.id,
                  token: matchedUser.token,
                  isLoggedIn: matchedUser.isLoggedIN,
                  role: matchedUser.role,
                  name: matchedUser.name,
                })
              );
              console.log(localStorage.getItem("user"));
              switch (matchedUser.role) {
                case "admin":
                  navigate("/admin/dashboard");
                  break;
                case "patient":
                  navigate("/");
                  break;
                case "doctor":
                  navigate("/");
                  break;
              }
            }

            
      toast.success(`${isSignIn ? "Login" : "Registration"} successful!`);
            
    });

      // To-Do: store user in local storage
      // To-Do: navigate user to its home page
      // eslint-disable-next-line no-unused-vars
    } catch (error) {
      //   toaster.create({
      //     type: 'error',
      //     title: isSignIn ? 'Login failed' : 'Registration failed',
      //     description: `Something went wrong while ${isSignIn ? 'logging in' : 'registering'}.`,
      //     meta: { closable: true }
      //   });
      toast.error(
        `Something went wrong while ${isSignIn ? "logging in" : "registering"}.`
      );
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
          <button
            className={`tab ${isSignIn ? "active" : ""}`}
            onClick={() => {
              navigate("/login");
            }}
          >
            Sign In
          </button>
          <button
            className={`tab ${!isSignIn ? "active" : ""}`}
            onClick={() => navigate("/register")}
          >
            Sign Up
          </button>
          <div
            className={`tab-indicator ${isSignIn ? "sign-in" : "sign-up"}`}
          />
        </div>

        <form
          onSubmit={handleSubmit}
          className={`auth-form ${isSignIn ? "sign-in" : "sign-up"}`}
        >
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
                  placeholder={
                    userRole === "doctor" ? "Dr. John Smith" : "John Smith"
                  }
                />
                <FontAwesomeIcon icon={faUser} className="input-icon" />
              </div>

              <div className="form-group">
                <label htmlFor="phone">Phone</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  placeholder="+20114545788"
                />
                <FontAwesomeIcon icon={faPhone} className="input-icon" />
              </div>

              {/* To-Do: To be Removed */}
              {/* <div className="form-group">
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
              </div> */}

              {userRole === "doctor" && !isSignIn && (
                <>
                  <div className="form-group">
                    <label htmlFor="licenseNumber">
                      Medical License Number
                    </label>
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
                    <FontAwesomeIcon
                      icon={faStethoscope}
                      className="input-icon"
                    />
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
            {isSignIn ? "Sign In" : "Create Account"}
            {/* <FontAwesomeIcon
              icon={isSignIn ? faSignInAlt : faUserPlus}
              className="btn-icon"
            /> */}
          </button>
        </form>

        <div className="auth-footer">
          {isSignIn ? (
            <p>
              Don't have an account?{" "}
              <button
                type="button"
                onClick={() => navigate("/register")}
                className="toggle-btn"
              >
                Register here
              </button>
            </p>
          ) : (
            <p>
              Already registered?{" "}
              <button
                type="button"
                onClick={() => navigate("/login")}
                className="toggle-btn"
              >
                Sign in here
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClinicAuth;
