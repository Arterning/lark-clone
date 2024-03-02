import React, { FC, useEffect, useState } from 'react';
import {BrowserRouter as Router, Route, Switch, Link} from 'react-router-dom'
import Todo from "./pages/Todo"
import Login from "./pages/Login"
import AuthContext from "./contexts/AuthContext"
import useAuth from "./hooks/useAuth"
import PrivateRoute from "./Components/PrivateRoute"
import Admin from './pages/Admin';
import AdminRoute from './Components/AdminRoute';
import HomePage from './pages/Home';
import UserProfilePage from "./pages/Profile";

const App: FC = () => {
  const auth = useAuth();

  return (
    <AuthContext.Provider value={auth}>
      <Router>
        <div>
          <Switch>
            <PrivateRoute exact path="/">
              <HomePage />
            </PrivateRoute>
            <PrivateRoute exact path="/owned">
              <Todo todoType='owned'/>
            </PrivateRoute>
            <PrivateRoute exact path="/following">
              <Todo todoType='following'/>
            </PrivateRoute>
            <PrivateRoute exact path="/all">
              <Todo todoType='all'/>
            </PrivateRoute>
            <PrivateRoute exact path="/created">
              <Todo todoType='created'/>
            </PrivateRoute>
            <PrivateRoute exact path="/assigned">
              <Todo todoType='assigned'/>
            </PrivateRoute>
            <PrivateRoute exact path="/finished">
              <Todo todoType='finished'/>
            </PrivateRoute>
            <PrivateRoute exact path="/profile">
              <UserProfilePage />
            </PrivateRoute>
            <Route path="/login">
              <Login />
            </Route>
            <AdminRoute path="/admin">
              <Admin />
            </AdminRoute>
          </Switch>
        </div>
      </Router>
    </AuthContext.Provider>
  );
};

export default App;
