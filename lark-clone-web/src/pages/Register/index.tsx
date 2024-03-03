import { FC, useState } from "react";
import { Button, Flex, Input, Space } from "antd";
import { useHistory } from "react-router-dom";
import http from "../../http";

const Register: FC = () => {
  const history = useHistory();

  const [registerForm, setRegisterForm] = useState({
    username: "",
    password: "",
  });

  const register = async () => {
    await http.post("/user", registerForm);
    history.push("/login");
  };

  return (
    <div className="register">
      <h1>注册页</h1>

      <div
        style={{
          padding: "12px",
        }}
      >
        <Input
          value={registerForm.username}
          placeholder="请输入用户名"
          onChange={(e) =>
            setRegisterForm({ ...registerForm, username: e.target.value })
          }
          type="text"
        />
      </div>

      <div
        style={{
          padding: "12px",
        }}
      >
        <Input
          value={registerForm.password}
          placeholder="请输入密码"
          onChange={(e) =>
            setRegisterForm({ ...registerForm, password: e.target.value })
          }
          type="text"
        />
      </div>

      <Space>
        <Button onClick={register}>注册</Button>
      </Space>
    </div>
  );
};

export default Register;
