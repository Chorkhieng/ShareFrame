import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { AuthContext } from '../../context/auth_context';

import './NavLinks.css';

const NavLinks = props => {
  const auth = useContext(AuthContext);

  return <ul className="nav-links">
    {auth.isLoggedIn && <li>
      <NavLink to="/" exact>Other Users</NavLink>
    </li>}

    {auth.isLoggedIn && (<li>
      <NavLink to={`/${auth.userId}/places`}>My Posts</NavLink>
    </li>)}

    {auth.isLoggedIn && (<li>
      <NavLink to="/places/new">Create Post</NavLink>
    </li>)}

    {!auth.isLoggedIn && (<li>
      <NavLink to="/auth">LogIn / SignUp</NavLink>
    </li>)}

    {auth.isLoggedIn && (
      <li>
        <button onClick={auth.logout}>SignOut</button>
      </li>
    )}

  </ul>
};

export default NavLinks;