import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Task from './components/Task';
import './App.css';
import {
  LoadingOutlined,PlusOutlined 
} from '@ant-design/icons';
const App = () => {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');

  useEffect(() => {
    axios.get('http://localhost:5000/tasks')
      .then(res => setTasks(res.data))
      .catch(err => console.error(err));
  }, []);

  const addTask = () => {
    if (title.trim()) {
      axios.post('http://localhost:5000/tasks', { title, completed: false })
        .then(res => setTasks([...tasks, res.data]))
        .catch(err => console.error(err));
      setTitle('');
    }
  };

  const updateTask = (id, updatedTask) => {
    axios.put(`http://localhost:5000/tasks/${id}`, updatedTask)
      .then(() => {
        const newTasks = tasks.map(task => (task.id === id ? updatedTask : task));
        setTasks(newTasks);
      })
      .catch(err => console.error(err));
  };

  const deleteTask = id => {
    axios.delete(`http://localhost:5000/tasks/${id}`)
      .then(() => setTasks(tasks.filter(task => task.id !== id)))
      .catch(err => console.error(err));
  };

  return (
    <div className="grid gap-10 justify-center items-center w-full h-full">
      <h1 className='text-xl font-bold items-center capitalize ml-10'>To-Do List</h1>
      <div className='flex justify-between gap-3' >
        <input
          type="text"
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="Enter The New task"
          className='text-lg px-5 py-2 rounded-xl border-2 '
        />
        <button onClick={addTask} className='border-[1px] w-10 h-10 hover:bg-cyan-200 border-gray-400 rounded-full'><PlusOutlined/></button>
      </div>
      <ul>
        {tasks.length>0 ?(
          tasks.map(task => (
            <Task
              key={task.id}
              task={task}
              updateTask={updateTask}
              deleteTask={deleteTask}
            />
          ))
        ):(<h1 className='text-lg text-inherit text-gray-800 ' >  <LoadingOutlined /> <br/>No....task please enter the new task </h1>)}
      </ul>
    </div>
  );
};

export default App;
