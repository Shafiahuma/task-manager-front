import React, { useState, useEffect } from 'react'; 
//This imports the React library and the useState and useEffect hooks from React.
//useState is used for managing state, and useEffect is used for performing side effects

import axios from 'axios'; //This imports the axios library, which is used for making HTTP requests.

import { Container, Form, Button, ListGroup} from 'react-bootstrap'; //This imports specific components from the react-bootstrap library to use Bootstrap components in the application.

import 'bootstrap/dist/css/bootstrap.min.css'; //This imports the Bootstrap CSS file for styling.
import './App.css'; //This imports a custom CSS file for additional styling.

function App() {
  const [tasks, setTasks] = useState([]); //Declares a state variable tasks initialized as an empty array. setTasks is used to update the state.
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    const response = await axios.get('http://localhost:3001/tasks');
    setTasks(response.data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingTask) {
      await axios.put(`http://localhost:3001/tasks/${editingTask.id}`, { title, description, status });
      setEditingTask(null);
    } else {
      await axios.post('http://localhost:3001/tasks', { title, description, status });
    }
    setTitle('');
    setDescription('');
    setStatus(false);
    fetchTasks();
  };

  const handleDelete = async (id) => {
    await axios.delete(`http://localhost:3001/tasks/${id}`);
    fetchTasks();
  };

  const handleEdit = (task) => {
    setEditingTask(task);
    setTitle(task.title);
    setDescription(task.description);
    setStatus(task.status);
  };

  return (
    <Container>
      <h1 className="mt-5 text-center">Task List</h1>
      <Form onSubmit={handleSubmit} className="mb-3">
        <Form.Group className="mb-3">
          <Form.Label>Title</Form.Label>
          <Form.Control
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Description</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </Form.Group>
        <Form.Group className="form-check mb-3">
          <Form.Check
            type="checkbox"
            label="Completed"
            checked={status}
            onChange={(e) => setStatus(e.target.checked)}
          />
        </Form.Group>
        <Button variant="primary" type="submit">
          {editingTask ? 'Update Task' : 'Add Task'}
        </Button>
      </Form>
      <ListGroup>
        {tasks.map((task) => (
          <ListGroup.Item key={task.id} className="d-flex justify-content-between align-items-center">
            <div>
              <h5>{task.title}</h5>
              <p>{task.description}</p>
              <p>{task.status ? 'Completed' : 'Not Completed'}</p>
            </div>
            <div>
              <Button variant="secondary" className="me-2" onClick={() => handleEdit(task)}>
                Edit
              </Button>
              <Button variant="danger" onClick={() => handleDelete(task.id)}>
                Delete
              </Button>
            </div>
          </ListGroup.Item>
        ))}
      </ListGroup>
    </Container>
  );
}

export default App;
