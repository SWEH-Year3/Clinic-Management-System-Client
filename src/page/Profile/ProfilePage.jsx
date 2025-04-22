import React from 'react';
import { Container } from 'react-bootstrap';
import ProfileCard from '../../global/components/ProfileCard';


const ProfilePage = () => {
  return (

      
      <Container className="py-5">
        
        <div className="d-flex justify-content-center">
          <ProfileCard />
        </div>
        
      </Container>

  );
};

export default ProfilePage;