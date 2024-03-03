import * as React from "react";
import { FC, useContext, useState } from "react";
import { useHistory } from "react-router-dom";
import authContext from "../../contexts/AuthContext";
import { Button, Input, Space } from "antd";

const Login: FC = () => {
  const history = useHistory();
  const auth = useContext(authContext);

  const [authForm, setAuthForm] = useState({
    username: "admin",
    password: "admin",
  });
  const [msg, setMsg] = useState("");

  const login = async () => {
    const isLogin = await auth.login({ ...authForm });
    if (isLogin) {
      setMsg("登录成功");
      history.push("/");
    } else {
      setMsg("登录失败");
    }

    return false;
  };

  if (auth.token) {
    history.push("/");
  }

  return (
    <div className="login">
      <h1>登录页</h1>

      {msg && <p style={{ color: "red" }}>{msg}</p>}

      <div
        style={{
          padding: "12px",
        }}
      >
        <label htmlFor="username">
          <Input
            value={authForm.username}
            placeholder="请输入用户名"
            onChange={(e) =>
              setAuthForm({ ...authForm, username: e.target.value })
            }
            type="text"
          />
        </label>
      </div>
      <div
        style={{
          padding: "12px",
        }}
      >
        <label htmlFor="password">
          <Input
            value={authForm.password}
            placeholder="请输入密码"
            onChange={(e) =>
              setAuthForm({ ...authForm, password: e.target.value })
            }
            type="text"
          />
        </label>
      </div>
      <Space>
        <Button onClick={login}>登录</Button>
        <Button onClick={() => history.push("/register")}>注册</Button>
      </Space>
    </div>
  );
};

export default Login;
