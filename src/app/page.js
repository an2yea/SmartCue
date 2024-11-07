"use client";

import { useAuth } from '../context/AuthContext';
import Login from '../components/Login';
import { useState, useEffect } from "react";
import { db, generativeModel } from '../firebase/config';
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
import animations from './animations.module.css';

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
  const [userContext, setUserContext] = useState("");
  const [recommendedTask, setRecommendedTask] = useState("");

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

      await addDoc(collection(db, 'tasks'), taskData);
      
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
      const task = tasks.find(t => t.id === taskId);
      if (task.userId !== user.uid) {
        alert("You are not authorized to delete this task.");
        return;
      }

      await deleteDoc(doc(db, 'tasks', taskId));
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
      if (editingTask.userId !== user.uid) {
        alert("You are not authorized to update this task.");
        return;
      }

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

  // Function to handle context submission
  const handleContextSubmit = async () => {
    try {
      const input = {
        tasks,
        context: userContext
      };

      const prompt = "You are a task recommendation engine. You are given a list of tasks and a user's current context. Your task is to recommend a new task that the user should complete next. The user's context is: " + userContext + ". The tasks are: " + JSON.stringify(tasks);
      const result = await generativeModel.generateContent(prompt);
      const response = result.response.text();
      setRecommendedTask(response);
    } catch (error) {
      console.error("Error with Vertex AI:", error);
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
        <div className={`${styles.header} ${animations.fadeIn}`}>
          <h1>SmartCue</h1>
          <div className={styles.userInfo}>
            <span>Welcome, {user.email}</span>
            <button 
              onClick={logout} 
              className={`${styles.button} ${styles.secondary} ${animations.scaleIn} ${animations['delay-1']}`}
            >
              Logout
            </button>
          </div>
        </div>
        
        {/* Context Input */}
        <div className={`${styles.contextInput} ${animations.fadeIn} ${animations['delay-2']}`}>
          <h2>What's your current situation?</h2>
          <textarea
            placeholder="Describe your current context (e.g., 'In a cab for 30 minutes with internet access')"
            value={userContext}
            onChange={(e) => setUserContext(e.target.value)}
          />
          <button 
            onClick={handleContextSubmit} 
            className={`${styles.button} ${animations.scaleIn}`}
          >
            Get Task Recommendation
          </button>
        </div>

        {/* Recommendation Display */}
        {recommendedTask && (
          <div className={`${styles.recommendation} ${animations.slideIn}`}>
            <h2>Recommended Task:</h2>
            <div className={styles.recommendationContent}>
              <p>{recommendedTask}</p>
            </div>
          </div>
        )}

        {/* Task Form */}
        <form onSubmit={handleAddTask} className={`${styles.taskForm} ${animations.fadeIn}`}>
          <h2>Add New Task</h2>
          <div className="mb-3">
            <input
              type="text"
              className="form-control"
              placeholder="Task title"
              value={newTask.title}
              onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
              required
            />
          </div>
          <div className="mb-3">
            <textarea
              className="form-control"
              placeholder="Task details"
              value={newTask.details}
              onChange={(e) => setNewTask({ ...newTask, details: e.target.value })}
              required
            />
          </div>
          <div className="mb-3">
            <input
              type="date"
              className="form-control"
              value={newTask.deadline}
              onChange={(e) => setNewTask({ ...newTask, deadline: e.target.value })}
              required
            />
          </div>
          <div className="mb-3">
            <select
              className="form-select"
              value={newTask.complexity}
              onChange={(e) => setNewTask({ ...newTask, complexity: e.target.value })}
              required
            >
              <option value="">Select Complexity</option>
              {complexityOptions.map(option => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>
          <div className={`${styles.durationInputs} mb-3`}>
            <input
              type="number"
              className="form-control"
              min="0"
              placeholder="Minutes"
              value={newTask.duration.minutes}
              onChange={(e) => setNewTask({
                ...newTask,
                duration: { ...newTask.duration, minutes: e.target.value }
              })}
            />
            <input
              type="number"
              className="form-control"
              min="0"
              placeholder="Hours"
              value={newTask.duration.hours}
              onChange={(e) => setNewTask({
                ...newTask,
                duration: { ...newTask.duration, hours: e.target.value }
              })}
            />
            <input
              type="number"
              className="form-control"
              min="0"
              placeholder="Days"
              value={newTask.duration.days}
              onChange={(e) => setNewTask({
                ...newTask,
                duration: { ...newTask.duration, days: e.target.value }
              })}
            />
          </div>
          <button type="submit" className={`${styles.button} ${styles.primary}`}>
            Add Task
          </button>
        </form>

        {/* Task List */}
        <div className={styles.taskList}>
          {tasks.map((task) => (
            <div key={task.id} className={styles.taskItem}>
              <div className={styles.taskHeader}>
                <h3>{task.title}</h3>
              </div>
              <div className={styles.taskContent}>
                <div className={styles.taskInfo}>
                  <p>
                    <span className={styles.taskLabel}>Details:</span>
                    {task.details}
                  </p>
                  <p>
                    <span className={styles.taskLabel}>Deadline:</span>
                    {new Date(task.deadline).toLocaleDateString()}
                  </p>
                  <p>
                    <span className={styles.taskLabel}>Complexity:</span>
                    {task.complexity}
                  </p>
                  <p>
                    <span className={styles.taskLabel}>Duration:</span>
                    {task.duration.days > 0 && `${task.duration.days} days `}
                    {task.duration.hours > 0 && `${task.duration.hours} hours `}
                    {task.duration.minutes > 0 && `${task.duration.minutes} minutes`}
                  </p>
                </div>
                <div className={styles.taskButtons}>
                  <button 
                    onClick={() => handleDeleteTask(task.id)} 
                    className={`${styles.button} ${styles.secondary}`}
                  >
                    Delete
                  </button>
                  <button 
                    onClick={() => handleEditTask(task)} 
                    className={`${styles.button} ${styles.primary}`}
                  >
                    Edit
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
