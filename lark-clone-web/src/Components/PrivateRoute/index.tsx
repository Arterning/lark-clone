import * as React from "react"
import { FC, useContext } from 'react';
import {RouteProps, Redirect, Route} from "react-router-dom"
import AuthContext from '../../contexts/AuthContext';
import SideBar from "../SideBar";
import NavBar from "../NavBar";

interface Props extends RouteProps{
}

/**
 * 只有登录才可以访问
 * @param props
 * @constructor
 */
const PrivateRoute: FC<Props> = (props) => {
  const { children, ...rest } = props;

  const { token } = useContext(AuthContext);

  const renderRoute = ({location}: any) => {
    if (!token) {
      return <Redirect to={{ pathname: "/login", state: { from: location } }} />
    }

    return (
      <div style={{
        padding: '10px',
      }}>
        <NavBar/>
        <SideBar/>
        <div className="main">
          {children}
        </div>
      </div>
    );
  }

  return (
    <Route {...rest} render={renderRoute} />
  );
}

export default PrivateRoute
