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
  media: '',
  status: 0,
}

const TodoForm: FC<Props> = (props) => {
  const { todo, onSubmit } = props;

  // 新待办
  const [newTodo, setNewTodo] = useState<Omit<TodoItem, 'id' | 'status'>>(defaultTodo);

  useEffect(() => {
    setNewTodo(todo || defaultTodo);
  }, [todo])

  const onUploadChange = async (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    const formData = new FormData();
    formData.set('file', e.target.files[0]);
    const response = await http.post('/upload/file', formData);

    setNewTodo({...newTodo, media: response.data.file})
  }

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
