import React from 'react';
import { useParams } from 'react-router-dom';
import { VALIDATOR_MINLENGTH, VALIDATOR_REQUIRE } from '../../shared/util/validators';
import Input from '../../shared/components/FormElements/Input';
import Button from '../../shared/components/FormElements/Button';
import { useForm } from '../../shared/hooks/form-hook';

import './PlaceForm.css';


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
      
        const identifiedPlace = DUMMY_PLACES.find(p => p.id === placeId);
      
        const [formState, inputHandler] = useForm(
          {
            title: {
              value: identifiedPlace.title,
              isValid: true
            },
            description: {
              value: identifiedPlace.description,
              isValid: true
            }
          },
          true
        );
      
        const placeUpdateSubmitHandler = event => {
          event.preventDefault();
          console.log(formState.inputs);
        };
      
        if (!identifiedPlace) {
          return (
            <div className="center">
              <h2>Could not find place!</h2>
            </div>
          );
        }
      
        return (
          <form className="place-form" onSubmit={placeUpdateSubmitHandler}>
            <Input
              id="title"
              element="input"
              type="text"
              label="Title"
              validators={[VALIDATOR_REQUIRE()]}
              errorText="Please enter a valid title."
              onInput={inputHandler}
              initialValue={formState.inputs.title.value}
              initialValid={formState.inputs.title.isValid}
            />
            <Input
              id="description"
              element="textarea"
              label="Description"
              validators={[VALIDATOR_MINLENGTH(5)]}
              errorText="Please enter a valid description (min. 5 characters)."
              onInput={inputHandler}
              initialValue={formState.inputs.description.value}
              initialValid={formState.inputs.description.isValid}
            />
            <Button type="submit" disabled={!formState.isValid}>
              UPDATE PLACE
            </Button>
          </form>
        );
      };
      
      export default UpdatePlace;
      