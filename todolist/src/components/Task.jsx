import React from 'react';
import {DeleteOutlined} from '@ant-design/icons';
const Task = ({ task, updateTask, deleteTask }) => {
  const handleChange = e => {
    const updatedTask = { ...task, completed: e.target.checked };
    updateTask(task.id, updatedTask);
  };

  const handleDelete = () => {
    deleteTask(task.id);
  };

  return (
    <div className="grid justify-around items-start border-2 gap-5 rounded-xl shadow-xl px-10 py-2 w-max-content">
    <li className="flex gap-10">
      <input
        type="checkbox"
        checked={task.completed}
        onChange={handleChange}
        className="border py-4"
      />
      <span
        style={{ textDecoration: task.completed ? "line-through" : "none" }}
        className="text-xl font-bold items-center hover:text-gray-600"
      >
        {task.title}
      </span>
      <button className="items-end" onClick={handleDelete}>
        <DeleteOutlined />
      </button>
    </li>
  </div>
  
  );
};

export default Task;
