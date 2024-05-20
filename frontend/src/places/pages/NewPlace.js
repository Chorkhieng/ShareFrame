import React, { useCallback } from 'react';

import Input from '../../shared/components/FormElements/Input';
import { VALIDATOR_REQUIRE } from '../../shared/util/validators';

import './NewPlace.css';

const NewPlace = () => {
  const titleInputHandler = useCallback((id, value, isValid) => {
    
  }, []);

  const descriptionInputHandler = useCallback((id, value, isValid) => {
    
  }, []);

  return <form className="place-form">
    <Input 
      id="title"
      type="text"
      element="textarea"
      label="Title" 
      validators={[VALIDATOR_REQUIRE()]}
      errorText="Please enter a valid title." 
      onInput={titleInputHandler}
    />

    <Input 
      id="description"
      element="textarea"
      label="Description" 
      validators={[VALIDATOR_REQUIRE()]}
      errorText="Please enter a valid description." 
      onInput={descriptionInputHandler}
    />
  </form>
};

export default NewPlace;