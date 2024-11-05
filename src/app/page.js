"use client";

import { useAuth } from '../context/AuthContext';
import Login from '../components/Login';
import { useState } from "react";
import styles from "./page.module.css";

export default function Home() {
  const { user, logout, loading } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [editingTask, setEditingTask] = useState(null);
  const [newTask, setNewTask] = useState({
    title: "",
    details: "",
    deadline: "",
    complexity: "",
    duration: {
      minutes: "",
      hours: "",
      days: "",
    }
  });

  // Show loading state
  if (loading) {
    return <div>Loading...</div>;
  }

  // Show login if no user
  if (!user) {
    return <Login />;
  }

  const emptyTaskTemplate = {
    title: "",
    details: "",
    deadline: "",
    complexity: "",
    duration: {
      minutes: "",
      hours: "",
      days: "",
    }
  };

  // Predefined options for complexity and categories
  const complexityOptions = ["Quick (2-5 mins)", "Easy (< 1 hour)", "Medium (few hours)", "Complex (days)", "Major Project (weeks)"];
  const categoryOptions = ["Work", "Personal", "Hobby", "Health", "Learning", "Errands", "Other"];

  const handleAddTask = (e) => {
    e.preventDefault();
    if (!newTask.title || !newTask.deadline || !newTask.details) return;
    
    const hasDuration = newTask.duration.minutes || newTask.duration.hours || newTask.duration.days;
    if (!hasDuration) {
      alert("Please specify task duration in at least one unit (minutes, hours, or days)");
      return;
    }
    
    setTasks([...tasks, { ...newTask, id: Date.now() }]);
    setNewTask(emptyTaskTemplate);
  };

  const handleDeleteTask = (taskId) => {
    setTasks(tasks.filter(task => task.id !== taskId));
  };

  const handleEditClick = (task) => {
    // Ensure all form values are defined strings when editing
    const taskToEdit = {
      ...task,
      title: task.title || "",
      details: task.details || "",
      deadline: task.deadline || "",
      complexity: task.complexity || "",
      duration: {
        minutes: task.duration?.minutes || "",
        hours: task.duration?.hours || "",
        days: task.duration?.days || "",
      }
    };
    setEditingTask(taskToEdit);
  };

  const handleUpdateTask = (e) => {
    e.preventDefault();
    
    const hasDuration = editingTask.duration.minutes || 
                       editingTask.duration.hours || 
                       editingTask.duration.days;
    if (!hasDuration) {
      alert("Please specify task duration in at least one unit (minutes, hours, or days)");
      return;
    }

    setTasks(tasks.map(task => 
      task.id === editingTask.id ? editingTask : task
    ));
    setEditingTask(null);
  };

  const formatDuration = (duration) => {
    if (!duration) return "Not specified";
    
    return [
      duration.days && `${duration.days} days`,
      duration.hours && `${duration.hours} hours`,
      duration.minutes && `${duration.minutes} minutes`
    ].filter(Boolean).join(', ') || "Not specified";
  };

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <div className={styles.header}>
          <h1>Task Tracker</h1>
          <div className={styles.userInfo}>
            <span>Welcome, {user.email}</span>
            <button onClick={logout} className={styles.logoutButton}>
              Logout
            </button>
          </div>
        </div>
        
        {/* Add Task Form */}
        <form onSubmit={handleAddTask} className={styles.taskForm}>
          <div className={styles.formGroup}>
            <input
              type="text"
              placeholder="Task title"
              value={newTask.title || ""}
              onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
              required
            />
            <textarea
              placeholder="Task details"
              value={newTask.details || ""}
              onChange={(e) => setNewTask({ ...newTask, details: e.target.value })}
              required
            />
            <input
              type="date"
              value={newTask.deadline || ""}
              onChange={(e) => setNewTask({ ...newTask, deadline: e.target.value })}
              required
            />
            <select
              value={newTask.complexity || ""}
              onChange={(e) => setNewTask({ ...newTask, complexity: e.target.value })}
              required
            >
              <option value="">Select Complexity</option>
              {complexityOptions.map(option => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
            <div className={styles.durationInputs}>
              <input
                type="number"
                min="0"
                placeholder="Minutes"
                value={newTask.duration.minutes || ""}
                onChange={(e) => setNewTask({
                  ...newTask,
                  duration: { ...newTask.duration, minutes: e.target.value }
                })}
              />
              <input
                type="number"
                min="0"
                placeholder="Hours"
                value={newTask.duration.hours || ""}
                onChange={(e) => setNewTask({
                  ...newTask,
                  duration: { ...newTask.duration, hours: e.target.value }
                })}
              />
              <input
                type="number"
                min="0"
                placeholder="Days"
                value={newTask.duration.days || ""}
                onChange={(e) => setNewTask({
                  ...newTask,
                  duration: { ...newTask.duration, days: e.target.value }
                })}
              />
            </div>
            <button type="submit">Add Task</button>
          </div>
        </form>

        {/* Task List */}
        <div className={styles.taskList}>
          {tasks.map((task) => (
            <div key={task.id} className={styles.taskItem}>
              {editingTask?.id === task.id ? (
                // Edit Form
                <form onSubmit={handleUpdateTask} className={styles.editForm}>
                  <input
                    type="text"
                    value={editingTask.title || ""}
                    onChange={(e) => setEditingTask({ ...editingTask, title: e.target.value })}
                    required
                  />
                  <textarea
                    value={editingTask.details || ""}
                    onChange={(e) => setEditingTask({ ...editingTask, details: e.target.value })}
                    required
                  />
                  <input
                    type="date"
                    value={editingTask.deadline || ""}
                    onChange={(e) => setEditingTask({ ...editingTask, deadline: e.target.value })}
                    required
                  />
                  <select
                    value={editingTask.complexity || ""}
                    onChange={(e) => setEditingTask({ ...editingTask, complexity: e.target.value })}
                    required
                  >
                    <option value="">Select Complexity</option>
                    {complexityOptions.map(option => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                  <div className={styles.durationInputs}>
                    <input
                      type="number"
                      min="0"
                      placeholder="Minutes"
                      value={editingTask.duration.minutes || ""}
                      onChange={(e) => setEditingTask({
                        ...editingTask,
                        duration: { ...editingTask.duration, minutes: e.target.value }
                      })}
                    />
                    <input
                      type="number"
                      min="0"
                      placeholder="Hours"
                      value={editingTask.duration.hours || ""}
                      onChange={(e) => setEditingTask({
                        ...editingTask,
                        duration: { ...editingTask.duration, hours: e.target.value }
                      })}
                    />
                    <input
                      type="number"
                      min="0"
                      placeholder="Days"
                      value={editingTask.duration.days || ""}
                      onChange={(e) => setEditingTask({
                        ...editingTask,
                        duration: { ...editingTask.duration, days: e.target.value }
                      })}
                    />
                  </div>
                  <div className={styles.editButtons}>
                    <button type="submit">Save</button>
                    <button type="button" onClick={() => setEditingTask(null)}>Cancel</button>
                  </div>
                </form>
              ) : (
                // Task Display
                <>
                  <div className={styles.taskInfo}>
                    <h3>{task.title}</h3>
                    <p>Details: {task.details || "No details provided"}</p>
                    <p>Deadline: {new Date(task.deadline).toLocaleDateString()}</p>
                    <p>Complexity: {task.complexity || "Not specified"}</p>
                    <p>Duration: {formatDuration(task.duration)}</p>
                  </div>
                  <div className={styles.taskButtons}>
                    <button onClick={() => handleEditClick(task)}>Edit</button>
                    <button onClick={() => handleDeleteTask(task.id)}>Delete</button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
