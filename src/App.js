import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Button from 'react-bootstrap/Button';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container } from 'react-bootstrap';
import "./style.css"


function App() {
  const [tasks, setTasks] = useState([]);
  const [taskInput, setTaskInput] = useState('');
  const [editIndex, setEditIndex] = useState(null);

  const displayTasks = () => {
    axios
      .get('http://localhost:8000/')
      .then((res) => {
        setTasks(res.data);
      })
      .catch(() => {
        console.log('Error');
      });
  };

  useEffect(() => {
    displayTasks();
  }, []);

  const changeHandler = (e) => {
    setTaskInput(e.target.value);
  };

  const submitTask = (e) => {
    e.preventDefault();
    if (editIndex !== null) {
      // Edit task
      axios.put(`http://localhost:8000/task/${editIndex}`, { task: taskInput })
        .then((res) => {
          setTaskInput('');
          setEditIndex(null);
          displayTasks();
          alert(res.data.message);
        })
        .catch((err) => {
          alert(err.res.data.message);
        });
    } else {
      // Add task
      axios.post('http://localhost:8000/', { task: taskInput })
        .then((res) => {
          setTaskInput('');
          displayTasks();
          alert(res.data.message);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  const editTask = (index) => {
    setTaskInput(tasks[index].task);
    setEditIndex(index);
  };

  const deleteTask = (index) => {
    axios.delete(`http://localhost:8000/task/${index}`)
      .then((res) => {
        displayTasks();
        alert(res.data.message);
      })
      .catch((err) => {
        alert(err.res.data.message);
      });
  };

  return (
    <Container>
      <h1>Todo App</h1>
      <form onSubmit={submitTask}>
        <input id ="form"
          type="text"
          placeholder="Enter the Task"
          value={taskInput}
          onChange={changeHandler}
        ></input>
        <input
          type="submit"
          value={editIndex !== null ? 'Update Task' : 'Add Task'}
        ></input>
      </form>
      <ol id ="tasks">
        {tasks.map((task, index) => {
          return (
            <li key={index}>
              {task.task}
              <Button variant="primary" size='sm' id ="editBtn" onClick={() => editTask(index)}>Edit</Button>
              <Button variant="danger" size='sm' id ="delBtn" onClick={() => deleteTask(index)}>Delete</Button>
            </li>
          );
        })}
      </ol>
    </Container>
  );
}

export default App;


