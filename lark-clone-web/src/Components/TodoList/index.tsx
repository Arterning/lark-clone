import React, { FC, useState } from "react";
import { TodoItem, TodoStatus } from "../../types/Todo";
import TodoCard from "../TodoCard";
import TodoDrawer from "../TodoDrawer";
import { User } from "../../types/User";

interface Props {
  todoList: TodoItem[];
  users: User[];
  onDelete: (id: number) => void;
  onEdit: (todo: TodoItem) => void;
}

const defaultTodo: Omit<TodoItem, "id"> = {
  title: "",
  description: "",
  status: TodoStatus.TODO,
};

const TodoList: FC<Props> = (props: Props) => {
  const { todoList, users } = props;
  const [visible, setVisible] = useState<boolean>(false);
  const [detail, setDetail] = useState<TodoItem>(defaultTodo);

  return (
    <div className="todo-list">
      {todoList
        .map((todo) => (
          <div key={todo.id}>
            <TodoCard
              data={todo}
              onDetail={() => {
                setVisible(true);
                setDetail(todo);
              }}
            />
          </div>
        ))}
      <TodoDrawer
        visible={visible}
        onClose={() => setVisible(false)}
        todoDetail={detail}
        users={users}
      />
    </div>
  );
};

export default TodoList;
