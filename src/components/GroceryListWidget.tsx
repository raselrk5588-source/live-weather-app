"use client";

import { useState, useEffect } from "react";
import styles from "./GroceryListWidget.module.css";
import { ShoppingCart, Plus, Check, Trash2 } from "lucide-react";

interface GroceryItem {
  id: string;
  text: string;
  completed: boolean;
}

export default function GroceryListWidget() {
  const [items, setItems] = useState<GroceryItem[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [loaded, setLoaded] = useState(false);

  // Load from local storage
  useEffect(() => {
    const saved = localStorage.getItem("helpFarming_groceryList");
    if (saved) {
      try {
        setItems(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse grocery list");
      }
    }
    setLoaded(true);
  }, []);

  // Save to local storage
  useEffect(() => {
    if (loaded) {
      localStorage.setItem("helpFarming_groceryList", JSON.stringify(items));
    }
  }, [items, loaded]);

  const handleAddItem = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputValue.trim()) return;

    const newItem: GroceryItem = {
      id: Date.now().toString(),
      text: inputValue.trim(),
      completed: false
    };

    setItems([...items, newItem]);
    setInputValue("");
  };

  const toggleItem = (id: string) => {
    setItems(items.map(item => 
      item.id === id ? { ...item, completed: !item.completed } : item
    ));
  };

  const deleteItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };

  if (!loaded) return null;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.iconWrapper}>
          <ShoppingCart size={22} />
        </div>
        <h2 className={styles.title}>বাজারের তালিকা</h2>
      </div>

      <form className={styles.inputGroup} onSubmit={handleAddItem}>
        <input 
          type="text" 
          className={styles.input} 
          placeholder="কী কিনতে হবে? (যেমন: আলু, পেঁয়াজ)"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />
        <button 
          type="submit" 
          className={styles.addBtn}
          disabled={!inputValue.trim()}
        >
          <Plus size={20} />
        </button>
      </form>

      <div className={styles.list}>
        {items.length === 0 ? (
          <div className={styles.emptyState}>
            তালিকায় কিছু নেই। নতুন আইটেম যোগ করুন।
          </div>
        ) : (
          items.map(item => (
            <div key={item.id} className={`${styles.item} ${item.completed ? styles.itemCompleted : ''}`}>
              <div className={styles.itemLeft} onClick={() => toggleItem(item.id)}>
                <div className={styles.checkbox}>
                  {item.completed && <Check size={14} color="white" />}
                </div>
                <span className={styles.itemText}>{item.text}</span>
              </div>
              <button 
                className={styles.deleteBtn}
                onClick={(e) => {
                  e.stopPropagation();
                  deleteItem(item.id);
                }}
              >
                <Trash2 size={18} />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
