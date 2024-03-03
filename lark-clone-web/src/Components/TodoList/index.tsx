import React, { FC, useState } from "react";
import { TodoItem } from "../../types/Todo";
import TodoCard from "../TodoCard";
import TodoDrawer from "../TodoDrawer";

interface Props {
  todoList: TodoItem[];
  onDelete: (id: number) => void;
  onEdit: (todo: TodoItem) => void;
}

const TodoList: FC<Props> = (props: Props) => {
  const { todoList } = props;
  const [visible, setVisible] = useState<boolean>(false);
  const [detail, setDetail] = useState<TodoItem>();

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
      />
    </div>
  );
};

export default TodoList;
