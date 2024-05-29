import React, { useContext } from 'react';
import Card from '../../shared/components/UIElements/Card';
import PlaceItem from './PlaceItem';
import Button from '../../shared/components/FormElements/Button';
import { AuthContext } from '../../shared/context/auth_context';

import './PlaceList.css';
import Profile from '../../shared/components/UIElements/Profile';

const PlaceList = props => {
    const auth = useContext(AuthContext);
    if (!props.items || props.items.length === 0) {
        return <div className="place-list center">
            <Card>
                <h2> No post found.</h2>
                {auth.userId && <Button to="/places/new">Create a Post</Button>}
            </Card>
        </div>
    }

    const { authorImage, authorName} = props.items[0];

    // console.log("author img and name: ", authorImage, authorName);

    return (
        <React.Fragment>
            <Profile 
                image={authorImage}
                name={authorName}
                show={props.showProfile}
            />
            <ul className="place-list">
                {props.items.map(place => 
                    (<PlaceItem 
                        key={place.id} 
                        id={place.id} 
                        image={place.image} 
                        title={place.title} 
                        description={place.description} 
                        creatorId={place.creator} 
                        authorImage={place.authorImage}
                        authorName={place.authorName}
                        onDelete={props.onDeletePlace}
                    />))
                }
            </ul>
        </React.Fragment>);
};

export default PlaceList;