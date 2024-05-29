import React from "react";
import Card from "./Card";
import './Profile.css';
import Avatar from "./Avatar";

const Profile = props => {
    return (<React.Fragment>
        <Card className="card profile-card">
          <Avatar className="avatar profile-image" image={`${props.image}`} alt={props.name} />
            <Card className="card profile-name">
                <h1>{props.name}</h1>
            </Card>
          </Card>
      </React.Fragment>);
};

export default Profile;