import { Link, useHistory } from "react-router-dom";
import React, { useState } from "react";
import {
  UserOutlined,
  MailOutlined,
  StarOutlined,
} from "@ant-design/icons";
import type { MenuProps } from "antd";
import { Menu } from "antd";

interface ISideBarProps {}

const items: MenuProps["items"] = [
  {
    label: "我负责的任务",
    key: "owned",
    icon: <UserOutlined rev={"test"}/>,
  },
  {
    label: "关注",
    key: "following",
    icon: <StarOutlined rev={"test"}/>,
  },
  {
    label: "快速存取",
    key: "participated",
    children: [
      {
        label: "全部任务",
        key: "all",
      },
      {
        label: "我创建的任务",
        key: "created",
      },
      {
        label: "我分配的任务",
        key: "assigned",
      },
      {
        label: "已经完成的任务",
        key: "finished",
      }
    ]
  },
  
];

const SideBar: React.FC<ISideBarProps> = (props) => {
  const [current, setCurrent] = useState("mail");

  const history = useHistory();


  const onClick: MenuProps["onClick"] = (e) => {
    console.log("click ", e);
    setCurrent(e.key);
    // 跳转
    history.push(e.key);
  };

  return (
    <div className="sidebar">
      <Menu
        onClick={onClick}
        selectedKeys={[current]}
        mode="inline"
        items={items}
        style={{ width: 256 }}
      />
    </div>
  );
};

export default SideBar;
