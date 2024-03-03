import * as React from "react"
import { ChangeEvent, FC, useEffect, useState } from "react";
import {TodoItem} from "../../types/Todo"
import http from "../../http"

interface Props {
  onSubmit: (todo: Partial<TodoItem>) => Promise<void>;
  todo?: TodoItem;
}

const defaultTodo: Omit<TodoItem, 'id'> = {
  title: '',
  description: '',
  status: 0,
}

const TodoForm: FC<Props> = (props) => {
  const { todo, onSubmit } = props;

  // 新待办
  const [newTodo, setNewTodo] = useState<Omit<TodoItem, 'id' | 'status'>>(defaultTodo);

  useEffect(() => {
    setNewTodo(todo || defaultTodo);
  }, [todo])


  const resetForm = () => {
    setNewTodo(defaultTodo);
  }

  return (
    <div>
      <div>
        <input
          value={newTodo.title}
          onChange={e => setNewTodo({...newTodo, title: e.target.value})}
          placeholder="输入标题"
          type='text'
        />
      </div>
      <button onClick={() => onSubmit(newTodo)}>提交</button>
      <button onClick={() => resetForm()}>重置</button>
    </div>
  )
}

export default TodoForm
