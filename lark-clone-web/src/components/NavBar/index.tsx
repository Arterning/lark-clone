import AuthButton from "../AuthButton";
import React from "react";
import { Avatar } from "antd";
import { UserOutlined } from "@ant-design/icons";


const NavBar = () => {
    return (
        <div className="navbar">
            <Avatar size="large" icon={<UserOutlined rev={""} />} />
            <AuthButton />
        </div>
    )
}

export default NavBar
