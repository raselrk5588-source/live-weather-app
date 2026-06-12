import React, { useState } from 'react';
import styles from './TaskReminder.module.css';
import { CheckSquare, Plus, Trash2, CalendarCheck } from 'lucide-react';
import { toBengaliNumber } from '../utils/number';

interface Task {
  id: number;
  text: string;
  completed: boolean;
}

export default function TaskReminder() {
  const [tasks, setTasks] = useState<Task[]>([
    { id: 1, text: 'বিকেলে জমিতে সেচ দেওয়া', completed: false },
    { id: 2, text: 'পোকামাকড়ের জন্য স্প্রে করা', completed: false },
    { id: 3, text: 'কৃষি অফিসে কথা বলা', completed: true },
  ]);
  const [newTask, setNewTask] = useState('');

  const toggleTask = (id: number) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const addTask = () => {
    if (newTask.trim() === '') return;
    setTasks([...tasks, { id: Date.now(), text: newTask, completed: false }]);
    setNewTask('');
  };

  const deleteTask = (id: number) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  const remaining = tasks.filter(t => !t.completed).length;

  return (
    <div className={`${styles.reminderContainer} glass-panel`}>
      <div className={styles.header}>
        <div className={styles.titleRow}>
          <CalendarCheck size={20} className={styles.iconCal} />
          <h3>কাজের রিমাইন্ডার</h3>
        </div>
        <span className={styles.taskCount}>{toBengaliNumber(remaining)}টি বাকি</span>
      </div>

      <div className={styles.taskList}>
        {tasks.map(task => (
          <div key={task.id} className={`${styles.taskItem} ${task.completed ? styles.taskCompleted : ''}`}>
            <button className={styles.checkBtn} onClick={() => toggleTask(task.id)}>
              <CheckSquare size={20} className={task.completed ? styles.iconChecked : styles.iconUnchecked} />
            </button>
            <span className={styles.taskText}>{task.text}</span>
            <button className={styles.deleteBtn} onClick={() => deleteTask(task.id)}>
              <Trash2 size={16} />
            </button>
          </div>
        ))}
        {tasks.length === 0 && (
          <div style={{textAlign:'center', color:'var(--text-secondary)', marginTop:'20px'}}>
            কোনো কাজ বাকি নেই!
          </div>
        )}
      </div>

      <div className={styles.inputRow}>
        <input 
          type="text" 
          value={newTask} 
          onChange={(e) => setNewTask(e.target.value)} 
          placeholder="নতুন কাজ লিখুন..." 
          className={styles.taskInput}
          onKeyPress={(e) => e.key === 'Enter' && addTask()}
        />
        <button className={styles.addBtn} onClick={addTask}>
          <Plus size={20} />
        </button>
      </div>
    </div>
  );
}
