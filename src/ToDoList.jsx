import React, { useState, useEffect } from 'react';
import './style.css';

const ToDoList = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [activeTask, setActiveTask] = useState(null);

  useEffect(() => {
    const storedTasks = localStorage.getItem('tasks');
    if (storedTasks) {
      setTasks(JSON.parse(storedTasks));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  const handleAddTask = (text) => {
    setTasks((prevTasks) => [
      ...prevTasks,
      { id: prevTasks.length + 1, text, items: [], newItem: '' },
    ]);
    setNewTask('');
  };

  const handleAddItem = (taskId, itemText) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId
          ? { ...task, items: [...task.items, { id: task.items.length + 1, text: itemText }] }
          : task
      )
    );
    setActiveTask(null);
  };

  const handleInputChange = (taskId, value) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId ? { ...task, newItem: value } : task
      )
    );
  };

  const handleDeleteTask = (taskId) => {
    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
  };

  const handleDeleteItem = (taskId, itemId) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId
          ? { ...task, items: task.items.filter((item) => item.id !== itemId) }
          : task
      )
    );
  };

  const openModal = (taskId) => {
    setActiveTask(taskId);
  };

  const closeModal = () => {
    setActiveTask(null);
  };

  return (
    <div className="todo-list">
      <h1>Task List</h1>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (newTask.trim()) handleAddTask(newTask);
        }}
      >
        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="Add new task"
        />
        <button type="submit">+</button>
      </form>
      <div className="tasks">
        {tasks.map((task) => (
          <div key={task.id} className="task-box">
            <div className="button-container">
              <button className="add-item" onClick={() => openModal(task.id)}>+</button>
              <button className="delete-task" onClick={() => handleDeleteTask(task.id)}>Delete Task</button>
            </div>
            <h2>{task.text}</h2>
            <ul>
              {task.items.map((item) => (
                <li key={item.id}>
                  {item.text}
                  <button className="delete-item" onClick={() => handleDeleteItem(task.id, item.id)}>Delete</button>
                </li>
              ))}
            </ul>
            {activeTask === task.id && (
              <div className="modal">
                <div className="modal-content">
                  <h3>Add New Item</h3>
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      const task = tasks.find((t) => t.id === activeTask);
                      if (task.newItem.trim()) handleAddItem(activeTask, task.newItem);
                    }}
                  >
                    <input
                      type="text"
                      value={tasks.find((task) => task.id === activeTask)?.newItem || ''}
                      onChange={(e) => handleInputChange(activeTask, e.target.value)}
                      placeholder="Item description"
                    />
                    <button type="submit">+</button>
                    <button type="button" onClick={closeModal}>
                      Cancel
                    </button>
                  </form>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ToDoList;




   