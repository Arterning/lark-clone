import React, { useEffect, useState } from "react";
import { Button, DatePicker, Drawer, Flex, Input, Select, Space } from "antd";
import { TodoComment, TodoItem, TodoStatus } from "../../types/Todo";
import http from "../../http";
import {
  CalendarOutlined,
  UserOutlined,
  FileTextOutlined,
  CommentOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
// import { toast } from 'sonner'

interface IProps {
  todoDetail: TodoItem;
  visible: boolean;
  onClose?: () => void;
}

const defaultTodo: Omit<TodoItem, "id"> = {
  title: "",
  description: "",
  status: TodoStatus.TODO,
};

const TodoDrawer = (props: IProps) => {
  const { visible, onClose, todoDetail } = props;

  const [editTodo, setEditTodo] = useState<TodoItem>(todoDetail || defaultTodo);
  const [comment, setComment] = useState<string>("");

  const [commentHistory, setCommentHistory] = useState<TodoComment[]>([]);

  useEffect(() => {
    setEditTodo(todoDetail);

    if (todoDetail?.id) {
      http.get(`/todo/${todoDetail?.id}`).then(({ data }) => {
        console.log(data?.comments);
        setCommentHistory(data?.comments || []);
      });
    }

  }, [todoDetail]);

  const handleFollowTodo = async () => {
    await http.post(`/todo/follow-todo`, {
      todoId: todoDetail?.id,
    });

    // toast.success('关注成功')
  };

  const handleFinishTodo = async () => {
    await http.patch(`/todo/${todoDetail?.id}`, {
      ...editTodo,
      finished: true,
    });
  };

  const handleOnSave = async () => {
    const formattedStartDate = editTodo.startDate
      ? dayjs(editTodo.startDate).format("YYYY-MM-DD")
      : undefined;
    const formattedEndDate = editTodo.endDate
      ? dayjs(editTodo.endDate).format("YYYY-MM-DD")
      : undefined;
    await http.patch(`/todo/${todoDetail?.id}`, {
      ...editTodo,
      startDate: formattedStartDate,
      endDate: formattedEndDate,
    });
  };

  const handleOnComment = async () => {
    await http.post(`/todo/${todoDetail?.id}/comment`, {
      content: comment,
    });
    setComment("");

    http.get(`/todo/${todoDetail?.id}`).then(({ data }) => {
      setCommentHistory(data?.comments || []);
    });
  };

  const handleSelectAssignee = (value: string) => {
    setEditTodo({
      ...editTodo,
      assignee: {
        id: value,
      },
    });
  };

  return (
    <Drawer title="Todo Drawer" onClose={onClose} open={visible} width="46%">
      <Flex gap="middle" vertical>
        <Input
          value={editTodo?.title}
          onChange={(e) => setEditTodo({ ...editTodo, title: e.target.value })}
        ></Input>
        <Space>
          <UserOutlined rev={""} />
          <Select
            style={{ width: 120 }}
            value={editTodo?.assignee?.id}
            placeholder="添加负责人"
            options={[
              {
                id: "1",
                name: "admin",
              },
            ].map((user) => ({
              value: user.id,
              label: user.name,
            }))}
            allowClear
            onChange={handleSelectAssignee}
          />
        </Space>
        <Space>
          <CalendarOutlined rev={""} />
          <DatePicker
            value={editTodo?.startDate}
            onChange={(date) =>
              setEditTodo({ ...editTodo, startDate: date})
            }
          />
          <DatePicker
            value={editTodo?.endDate}
            onChange={(date) =>
              setEditTodo({ ...editTodo, endDate: date})
            }
          />
        </Space>
        <Space>
          <FileTextOutlined rev={""} />
          <Input.TextArea
            value={editTodo?.description}
            onChange={(e) =>
              setEditTodo({ ...editTodo, description: e.target.value })
            }
          ></Input.TextArea>
        </Space>
        <Space>
          <Button onClick={handleFollowTodo}>关注</Button>
          <Button onClick={handleFinishTodo}>完成任务</Button>
          <Button onClick={handleOnSave}>提交</Button>
        </Space>
      </Flex>

      <Flex gap="middle" vertical>
        <div className="todo-comment-history">
          {commentHistory.map((comment, index) => (
            <div key={index}>{comment.content}</div>
          ))}
        </div>
        <div className="todo-comment-title">评论</div>
        <Space>
          <CommentOutlined rev={""} />
          <Input.TextArea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          ></Input.TextArea>
        </Space>
        <Space>
          <Button onClick={handleOnComment}>评论</Button>
        </Space>
      </Flex>
    </Drawer>
  );
};

export default TodoDrawer;
