"use client";

import { useState } from "react";
import styles from "./page.module.css";

export default function Home() {
  const [tasks, setTasks] = useState([]);
  const [editingTask, setEditingTask] = useState(null);
  const [newTask, setNewTask] = useState({
    title: "",
    deadline: "",
    complexity: "",
    timeEstimate: "",
    category: "",
  });

  // Predefined options for complexity and categories
  const complexityOptions = ["Quick (2-5 mins)", "Easy (< 1 hour)", "Medium (few hours)", "Complex (days)", "Major Project (weeks)"];
  const categoryOptions = ["Work", "Personal", "Hobby", "Health", "Learning", "Errands", "Other"];

  const handleAddTask = (e) => {
    e.preventDefault();
    if (!newTask.title || !newTask.deadline) return;
    
    setTasks([...tasks, { ...newTask, id: Date.now() }]);
    setNewTask({
      title: "",
      deadline: "",
      complexity: "",
      timeEstimate: "",
      category: "",
    });
  };

  const handleDeleteTask = (taskId) => {
    setTasks(tasks.filter(task => task.id !== taskId));
  };

  const handleEditClick = (task) => {
    setEditingTask(task);
  };

  const handleUpdateTask = (e) => {
    e.preventDefault();
    setTasks(tasks.map(task => 
      task.id === editingTask.id ? editingTask : task
    ));
    setEditingTask(null);
  };

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <h1>Task Tracker</h1>
        
        {/* Add Task Form */}
        <form onSubmit={handleAddTask} className={styles.taskForm}>
          <div className={styles.formGroup}>
            <input
              type="text"
              placeholder="Task title"
              value={newTask.title}
              onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
            />
            <input
              type="date"
              value={newTask.deadline}
              onChange={(e) => setNewTask({ ...newTask, deadline: e.target.value })}
            />
            <select
              value={newTask.complexity}
              onChange={(e) => setNewTask({ ...newTask, complexity: e.target.value })}
            >
              <option value="">Select Complexity</option>
              {complexityOptions.map(option => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
            <input
              type="text"
              placeholder="Custom time estimate (optional)"
              value={newTask.timeEstimate}
              onChange={(e) => setNewTask({ ...newTask, timeEstimate: e.target.value })}
            />
            <select
              value={newTask.category}
              onChange={(e) => setNewTask({ ...newTask, category: e.target.value })}
            >
              <option value="">Select Category</option>
              {categoryOptions.map(option => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
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
                    value={editingTask.title}
                    onChange={(e) => setEditingTask({ ...editingTask, title: e.target.value })}
                  />
                  <input
                    type="date"
                    value={editingTask.deadline}
                    onChange={(e) => setEditingTask({ ...editingTask, deadline: e.target.value })}
                  />
                  <select
                    value={editingTask.complexity}
                    onChange={(e) => setEditingTask({ ...editingTask, complexity: e.target.value })}
                  >
                    <option value="">Select Complexity</option>
                    {complexityOptions.map(option => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                  <input
                    type="text"
                    placeholder="Custom time estimate"
                    value={editingTask.timeEstimate}
                    onChange={(e) => setEditingTask({ ...editingTask, timeEstimate: e.target.value })}
                  />
                  <select
                    value={editingTask.category}
                    onChange={(e) => setEditingTask({ ...editingTask, category: e.target.value })}
                  >
                    <option value="">Select Category</option>
                    {categoryOptions.map(option => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
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
                    <p>Deadline: {new Date(task.deadline).toLocaleDateString()}</p>
                    {task.complexity && <p>Complexity: {task.complexity}</p>}
                    {task.timeEstimate && <p>Time Estimate: {task.timeEstimate}</p>}
                    {task.category && <p>Category: {task.category}</p>}
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
