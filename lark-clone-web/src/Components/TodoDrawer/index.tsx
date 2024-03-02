import React, { useState } from "react";
import { Button, Drawer } from "antd";
import { TodoItem } from "../../types/Todo";

interface IProps {
  todoDetail?: TodoItem;
  visible: boolean;
  onClose?: () => void;
}

const TodoDrawer = (props: IProps) => {
  const { visible, onClose, todoDetail } = props;
  return (
    <Drawer title="Basic Drawer" onClose={onClose} open={visible} width="46%">
      <p>Some contents...</p>
      <p>Some contents...</p>
      <p>{todoDetail?.title}</p>
    </Drawer>
  );
};

export default TodoDrawer;
