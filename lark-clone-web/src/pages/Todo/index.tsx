import React, { FC, useCallback, useEffect, useState } from "react";
import { TodoItem, TodoStatus } from "../../types/Todo";
import http from "../../http";
import {
  Button,
  DatePicker,
  Dropdown,
  Input,
  MenuProps,
  Select,
  Space,
} from "antd";
import TodoList from "../../Components/TodoList";
import { Skeleton } from "antd";
import { Dayjs } from "dayjs";
import { User } from "../../types/User";
import { ArrowDownOutlined, ArrowUpOutlined } from "@ant-design/icons";

interface IProps {
  todoType?:
    | "owned"
    | "following"
    | "all"
    | "created"
    | "assigned"
    | "finished";
}

interface QueryTodoDto {
  sortBy?: string;
  order?: "ASC" | "DESC";
  startDate?: Date;
  endDate?: Date;
  createdBy?: string;
  assignee?: string;
}

export type RangeValue = [Dayjs | null, Dayjs | null] | null;

const sortMenu: MenuProps["items"] = [
  {
    key: "1",
    label: <a>按创建时间</a>,
  },
  {
    key: "2",
    label: <a>按计划完成时间</a>,
  },
  {
    key: "3",
    label: <a>按创建者</a>,
  },
  {
    key: "4",
    label: <a>按ID</a>,
  },
];

const Todo = (props: IProps) => {
  const { todoType = "all" } = props;
  const [loading, setLoading] = useState<boolean>(false);
  const [todos, setTodos] = useState<TodoItem[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [newTodo, setNewTodo] = useState<Partial<TodoItem>>({
    title: "",
    status: TodoStatus.TODO,
  });

  const [query, setQuery] = useState<QueryTodoDto>();

  const fetchUserList = async () => {
    const { data } = await http.get<User[]>("/user");
    setUsers(data);
    return data;
  };

  const fetchTodos = useCallback(async () => {
    setLoading(true);
    const { data } = await http.post<TodoItem[]>(`/todo/${todoType}`, query);
    setTodos(data);
    setLoading(false);
  }, [todoType, query]);

  useEffect(() => {
    fetchTodos().then();
    fetchUserList().then();
  }, [fetchTodos, query]);

  const submitTodo = async (newTodo: Partial<TodoItem>) => {
    setLoading(true);
    if (!newTodo.id) {
      await http.post<TodoItem>("/todo", newTodo);
    } else {
      await http.patch<TodoItem>(`/todo/${newTodo.id}`, newTodo);
    }
    setLoading(false);
    setNewTodo({ ...newTodo, title: "" });
    await fetchTodos();
  };

  const deleteTodo = async (id: number) => {
    setLoading(true);
    await http.delete<TodoItem>(`/todo/${id}`);
    setLoading(false);
    await fetchTodos();
  };

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setNewTodo({ ...newTodo, title: value });
  };

  const handleTimeRange = (dates: RangeValue) => {
    if (dates?.[0] && dates?.[1]) {
      const startDateStr = dates[0].format("YYYY-MM-DD");
      const endDateStr = dates[1].format("YYYY-MM-DD");
      setQuery({
        ...query,
        startDate: new Date(startDateStr),
        endDate: new Date(endDateStr),
      });
    } else {
      setQuery({
        ...query,
        startDate: undefined,
        endDate: undefined,
      });
    }
  };

  const handleSelectCreator = (createdBy: string) => {
    setQuery({
      ...query,
      createdBy,
    });
  };

  const handleSelectAssignee = (assignee: string) => {
    setQuery({
      ...query,
      assignee,
    });
  };

  const handleSort: MenuProps["onClick"] = (e) => {
    e.domEvent.stopPropagation();
    const { key } = e;
    if (key === "1") {
      setQuery({
        ...query,
        sortBy: "createdAt",
        order: "DESC",
      });
    } else if (key === "2") {
      setQuery({
        ...query,
        sortBy: "endDate",
        order: "DESC",
      });
    } else if (key === "3") {
      setQuery({
        ...query,
        sortBy: "createdById",
        order: "DESC",
      });
    } else {
      setQuery({
        ...query,
        sortBy: "id",
        order: "DESC",
      });
    }
  };

  return (
    <div>
      <div
        style={{
          display: "flex",
          gap: "10px",
        }}
      >
        <Input
          placeholder="Todo name"
          value={newTodo.title}
          onChange={handleInput}
        />
        <Button
          type="primary"
          onClick={() => {
            submitTodo(newTodo);
          }}
          disabled={!newTodo.title}
        >
          新增任务
        </Button>
      </div>

      <div className="todo-list-filter">
        <Space>
          <span>创建时间段</span>
          <DatePicker.RangePicker onChange={handleTimeRange} />
          <span>创建人</span>
          <Select
            style={{ width: 120 }}
            value={query?.createdBy}
            options={users.map((user) => ({
              value: user.id,
              label: user.username,
            }))}
            allowClear
            onChange={handleSelectCreator}
          />
          <span>任务人</span>
          <Select
            style={{ width: 120 }}
            value={query?.assignee}
            options={users.map((user) => ({
              value: user.id,
              label: user.username,
            }))}
            allowClear
            onChange={handleSelectAssignee}
          />
          <Dropdown
            menu={{ items: sortMenu, onClick: handleSort }}
            placement="bottomRight"
          >
            <Button>排序</Button>
          </Dropdown>
          {query?.order === "DESC" ? (
            <ArrowUpOutlined
              rev={""}
              onClick={() => setQuery({ ...query, order: "ASC" })}
              title="降序"
            />
          ) : (
            <ArrowDownOutlined
              rev={""}
              onClick={() => setQuery({ ...query, order: "DESC" })}
              title="升序"
            />
          )}
        </Space>
      </div>

      <Space>
        <Button onClick={fetchTodos} type="primary">
          查询
        </Button>
        <Button onClick={() => setQuery({})}>重置</Button>
      </Space>

      {loading && <Skeleton paragraph={{ rows: 8 }} />}

      {!loading && (
        <TodoList
          todoList={todos}
          onDelete={deleteTodo}
          onEdit={(todo) => {}}
          users={users}
        />
      )}
    </div>
  );
};

export default Todo;
