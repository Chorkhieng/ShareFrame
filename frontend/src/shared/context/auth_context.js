import { createContext } from 'react';


export const AuthContext = createContext({
    isLoggedIn: false,
    userId: null,
    token: null,
    // name: null, // This is a TODO LATER for creatorName display
    login: () => {},
    logout: () => {}
});
