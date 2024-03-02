import { FC, useContext } from 'react';
import { Redirect, RouteProps } from 'react-router-dom';
import AuthContext from '../../contexts/AuthContext';
import PrivateRoute from '../PrivateRoute';
import * as React from 'react';

interface Props extends RouteProps{
}

/**
 * 只有管理员才可以访问
 * @param props
 * @constructor
 */
const AdminRoute: FC<Props> = (props) => {
  const { children, ...rest } = props;

  const { isAdmin } = useContext(AuthContext);

  const renderRoute = () => {
    if (!isAdmin) {
      return <Redirect to="/" />
    }

    return children;
  }

  return <PrivateRoute {...rest}>{renderRoute()}</PrivateRoute>
}

export default AdminRoute;
