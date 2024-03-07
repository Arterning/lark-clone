import React, { FC, useState } from "react";
import { TodoItem, TodoStatus } from "../../types/Todo";
import TodoCard from "../TodoCard";
import TodoDrawer from "../TodoDrawer";
import { User } from "../../types/User";

interface Props {
  todoList: TodoItem[];
  users: User[];
  refresher: () => void;
  onDelete: (id: number) => void;
  onEdit: (todo: TodoItem) => void;
}

const defaultTodo: Omit<TodoItem, "id"> = {
  title: "",
  description: "",
  status: TodoStatus.TODO,
};

const TodoList: FC<Props> = (props: Props) => {
  const { todoList, users, refresher } = props;
  const [visible, setVisible] = useState<boolean>(false);
  const [detail, setDetail] = useState<TodoItem>(defaultTodo);

  const updateDetail = (todo: TodoItem | undefined) => {
    if (!todo) {
      return;
    }
    setDetail(todo);
    setVisible(true);
  }

  return (
    <div className="todo-list">
      {todoList
        .map((todo) => (
          <div key={todo.id}>
            <TodoCard
              data={todo}
              onDetail={() => updateDetail(todo)}
            />
          </div>
        ))}
      <TodoDrawer
        visible={visible}
        onClose={() => setVisible(false)}
        todoDetail={detail}
        updateDetail={updateDetail}
        users={users}
        refresher={refresher}
      />
    </div>
  );
};

export default TodoList;
