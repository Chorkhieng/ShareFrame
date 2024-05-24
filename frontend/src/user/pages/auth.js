import React, { useContext, useState } from 'react';

import Card from '../../shared/components/UIElements/Card';
import Input from '../../shared/components/FormElements/Input';
import Button from '../../shared/components/FormElements/Button';
import {
    VALIDATOR_EMAIL,
    VALIDATOR_MINLENGTH,
    VALIDATOR_REQUIRE
} from '../../shared/util/validators';
import { useForm } from '../../shared/hooks/form-hook';
import { AuthContext } from '../../shared/context/auth_context';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import { useHTTPClient } from '../../shared/hooks/http-hook';

import './Auth.css';

const Auth = () => {
    const auth = useContext(AuthContext);
    const {isLoading, error, sendRequest, clearError} = useHTTPClient();

    const [formState, inputHandler, setFormData] = useForm({
        email: {
            value: '',
            isValid: false
        },
        password: {
            value: '',
            isValid: false
        }
    }, false);

    const [isLoginMode, setIsLoginMode] = useState(true);

    const switchModeHandler = () => {
        if (!isLoginMode) {
            setFormData({
                ...formState.inputs,
                name: undefined
            }, formState.inputs.email.isValid && formState.inputs.password.isValid);
        }
        else {
            setFormData({
                ...formState.inputs,
                name: {
                    value: '',
                    isValid: false
                }
            }, false);
        }
        setIsLoginMode(prevMode => !prevMode);
    }   


    const authSubmitHandler = async (event) => {
        event.preventDefault();

        if (isLoginMode) {
            try {

                const responseData = await sendRequest(
                    'http://localhost:4000/api/users/login',
                    'POST',
                    JSON.stringify({
                        email: formState.inputs.email.value,
                        password: formState.inputs.password.value
                    }),
                    {
                        'Content-Type': 'application/json'
                    });

                auth.login(responseData.user.id);
            }
            catch (err) {
                
            }
        }
        else {
            try {

                const responseData = await sendRequest('http://localhost:4000/api/users/signup',
                    'POST',
                    JSON.stringify({
                        name: formState.inputs.name.value,
                        email: formState.inputs.email.value,
                        password: formState.inputs.password.value
                    }),
                    {
                        'Content-Type': 'application/json'
                    });

                auth.login(responseData.user.id);
            }
            catch (err) {} 
        }
    };

    return <React.Fragment>
        <ErrorModal error={error} onClear={clearError} />
        <Card className="authentication">
            {isLoading && <LoadingSpinner asOverlay />}
            <h2>Login Required</h2>
            <form onSubmit={authSubmitHandler}>
                {!isLoginMode && (<Input
                                    element="input"
                                    id="name"
                                    type="text"
                                    label="You Name"
                                    validators={[VALIDATOR_REQUIRE()]}
                                    errorText="Please enter a name."
                                    onInput={inputHandler}
                                />)
                }
                <Input 
                    element="input"
                    id="email"
                    type="email"
                    label="E-Mail"
                    validators={[VALIDATOR_EMAIL()]}
                    errorText="Please enter a valid email address."
                    onInput={inputHandler}
                />

                <Input 
                    element="input"
                    id="password"
                    type="password"
                    label="Password"
                    validators={[VALIDATOR_MINLENGTH(8)]}
                    errorText="Please enter a valid password. Your password must be at least 8 charactor-long."
                    onInput={inputHandler}
                />

                <Button type="submit" disabled={!formState.isValid} >
                    {isLoginMode ? 'LOGIN' : 'SIGNUP'}
                </Button>
            </form>
            <Button inverse onClick={switchModeHandler}>
                SWITCH TO {isLoginMode ? 'SIGNUP' : 'LOGIN'}
            </Button>
        </Card>
    </React.Fragment>;
};


export default Auth;