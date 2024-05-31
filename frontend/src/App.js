import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch
} from 'react-router-dom';

import Users from './user/pages/Users';
import NewPost from './posts/pages/NewPost';
import UserPosts from './posts/pages/UserPosts';
import UpdatePost from './posts/pages/UpdatePost';
import Auth from './user/pages/auth';
import MainNavigation from './shared/components/Navigation/MainNavigation';
import { AuthContext } from './shared/context/auth_context';
import { useAuth } from './shared/hooks/auth-hook';
import PageDemo from './demo/PageDemo';
import AllPosts from './posts/pages/AllPosts';

const App = () => {
  const {token, login, logout, userId, name, image} = useAuth();

  let routes;

  if (token) {
    routes = (
      <Switch>
        <Route path="/all" exact>
          <AllPosts />
        </Route>
        <Route path="/" exact>
          <Users />
        </Route>
        <Route path="/:userId/posts" exact>
          <UserPosts />
        </Route>
        <Route path="/posts/new" exact>
          <NewPost />
        </Route>
        <Route path="/posts/:postId">
          <UpdatePost />
        </Route>
        <Redirect to="/all" />
      </Switch>
    );
  } else {
    routes = (
      <Switch>
        {/* <Route path="/" exact>
          <Users />
        </Route> */}
        <Route path="/:userId/posts" exact>
          <UserPosts />
        </Route>
        <Route path="/auth">
          <Auth />
        </Route>
        <Route>
          <PageDemo />
        </Route>
        <Redirect to="/demo" />
      </Switch>
    );
  }

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn: !!token,
        token: token,
        userId: userId,
        image: image,
        name: name,
        login: login,
        logout: logout
      }}
    >
      <Router>
        <MainNavigation />
        <main>{routes}</main>
      </Router>
    </AuthContext.Provider>
  );
};

export default App;
