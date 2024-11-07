"use client";

import { useAuth } from '../context/AuthContext';
import Login from '../components/Login';
import { useState, useEffect } from "react";
import { db } from '../firebase/config';
import { 
  collection, 
  addDoc, 
  deleteDoc,
  updateDoc,
  doc, 
  query, 
  where,
  getDocs,
  onSnapshot,
  orderBy
} from 'firebase/firestore';
import styles from "./page.module.css";

export default function Home() {
  const { user, logout, loading } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [editingTask, setEditingTask] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
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

  // Use real-time listener for tasks
  useEffect(() => {
    if (!user) return;

    // Create query for user-specific tasks
    const tasksQuery = query(
      collection(db, 'tasks'),
      where('userId', '==', user.uid),
      orderBy('createdAt', 'desc')
    );

    // Set up real-time listener
    const unsubscribe = onSnapshot(tasksQuery, (snapshot) => {
      const tasksList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setTasks(tasksList);
      setIsLoading(false);
    }, (error) => {
      console.error("Error fetching tasks:", error);
      setIsLoading(false);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [user]);

  // Add task to Firestore
  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!newTask.title || !newTask.deadline || !newTask.details) return;
    
    const hasDuration = newTask.duration.minutes || 
                       newTask.duration.hours || 
                       newTask.duration.days;
    if (!hasDuration) {
      alert("Please specify task duration in at least one unit");
      return;
    }

    try {
      const taskData = {
        ...newTask,
        userId: user.uid,
        createdAt: new Date().toISOString()
      };

      const docRef = await addDoc(collection(db, 'tasks'), taskData);
      
      setTasks([...tasks, { ...taskData, id: docRef.id }]);
      setNewTask({
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
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  // Delete task from Firestore
  const handleDeleteTask = async (taskId) => {
    try {
      await deleteDoc(doc(db, 'tasks', taskId));
      setTasks(tasks.filter(task => task.id !== taskId));
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  // Update task in Firestore
  const handleUpdateTask = async (e) => {
    e.preventDefault();
    
    const hasDuration = editingTask.duration.minutes || 
                       editingTask.duration.hours || 
                       editingTask.duration.days;
    if (!hasDuration) {
      alert("Please specify task duration in at least one unit");
      return;
    }

    try {
      const taskRef = doc(db, 'tasks', editingTask.id);
      const taskData = {
        ...editingTask,
        updatedAt: new Date().toISOString()
      };
      
      await updateDoc(taskRef, taskData);
      
      setTasks(tasks.map(task => 
        task.id === editingTask.id ? taskData : task
      ));
      setEditingTask(null);
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

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
