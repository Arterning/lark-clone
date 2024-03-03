import React, { useEffect, useState } from "react";
import { Button, DatePicker, Drawer, Flex, Input, Select, Space } from "antd";
import { TodoComment, TodoItem, TodoStatus } from "../../types/Todo";
import http from "../../http";
import {
  EditOutlined,
  CalendarOutlined,
  UserOutlined,
  FileTextOutlined,
  CommentOutlined,
  FileOutlined
} from "@ant-design/icons";
import dayjs from "dayjs";
import { User } from "../../types/User";
import toast, { Toaster } from "react-hot-toast";

interface IProps {
  todoDetail: TodoItem;
  users: User[];
  visible: boolean;
  onClose?: () => void;
}

const TodoDrawer = (props: IProps) => {
  const { visible, onClose, todoDetail, users } = props;

  const [editTodo, setEditTodo] = useState<TodoItem>(todoDetail);
  const [comment, setComment] = useState<string>("");
  const [subTodoTitle, setSubTodoTitle] = useState<string>("");

  const [commentHistory, setCommentHistory] = useState<TodoComment[]>([]);
  const [subTodoList, setSubTodoList] = useState<TodoItem[]>([]);

  useEffect(() => {
    setEditTodo(todoDetail);

    if (todoDetail?.id) {
      http.get(`/todo/${todoDetail?.id}`).then(({ data }) => {
        setCommentHistory(data?.comments || []);
        setSubTodoList(data?.children || []);
      });
    }
  }, [todoDetail]);

  const handleCreateSubTodo = async () => {
    try {
      await http.post<TodoItem>(`/todo`, {
        title: subTodoTitle,
        parentId: todoDetail?.id,
        status: TodoStatus.TODO,
      });
      http.get(`/todo/${todoDetail?.id}`).then(({ data }) => {
        setSubTodoList(data?.children || []);
      });
      toast.success("操作成功");
    } catch (error) {
      toast.error("操作失败");
    }
    window.location.reload();
  };

  const handleFollowTodo = async () => {
    try {
      await http.post(`/todo/follow-todo`, {
        todoId: todoDetail?.id,
      });
      toast.success("操作成功");
    } catch (error) {
      toast.error("操作失败");
    }
  };

  const handleFinishTodo = async () => {
    try {
      await http.patch(`/todo/${todoDetail?.id}`, {
        ...editTodo,
        status: TodoStatus.DONE,
      });
      toast.success("操作成功");
    } catch (error) {
      toast.error("操作失败");
    }
  };

  const handleOnSave = async () => {
    const formattedStartDate = editTodo.startDate
      ? dayjs(editTodo.startDate).format("YYYY-MM-DD")
      : undefined;
    const formattedEndDate = editTodo.endDate
      ? dayjs(editTodo.endDate).format("YYYY-MM-DD")
      : undefined;
    try {
      await http.patch(`/todo/${todoDetail?.id}`, {
        ...editTodo,
        startDate: formattedStartDate,
        endDate: formattedEndDate,
        assignee: editTodo.assignee?.id,
      });
      toast.success("操作成功");
    } catch (error) {
      toast.error("操作失败");
    }
    onClose?.();
  };

  const handleOnComment = async () => {
    setComment("");

    try {
      await http.post(`/todo/${todoDetail?.id}/comment`, {
        content: comment,
      });

      http.get(`/todo/${todoDetail?.id}`).then(({ data }) => {
        setCommentHistory(data?.comments || []);
      });

      toast.success("操作成功");
    } catch (error) {
      toast.error("操作失败");
    }
  };

  const handleSelectAssignee = (value: string) => {
    setEditTodo({
      ...editTodo,
      assignee: {
        id: value,
      },
    });
  };

  const handleDeleteTodo = async () => {
    if (!editTodo?.id) return;
    try {
      await http.delete(`/todo/${editTodo.id}`);
      toast.success("操作成功");
    } catch (error) {
      toast.error("操作失败");
    }
    onClose?.();

    window.location.reload();
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
            options={users.map((user) => ({
              value: user.id,
              label: user.username,
            }))}
            allowClear
            onChange={handleSelectAssignee}
          />
        </Space>
        <Space>
          <CalendarOutlined rev={""} />
          <DatePicker
            value={editTodo?.startDate}
            onChange={(date) => setEditTodo({ ...editTodo, startDate: date })}
          />
          <DatePicker
            value={editTodo?.endDate}
            onChange={(date) => setEditTodo({ ...editTodo, endDate: date })}
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
          <EditOutlined rev={""} />
          <Button onClick={handleFollowTodo}>关注</Button>
          <Button onClick={handleFinishTodo}>完成任务</Button>
          <Button onClick={handleOnSave}>提交</Button>
          <Button onClick={handleDeleteTodo}>删除</Button>
        </Space>
      </Flex>

      <Flex gap="middle" vertical>
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
        <div className="todo-comment-history">
          {commentHistory.map((comment, index) => (
            <div className="todo-comment" key={index}>
              <div className="head">
                <Space>
                  <span>{comment.createdBy?.username || "admin"}</span>
                  <span>
                    {dayjs(comment.createdAt).format("YYYY-MM-DD hh:mm")}
                  </span>
                </Space>
              </div>
              <div className="content">{comment.content}</div>
            </div>
          ))}
        </div>
      </Flex>

      <Flex gap="middle" vertical>
        <div className="sub-todo-title">子任务</div>
        <Space>
          <FileOutlined rev={""} />
          <Input
            value={subTodoTitle}
            onChange={(e) => setSubTodoTitle(e.target.value)}
          ></Input>
        </Space>
        <Space>
          <Button onClick={handleCreateSubTodo}>创建子任务</Button>
        </Space>
        <div className="todo-comment-history">
          {subTodoList.map((subTodo, index) => (
            <div className="todo-comment" key={index}>
              <div className="head">
                <Space>
                  <span>{subTodo.createdBy?.username || "admin"}</span>
                  <span>
                    {dayjs(subTodo.createdAt).format("YYYY-MM-DD hh:mm")}
                  </span>
                </Space>
              </div>
              <div className="content">{subTodo.title}</div>
            </div>
          ))}
        </div>
      </Flex>
    </Drawer>
  );
};

export default TodoDrawer;
