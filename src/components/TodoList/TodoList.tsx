import React, { useState, useRef } from 'react';
import styles from './TodoList.module.scss';
import { DBUserSettings } from '../../types';

interface TodoListProps {
  isTodoOpen: boolean;
  setIsTodoOpen: (isOpen: boolean) => void;
  settings: DBUserSettings;
  setSettings: React.Dispatch<React.SetStateAction<DBUserSettings>>;
}

interface TodoItem {
  id: string;
  text: string;
  completed: boolean;
}

function TodoList({ isTodoOpen, setIsTodoOpen, settings, setSettings }: TodoListProps) {
  const [todos, setTodos] = useState<TodoItem[]>(settings.todos || []);
  const todoDrawerRef = useRef<HTMLDivElement>(null);

  const toggleTodo = (id: string) => {
    const updatedTodos = todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    );
    setTodos(updatedTodos);
    updateSettings(updatedTodos);
  };

  const addTodo = () => {
    const newTodo: TodoItem = {
      id: Date.now().toString(),
      text: '',
      completed: false
    };
    setTodos([...todos, newTodo]);
    updateSettings([...todos, newTodo]);
  };

  const updateTodoText = (id: string, text: string) => {
    const updatedTodos = todos.map(todo =>
      todo.id === id ? { ...todo, text } : todo
    );
    setTodos(updatedTodos);
    updateSettings(updatedTodos);
  };

  const updateSettings = async (updatedTodos: TodoItem[]) => {
    const newSettings = { ...settings, todos: updatedTodos };
    setSettings(newSettings);
    try {
      await fetch('/api/userSettings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newSettings),
      });
    } catch (error) {
      console.error('Error updating user settings:', error);
    }
  };

  return (
    <>
      <div className={styles.todoIcon} onClick={() => setIsTodoOpen(!isTodoOpen)}>
        ✏️
      </div>
      {isTodoOpen && (
        <>
          <div className={styles.overlay} onClick={() => setIsTodoOpen(false)} />
          <div className={styles.todoDrawer} ref={todoDrawerRef}>
            <h3>Todo List</h3>
            {todos.map(todo => (
              <div key={todo.id} className={styles.todoItem}>
                <input
                  type="checkbox"
                  checked={todo.completed}
                  onChange={() => toggleTodo(todo.id)}
                />
                <input
                  type="text"
                  value={todo.text}
                  onChange={(e) => updateTodoText(todo.id, e.target.value)}
                  placeholder="Enter todo item"
                />
              </div>
            ))}
            <button className={styles.addTodoButton} onClick={addTodo}>Add Todo</button>
          </div>
        </>
      )}
    </>
  );
}

export default TodoList;