import React from 'react';
import { useParams } from 'react-router-dom';
import { VALIDATOR_MINLENGTH, VALIDATOR_REQUIRE } from '../../shared/util/validators';
import Input from '../../shared/components/FormElements/Input';
import Button from '../../shared/components/FormElements/Button';


const DUMMY_PLACES = [
    {
        id: "p1",
        title: "Angkor Watt", 
        description: "One of the most complex ancient structures in the world.",
        imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/20171126_Angkor_Wat_4712_DxO.jpg/1024px-20171126_Angkor_Wat_4712_DxO.jpg",
        address: "Krong Siem Reap, Cambodia",
        location: {
            lat: 13.412474505050575, 
            lng: 103.866808669721
        },
        creator: 'u1'
    }];

const UpdatePlace = () => {
    const placeId = useParams().placeId;

    const identfiedPlace = DUMMY_PLACES.find(p => p.id === placeId);

    if (!identfiedPlace) {
       return ( <div className="center">
            <h2>Could not find place!</h2>
        </div>);
    }
    return (
        <form>
            <Input 
                id="title" 
                element="input" 
                type="text" 
                validators={[VALIDATOR_REQUIRE()]}
                errorText="Please enter a valid title"
                onInput={() => {}}
                value={identfiedPlace.title}
                valid={true}
            />

            <Input 
                id="description" 
                element="textarea" 
                label="Description" 
                validators={[VALIDATOR_MINLENGTH(5)]} 
                errorText="Please enter a valid description (at least 5 charactors)."
                onInput={() => {}}
                value={identfiedPlace.description}
                valid={true}
            />

            <Button type="submit" disabled={true}>
                UPDATE PLACE
            </Button>
        </form>
    );
};

export default UpdatePlace;