import { Link, useLocation } from 'react-router-dom';
import { LogOut, MessageSquare, User } from 'lucide-react';
import { useAuth } from '../../Context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  return (
    <nav className="admin-navbar navbar-expand-lg">
      <div className="admin-navbar-container">
 
        <Link to="/admin" className="admin-navbar-brand">
          <img 
            src="/assets/logo.jpg" 
            alt="Clinic Logo" 
            className="admin-navbar-logo" 
          />
          <span>Clinic Admin</span>
        </Link>

        <button className="admin-navbar-toggle" type="button">
          <span className="admin-navbar-toggle-icon"></span>
        </button>


        <div className="admin-navbar-content">
          <div className="admin-navbar-center">
            <Link 
              to="/admin/dashboard" 
              className={`admin-nav-link ${location.pathname === '/admin/dashboard' ? 'active' : ''}`}
            >
              Dashboard
            </Link>
            <Link 
              to="/admin/doctors" 
              className={`admin-nav-link ${location.pathname === '/admin/doctors' ? 'active' : ''}`}
            >
              Doctors
            </Link>
            <Link 
              to="/admin/appointments" 
              className={`admin-nav-link ${location.pathname === '/admin/appointments' ? 'active' : ''}`}
            >
              Appointments
            </Link>
          </div>

          
          <div className="admin-navbar-right">
            <button className="admin-nav-icon">
              <MessageSquare size={20} />
            </button>
            <div className="admin-nav-profile">
              <User size={20} />
            </div>
            <button onClick={logout} className="admin-nav-logout">
              <LogOut size={18} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;