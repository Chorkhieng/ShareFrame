import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { AuthContext } from '../../context/auth_context';

import './NavLinks.css';

const NavLinks = props => {
  const auth = useContext(AuthContext);

  return <ul className="nav-links">
    {auth.isLoggedIn && <li>
      <NavLink to="/all" exact>HOME FEED</NavLink>
    </li>}

    {auth.isLoggedIn && <li>
      <NavLink to="/" exact>BROWSE USERS</NavLink>
    </li>}

    {auth.isLoggedIn && (<li>
      <NavLink to={`/${auth.userId}/posts`}>MY PROFILE</NavLink>
    </li>)}

    {auth.isLoggedIn && (<li>
      <NavLink to="/posts/new">CREATE POST</NavLink>
    </li>)}

    {!auth.isLoggedIn && (<li>
      <NavLink to="/auth">LOGIN OR SIGNUP</NavLink>
    </li>)}

    {auth.isLoggedIn && (
      <li>
        <NavLink onClick={auth.logout} to="/demo">SIGNOUT</NavLink>
      </li>
    )}

  </ul>
};

export default NavLinks;