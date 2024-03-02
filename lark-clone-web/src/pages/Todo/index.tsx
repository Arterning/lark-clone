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

interface IProps {
  todoType?:
    | "owned"
    | "following"
    | "all"
    | "created"
    | "assigned"
    | "finished";
}

interface FilterCondition {
  createTimeStart?: number;
  createTimeEnd?: number;
  creatorId?: string;
}

interface SortCondition {
  field: string;
  direction: "ASC" | "DESC";
}

type RangeValue = [Dayjs | null, Dayjs | null] | null;

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
];

const Todo = (props: IProps) => {
  const { todoType = "all" } = props;
  const [loading, setLoading] = useState<boolean>(false);
  const [todos, setTodos] = useState<TodoItem[]>([]);
  const [newTodo, setNewTodo] = useState<Partial<TodoItem>>({
    title: "",
    status: TodoStatus.TODO,
  });
  const [filterCondition, setFilterCondition] = useState<FilterCondition>({
    createTimeStart: 0,
    createTimeEnd: 0,
    creatorId: "",
  });
  const [sortCondition, setSortCondition] = useState<SortCondition>({
    field: "createTime",
    direction: "DESC",
  });

  const fetchTodos = useCallback(async () => {
    setLoading(true);
    const sort = sortCondition.field;
    const { data } = await http.get<TodoItem[]>(
      `/todo/${todoType}?sort=${sort}`
    );
    setTodos(data);
    setLoading(false);
  }, [todoType, sortCondition]);

  useEffect(() => {
    fetchTodos().then();
  }, [fetchTodos, todoType, sortCondition]);

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
      setFilterCondition({
        ...filterCondition,
        createTimeStart: new Date(`${startDateStr} 00:00:00`).getTime(),
        createTimeEnd: new Date(`${endDateStr} 23:59:59`).getTime(),
      });
    } else {
      setFilterCondition({
        ...filterCondition,
        createTimeStart: 0,
        createTimeEnd: 0,
      });
    }
  };

  const handleSelectCreator = (creatorId: string) => {
    setFilterCondition({
      ...filterCondition,
      creatorId,
    });
  };

  const handleSort: MenuProps["onClick"] = (e) => {
    e.domEvent.stopPropagation();
    const { key } = e;
    if (key === "1") {
      setSortCondition({
        field: "createTime",
        direction: "DESC",
      });
    } else if (key === "2") {
      setSortCondition({
        field: "planFinishTime",
        direction: "DESC",
      });
    } else if (key === "3") {
      setSortCondition({
        field: "creatorId",
        direction: "DESC",
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
        >
          新增任务
        </Button>
      </div>

      <div className="todo-list-filter">
        <Space>
          <span>创建时间</span>
          <DatePicker.RangePicker onChange={handleTimeRange} />
          <span>创建者</span>
          <Select
            style={{ width: 120 }}
            value={filterCondition.creatorId}
            options={[
              {
                id: "234234234",
                name: "全部",
              },
            ].map((user) => ({
              value: user.id,
              label: user.name,
            }))}
            allowClear
            onChange={handleSelectCreator}
          />
          <Button onClick={fetchTodos}>查询</Button>
          <Dropdown
            menu={{ items: sortMenu, onClick: handleSort }}
            placement="bottomRight"
          >
            <Button>排序</Button>
          </Dropdown>
        </Space>
      </div>

      {loading && <Skeleton paragraph={{ rows: 8 }} />}

      {!loading && (
        <TodoList
          todoList={todos}
          onDelete={deleteTodo}
          onEdit={(todo) => {}}
        />
      )}
    </div>
  );
};

export default Todo;
