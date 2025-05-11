/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
import React, {useRef} from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "./../../Context/AuthContext";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCommentDots } from "@fortawesome/free-solid-svg-icons";

const Navbar = () => {
    const { user, logout } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();
    const dropdownRef = useRef(null);

    const renderCenterLinks = () => {
        if (!user?.isLoggedIn) {
            return (
                <>

                        <NavItem  to="/" label="Home"  />
                    

                        <NavItem  to="/about" label="About" />
                    
                </>
            );
        }

        switch (user.role) {
            case "doctor":
                return (
                    <>

                            <NavItem  to="/" label="Home" />

                            <NavItem  to="/about" label="About" />
                        

                            <NavItem  to={`/appointments`} label="Appointments" />
                        
                    </>
                );
            case "admin":
                return (
                    <>

                            <NavItem  to={`/${user.role}/dashboard`} label="Dashboard" />

                            <NavItem  to={`/doctors`} label="Doctor List" />
                        

                            <NavItem  to={`/appointments`} label="Appointments" />
                        
                    </>
                );
            case "patient":
                return (
                    <>
                            <NavItem  to="/" label="Home" />
                        
                            <NavItem  to={`/doctors`} label="Doctor List" />
                        

                            <NavItem  to="/about" label="About" />
                        
                            <NavItem  to={`/appointments`} label="Appointments" />
                        
                    </>
                );
            default:
                return null;
        }
    };

    const renderRightLinks = () => {
        if (!user?.isLoggedIn) {
            return (
                <>
                    {location.pathname !== "/login" && (
                        <NavItem  to="/login" label="Login" />
                        
                    )}
                    {location.pathname !== "/register" && (
                        <NavItem  to="/register" label="Register" />
                    )}
                </>
            );
        }

        const handleBurgerClick = () => {
            let style = window.getComputedStyle(document.getElementById('burger-nav'));
            if (style.display !== 'none') document.getElementById('burger-nav').click();

        };
        return (
            <div className="d-flex align-items-center ">
                {(user.role !== "admin") && (

                <li className="nav-item d-flex align-items-center" onClick={handleBurgerClick}>
                    <Link to={"/chat"} style={{ textDecoration: "none" }}>
                        <FontAwesomeIcon icon={faCommentDots} style={{ width: "25px", height: "25px", color: "#1A2142" }} />
                    </Link>
                </li>
                )}
                <li className="nav-item" onClick={handleBurgerClick}>
                    <Link to="/profile">
                        <img
                            src="assets/avatar.png"
                            alt="profile"
                            style={{
                                maxWidth: "40px",
                                marginLeft: "10px",
                                marginRight: "10px",
                                cursor: "pointer" // Adds pointer cursor on hover
                            }}
                        />
                    </Link>
                </li>
                <li className="nav-item" onClick={handleBurgerClick}>
                    <span className=" ms-2" style={{ fontWeight: "bold", color: "#1A2142", cursor: 'pointer' }} onClick={() => {
                        navigate("/");
                        logout();
                    }}>
                        Logout
                    </span>
                </li>
            </div>
        );
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light shadow-sm">
            <div className="container-fluid">
                {/* Left: Logo */}
                <Link className="navbar-brand" to="/">
                    <img src="assets/logo.jpg" alt="Logo" style={{ borderRadius: "50%", maxWidth: "50px", boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)" }} />
                </Link>

                {/* Toggle button for mobile */}
                <button
                    ref={dropdownRef}
                    id="burger-nav"
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarContent"
                    aria-controls="navbarContent"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon" />
                </button>

                {/* Navbar Content */}
                <div className="collapse navbar-collapse " id="navbarContent">
                    {/* Centered nav */}
                    <div className="d-lg-flex w-100">
                        <ul className="navbar-nav mx-auto mb-2 mb-lg-0 ">{renderCenterLinks()}</ul>
                    </div>

                    {/* Right-aligned links */}
                    <ul className="navbar-nav ms-auto mb-2 mb-lg-0 d-flex flex-row gap-2 ">
                        {renderRightLinks()}
                    </ul>
                </div>
            </div>
        </nav>
    );
};

const NavItem = ({ to, label }) => {
    
    const handleBurgerClick = () => {
        let style = window.getComputedStyle(document.getElementById('burger-nav'));
        if(style.display !== 'none') document.getElementById('burger-nav').click();
        
    };
    return(
    // <li className="nav-item" onClick={() => { document.getElementById('burger-nav').click(); }}>
    <li className="nav-item" onClick={handleBurgerClick}>
        <Link className="nav-link fw-semibold text-dark" to={to}>
            {label}
        </Link>
    </li>
)};

export default Navbar;