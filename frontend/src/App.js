import React, {useState, useCallback} from 'react';
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch
} from 'react-router-dom';

import Users from './user/pages/Users';
import NewPlace from './places/pages/NewPlace';
import UserPlaces from './places/pages/UserPlaces';
import MainNavigation from './shared/components/Navigation/MainNavigation';
import UpdatePlace from './places/pages/UpdatePlace';
import Auth from './user/pages/auth';
import { AuthContext } from './shared/context/auth_context';

import { useEffect } from 'react';


const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userId, setUserId] = useState(false);

  useEffect(() => {
    // Check for session token in session storage
    const sessionToken = sessionStorage.getItem('sessionToken');
    if (sessionToken) {
      setIsLoggedIn(true);
      setUserId(sessionToken); // Assuming your session token is the user ID
    }
  }, []);

  const login = useCallback((uid) => {
    setIsLoggedIn(true);
    setUserId(uid);

    // Store session token in session storage
    sessionStorage.setItem('sessionToken', uid);
  }, []);

  const logout = useCallback(() => {
    setIsLoggedIn(false);
    setUserId(null);

    // Clear session token from session storage
    sessionStorage.removeItem('sessionToken');
  }, []);


  let routes;
  if (isLoggedIn) {
    routes = (
      <Switch>
        <Route path="/" exact>
          <Users />
        </Route>

        <Route path="/:userId/places" exact>
          <UserPlaces />
        </Route>

        <Route path="/places/new" exact>
          <NewPlace />
        </Route>

        <Route path="/places/:placeId">
          <UpdatePlace />
        </Route>

        <Redirect to="/" />

      </Switch>
      
    );
  }
  else {
    routes = (
      <Switch>
        <Route path="/" exact>
          <Users />
        </Route>

        <Route path="/:userId/places" exact>
          <UserPlaces />
        </Route>

        <Route path="/auth" >
          <Auth />
        </Route>

        <Redirect to="/auth" />
      </Switch>
      
    );
  }


  return (
    <AuthContext.Provider value={{isLoggedIn: isLoggedIn, userId: userId, login: login, logout: logout}}>
      <Router>
        <MainNavigation />
        <main>
           {routes}
        </main>
      </Router>
    </AuthContext.Provider>
  );
};

export default App;
