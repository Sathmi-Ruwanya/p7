import React, { useState, useEffect } from "react";
import "./App.css";

function formatDate(timestamp) {
  if (!timestamp) return "";
  const date = new Date(timestamp);
  return isNaN(date.getTime()) ? "" : date.toLocaleString();
}

function App() {
  const [tasks, setTasks] = useState([]);
  const [deletedTasks, setDeletedTasks] = useState([]);
  const [input, setInput] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");

  useEffect(() => {
    const savedTasks = localStorage.getItem("tasks");
    const savedDeleted = localStorage.getItem("deletedTasks");

    if (savedTasks) {
      try {
        setTasks(JSON.parse(savedTasks));
      } catch (error) {
        console.warn("Could not parse saved tasks:", error);
      }
    }

    if (savedDeleted) {
      try {
        setDeletedTasks(JSON.parse(savedDeleted));
      } catch (error) {
        console.warn("Could not parse deleted tasks:", error);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem("deletedTasks", JSON.stringify(deletedTasks));
  }, [deletedTasks]);

  // Add task
  const addTask = () => {
    const trimmed = input.trim();
    if (trimmed === "") return;

    const timestamp = new Date().toISOString();
    const newTask = {
      id: Date.now(),
      text: trimmed,
      completed: false,
      createdAt: timestamp,
      updatedAt: timestamp,
    };

    setTasks([...tasks, newTask]);
    setInput("");
  };

  const deleteTask = (id) => {
    const removed = tasks.find((task) => task.id === id);
    if (!removed) return;

    setTasks(tasks.filter((task) => task.id !== id));
    setDeletedTasks([
      ...deletedTasks,
      { ...removed, deletedAt: new Date().toISOString() },
    ]);

    if (editingId === id) {
      setEditingId(null);
      setEditText("");
    }
  };

  const startEdit = (task) => {
    setEditingId(task.id);
    setEditText(task.text);
  };

  const saveEdit = (id) => {
    const trimmed = editText.trim();
    if (trimmed === "") return;

    setTasks(
      tasks.map((task) =>
        task.id === id
          ? { ...task, text: trimmed, updatedAt: new Date().toISOString() }
          : task
      )
    );
    setEditingId(null);
    setEditText("");
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditText("");
  };

  const handleAddKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      addTask();
    }
  };

  const handleEditKeyDown = (event, id) => {
    if (event.key === "Enter") {
      event.preventDefault();
      saveEdit(id);
    }
    if (event.key === "Escape") {
      cancelEdit();
    }
  };

  // Toggle complete
  const toggleTask = (id) => {
    setTasks(
      tasks.map((task) =>
        task.id === id
          ? {
              ...task,
              completed: !task.completed,
              updatedAt: new Date().toISOString(),
            }
          : task
      )
    );
  };

  return (
    <div className="container">
      <h1>To-Do App</h1>

      <div className="input-section">
        <input
          type="text"
          value={input}
          placeholder="Enter a task..."
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleAddKeyDown}
        />
        <button onClick={addTask}>Add</button>
      </div>

      <table className="task-table">
        <thead>
          <tr>
            <th>Task</th>
            <th>Added</th>
            <th>Updated</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((task) => (
            <tr key={task.id}>
              <td>
                {editingId === task.id ? (
                  <input
                    type="text"
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    onKeyDown={(e) => handleEditKeyDown(e, task.id)}
                  />
                ) : (
                  <span className={task.completed ? "completed" : ""}>
                    {task.text}
                  </span>
                )}
              </td>
              <td>{formatDate(task.createdAt)}</td>
              <td>{formatDate(task.updatedAt)}</td>
              <td>{task.completed ? "Done" : "Open"}</td>
              <td>
                {editingId === task.id ? (
                  <>
                    <button onClick={() => saveEdit(task.id)}>Save</button>
                    <button onClick={cancelEdit}>Cancel</button>
                  </>
                ) : (
                  <>
                    <button onClick={() => startEdit(task)}>Edit</button>
                    <button onClick={() => toggleTask(task.id)}>
                      {task.completed ? "Undo" : "Done"}
                    </button>
                    <button onClick={() => deleteTask(task.id)}>Delete</button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {deletedTasks.length > 0 && (
        <div className="deleted-section">
          <h2>Deleted Tasks</h2>
          <table className="task-table">
            <thead>
              <tr>
                <th>Task</th>
                <th>Added</th>
                <th>Updated</th>
                <th>Deleted</th>
              </tr>
            </thead>
            <tbody>
              {deletedTasks.map((task) => (
                <tr key={task.id}>
                  <td>{task.text}</td>
                  <td>{formatDate(task.createdAt)}</td>
                  <td>{formatDate(task.updatedAt)}</td>
                  <td>{formatDate(task.deletedAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default App;