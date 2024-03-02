import * as React from 'react';
import { FC, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import AuthContext from '../../contexts/AuthContext';

interface Props {
}

const AuthButton: FC<Props> = () => {
  const history = useHistory();
  const { token, logout, userInfo } = useContext(AuthContext);

  if (!token) {
    return <p style={{ color: 'red' }}>你还没有登录</p>;
  }

  return (
    <div style={{
      marginLeft: "auto",
      paddingRight: "80px"
    }}>
      Welcome!{' '} {userInfo?.username} {' '}
      <button onClick={async () => {
        await logout();
        history.push('/');
      }}>
        登出
      </button>
    </div>
  );
};

export default AuthButton;
