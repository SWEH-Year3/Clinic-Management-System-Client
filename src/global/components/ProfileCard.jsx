import React, { useEffect, useState } from 'react';
import { Button, Card, Row, Col, Spinner, Form, Alert } from 'react-bootstrap';
import { useAuth } from "./../../Context/AuthContext";
import axios from 'axios';

const ProfileCard = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [editedProfile, setEditedProfile] = useState({});
  const [successMessage, setSuccessMessage] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        if (!user?.isLoggedIn) return;

        setLoading(true);
        setError(null);
        let profileData = null;

        if (user.role === 'doctor') {
          const response = await axios.get(`http://localhost:3000/doctors/${user.id}`);
          profileData = response.data || {};
          
          if (profileData.price) {
            profileData.price = Number(profileData.price);
          }
        } else if (user.role === 'patient') {
          const response = await axios.get(`http://localhost:3000/patients/${user.id}`);
          profileData = response.data || {};
        } else if (user.role === 'admin') {
          profileData = {
            name: user.name,
            email: user.email,
            phone: 'Not specified',
            role: 'admin'
          };
        }

        if (profileData) {
          setProfile(profileData);
          setEditedProfile({...profileData});
        } else {
          setError("Profile not found");
        }
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch profile");
        console.error("Error fetching profile:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user]);

  

  const handleEditToggle = () => {
    if (editMode) {
      setEditedProfile({...profile});
    }
    setEditMode(!editMode);
    setSuccessMessage(null);
    setError(null);
  };

  const handleInputChange = (field, value) => {
    setEditedProfile(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      setError(null);
      
      if (user.role === 'doctor') {
        await axios.patch(`http://localhost:3000/doctors/${user.id}`, editedProfile);
      } else if (user.role === 'patient') {
        await axios.patch(`http://localhost:3000/patients/${user.id}`, editedProfile);
      }
      
      // Update local profile state with edited values
      setProfile({...editedProfile});
      setEditMode(false);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update profile");
      console.error("Error updating profile:", err);
    } finally {
      setLoading(false);
    }
  };

  const getProfileFields = () => {
    if (!profile) return [];
    
    const baseFields = [
      { label: 'Name', field: 'name', value: profile.name || 'Not provided' },
      { label: 'Email', field: 'email', value: profile.email || 'Not provided' },
      { label: 'Phone', field: 'phone', value: profile.phone || 'Not provided' }
    ];

    if (user?.role === 'doctor') {
      return [
        ...baseFields,
        { label: 'Specialty', field: 'specialty', value: profile.specialty || 'Not specified' },
        { 
          label: 'Price', 
          field: 'price', 
          value: profile.price 
            ? `$${typeof profile.price === 'number' ? profile.price.toFixed(2) : profile.price}` 
            : 'Not specified' 
        }
      ];
    }

    return baseFields;
  };

  if (loading) {
    return (
      <div className="text-center mt-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center mt-5">
        <Alert variant="danger">{error}</Alert>
      </div>
    );
  }

  if (!user?.isLoggedIn) {
    return <div className="text-center mt-5">Please log in to view your profile</div>;
  }

  return (
    <Card className="shadow" style={{
      maxWidth: '870px',
      height: '695px',
      margin: '0 auto',
      borderRadius: '12px',
      overflow: 'hidden',
      border: 'none'
    }}>
      <Row className="g-0 h-100">
        <Col md={6} className="p-5 d-flex flex-column" style={{
          backgroundColor: '#4A6572'
        }}>
          <Card.Title className="mb-5" style={{
            color: '#1A2D42',
            fontFamily: "'Kameron', serif",
            fontSize: '40px',
            fontWeight: '700',
            textAlign: 'center'
          }}>
            Profile
          </Card.Title>
          
          {successMessage && (
            <Alert variant="success" className="mb-3">
              {successMessage}
            </Alert>
          )}
          
          {getProfileFields().map((item, index) => (
            <div key={index} className="mb-3 ps-2">
              <span className="fw-bold" style={{ color: '#1A2D42' }}>{item.label}</span>
              {editMode ? (
                <Form.Control
                  type="text"
                  value={editedProfile[item.field] || ''}
                  onChange={(e) => handleInputChange(item.field, e.target.value)}
                  className="ms-3"
                  style={{ width: '90%' }}
                />
              ) : (
                <p className="text-white mb-0 ms-3" style={{ fontSize: '16px' }}>
                  {editedProfile[item.field] || item.value}
                </p>
              )}
            </div>
          ))}
          
          <div className="mt-auto d-flex justify-content-center gap-3">
            <Button 
              variant={editMode ? "outline-light" : "dark"}
              onClick={handleEditToggle}
              style={{ 
                width: '160px',
                height: '54px', 
                borderRadius: '10px', 
                fontWeight: '500',
                fontSize: '16px',
                backgroundColor: editMode ? 'transparent' : '#1A2D42',
                borderColor: editMode ? '#fff' : '#1A2D42'
              }}
            >
              {editMode ? 'Cancel' : 'Edit'}
            </Button>
            
            {editMode && (
              <Button 
                variant="dark"
                onClick={handleSave}
                disabled={loading}
                style={{ 
                  width: '160px',
                  height: '54px', 
                  borderRadius: '10px', 
                  fontWeight: '500',
                  fontSize: '16px',
                  backgroundColor: '#1A2D42'
                }}
              >
                {loading ? 'Saving...' : 'Save'}
              </Button>
            )}
          </div>
        </Col>
        
        {/* Image */}
        <Col md={6} className="h-100" style={{ backgroundColor: 'white' }}>
          <Card.Img 
            src="/assets/avatar.png" 
            alt="Profile"
            className="h-100 w-100"
            style={{ objectFit: 'cover' }}
          />
        </Col>
      </Row>
    </Card>
  );
};

export default ProfileCard;