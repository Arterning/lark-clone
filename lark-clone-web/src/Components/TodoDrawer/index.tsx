import React, { useContext, useEffect, useState } from "react";
import { Button, DatePicker, Drawer, Flex, Input, Select, Space } from "antd";
import { TodoComment, TodoItem, TodoStatus } from "../../types/Todo";
import http from "../../http";
import {
  EditOutlined,
  CalendarOutlined,
  UserOutlined,
  FileTextOutlined,
  CommentOutlined,
  PlusOutlined,
  FileOutlined
} from "@ant-design/icons";
import dayjs from "dayjs";
import { User } from "../../types/User";
import toast, { Toaster } from "react-hot-toast";
import { RangeValue } from "../../pages/Todo";
import AuthContext from "../../contexts/AuthContext";
import { FollowSaveType } from "../../types/Common";

interface IProps {
  todoDetail: TodoItem;
  users: User[];
  visible: boolean;
  refresher: () => void;
  onClose?: () => void;
}

const statusList = [
  {
    value: TodoStatus.TODO.toString(),
    label: "待完成",
  },
  {
    value: TodoStatus.DONE.toString(),
    label: "已完成",
  },
]

const TodoDrawer = (props: IProps) => {
  const { visible, todoDetail, users, refresher, onClose } = props;

  const [editTodo, setEditTodo] = useState<TodoItem>(todoDetail);
  const [comment, setComment] = useState<string>("");
  const [subTodoTitle, setSubTodoTitle] = useState<string>("");
  const [isFollowTodo, setIsFollowTodo] = useState<boolean>(false);


  const [commentHistory, setCommentHistory] = useState<TodoComment[]>([]);
  const [subTodoList, setSubTodoList] = useState<TodoItem[]>([]);

  const { userInfo } = useContext(AuthContext);

  useEffect(() => {
    if (todoDetail?.id) {
      http.get(`/todo/${todoDetail?.id}`).then(({ data }) => {
        setCommentHistory(data?.comments || []);
        setSubTodoList(data?.children || []);
        setEditTodo(data);

        todoDetail?.follower?.forEach((user) => {
          if (user.id === userInfo?.id) {
            setIsFollowTodo(true);
          }
        })
      });
    }
  }, [todoDetail, userInfo]);

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
  };

  const handleFollowTodo = async () => {
    try {
      await http.post(`/todo/follow-todo`, {
        todoId: todoDetail?.id,
        type: FollowSaveType.FOLLOW
      });
      toast.success("操作成功");
      setIsFollowTodo(true);
    } catch (error) {
      toast.error("操作失败");
    }
  };

  const handleUnFollowTodo = async () => {
    try {
      await http.post(`/todo/follow-todo/`, {
        todoId: todoDetail?.id,
        type: FollowSaveType.UN_FOLLOW
      });
      toast.success("操作成功");
      setIsFollowTodo(false);
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
        title: editTodo.title,
        assignee: editTodo.assignee?.id,
        startDate: formattedStartDate,
        endDate: formattedEndDate,
        description: editTodo.description,
        status: editTodo.status,
      });
      toast.success("操作成功");
    } catch (error) {
      toast.error("操作失败");
    }
    onClose?.();
    refresher();
  };

  const handleOnComment = async () => {
    setComment("");

    try {
      await http.post(`comment`, {
        content: comment,
        todoId: todoDetail?.id,
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

  const handleSelectStatus = (value: string) => {
    setEditTodo({
      ...editTodo,
      status: value.length ? parseInt(value) : TodoStatus.TODO,
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

    refresher();
  };

  const handleTimeRange = (dates: RangeValue) => {
    if (dates?.[0] && dates?.[1]) {
      const startDateStr = dates[0].format("YYYY-MM-DD");
      const endDateStr = dates[1].format("YYYY-MM-DD");
      setEditTodo({
        ...editTodo,
        startDate: new Date(startDateStr),
        endDate: new Date(endDateStr),
      });
    } else {
      setEditTodo({
        ...editTodo,
        startDate: undefined,
        endDate: undefined,
      });
    }
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
          <PlusOutlined rev={""} />
          <Select
            style={{ width: 120 }}
            value={editTodo?.status.toString()}
            placeholder="是否完成"
            options={statusList.map((status) => ({
              value: status.value,
              label: status.label,
            }))}
            allowClear
            onChange={handleSelectStatus}
          />
        </Space>
        
        <Space>
          <CalendarOutlined rev={""} />
          <DatePicker.RangePicker
            value={[
              editTodo?.startDate && dayjs(editTodo?.startDate),
              editTodo?.endDate && dayjs(editTodo?.endDate),
            ]}
            onChange={handleTimeRange}
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
          {
            isFollowTodo
              ? <Button onClick={handleUnFollowTodo}>取消关注</Button>
              : <Button onClick={handleFollowTodo}>关注</Button>
          }
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
          <Button onClick={handleOnComment} disabled={!comment}>评论</Button>
        </Space>
        <div className="todo-comment-history">
          {commentHistory.map((comment, index) => (
            <div className="todo-comment" key={index}>
              <div className="head">
                <Space>
                  <span>{comment.createdBy?.username || "Unknown"}</span>
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
          <Button onClick={handleCreateSubTodo} disabled={!subTodoTitle}>创建子任务</Button>
        </Space>
        <div className="todo-comment-history">
          {subTodoList.map((subTodo, index) => (
            <div className="todo-comment" key={index}>
              <div className="head">
                <Space>
                  <span>{subTodo.createdBy?.username || "Unkonwn"}</span>
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
