import React from 'react';

import Input from '../../shared/components/FormElements/Input';
import Button from '../../shared/components/FormElements/Button';
import {
  VALIDATOR_REQUIRE,
  VALIDATOR_MINLENGTH
} from '../../shared/util/validators';
import { useForm } from '../../shared/hooks/form-hook';
import { useHTTPClient } from '../../shared/hooks/http-hook';
import { useContext } from 'react';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import { AuthContext } from '../../shared/context/auth_context';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import ImageUplaod from '../../shared/components/FormElements/ImageUpload';
import './PlaceForm.css';

const NewPlace = () => {
  const auth = useContext(AuthContext);
  const {isLoading, error, sendRequest, clearError} =  useHTTPClient();
  const [formState, inputHandler] = useForm(
    {
      title: {
        value: '',
        isValid: false
      },
      description: {
        value: '',
        isValid: false
      },
      address: {
        value: '',
        isValid: false
      },
      image: {
        value: null,
        isValid: false
      }
    },
    false
  );


  const history = useHistory();

  const placeSubmitHandler = async event => {
    event.preventDefault();
    
    try {

      const formData = new FormData();
      formData.append('title', formState.inputs.title.value);
      formData.append('description', formState.inputs.description.value);
      formData.append('address', formState.inputs.address.value);
      formData.append('creator', auth.userId);
      formData.append('image', formState.inputs.image.value);

      await sendRequest(
        'http://localhost:4000/api/places',
        'POST',
        formData
      );

      // await sendRequest('http://localhost:4000/api/places',
      //           'POST',
      //           JSON.stringify({
      //             title: formState.inputs.title.value,
      //             description: formState.inputs.description.value,
      //             address: formState.inputs.address.value,
      //             creator: auth.userId
      //           }),
      //           { 'Content-Type': 'application/json'}
      //     );

      history.push('/');
    }
    catch (err) {}
    
  };

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      <form className="place-form" onSubmit={placeSubmitHandler}>
        {isLoading && <LoadingSpinner asOVerlay />}
        <Input
          id="title"
          element="input"
          type="text"
          label="Title"
          validators={[VALIDATOR_REQUIRE()]}
          errorText="Please enter a valid title."
          onInput={inputHandler}
        />
        <Input
          id="description"
          element="textarea"
          label="Description"
          validators={[VALIDATOR_MINLENGTH(5)]}
          errorText="Please enter a valid description (at least 5 characters)."
          onInput={inputHandler}
        />
        <Input
          id="address"
          element="input"
          label="Address"
          validators={[VALIDATOR_REQUIRE()]}
          errorText="Please enter a valid address."
          onInput={inputHandler}
        />
        <ImageUplaod 
          id="image" 
          onInput={inputHandler} 
          errorText="Please upload an image."
        />
        <Button type="submit" disabled={!formState.isValid}>
          ADD PLACE
        </Button>
      </form>
      </React.Fragment>
  );
};

export default NewPlace;
