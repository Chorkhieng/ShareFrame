import React from "react";
import Card from "./Card";
import './Profile.css';
import Avatar from "./Avatar";

const Profile = props => {
    if (!props.show) {
      return null;
    }

    return (<React.Fragment>
        <Card className="card profile-card">
          <Avatar className="avatar profile-image" image={props.image} alt={props.name} />
            <Card className="card profile-name">
                <h1>{props.name}</h1>
                <p>{props.createdAt}</p>
            </Card>
          </Card>
      </React.Fragment>);
};

export default Profile;