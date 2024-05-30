import React from 'react';
import Card from './Card';
import './Profile.css';
import Avatar from './Avatar';

const Profile = props => {
  if (!props.show) {
    return null;
  }

  return (
    <React.Fragment>
      <Card className="card profile-card">
        <Avatar 
          image={props.image} 
          alt={props.name} 
          width="200px" 
          height="200px" 
          style={{ 
            border: '10px solid gray', 
            borderRadius: '50%',
          }}
        />
        <Card className="card profile-name">
          <h2>{props.name}</h2>
          <p>{props.createdAt}</p>
        </Card>
      </Card>
    </React.Fragment>
  );
};

export default Profile;
