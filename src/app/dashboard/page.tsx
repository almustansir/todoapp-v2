"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { db } from "@/lib/firebase/config";
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
} from "firebase/firestore";
import {
  addTask,
  toggleTaskStatus,
  deleteTask,
  updateTask,
  Task,
} from "@/services/taskService";

export default function Dashboard() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");

  // New state to track if we are editing
  const [editingId, setEditingId] = useState<string | null>(null);

  // Real-time listener for user-specific tasks
  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, "tasks"),
      where("userId", "==", user.uid),
      orderBy("createdAt", "desc"),
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const taskData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Task[];
      setTasks(taskData);
    });

    return () => unsubscribe();
  }, [user]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !user) return;
    await addTask(user.uid, title, desc);
    setTitle("");
    setDesc("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !user) return;

    if (editingId) {
      // Logic for UPDATING
      await updateTask(editingId, title, desc);
      setEditingId(null);
    } else {
      // Logic for CREATING
      await addTask(user.uid, title, desc);
    }

    setTitle("");
    setDesc("");
  };

  const startEdit = (task: Task) => {
    setEditingId(task.id);
    setTitle(task.title);
    setDesc(task.description || "");
    window.scrollTo({ top: 0, behavior: "smooth" }); // Scroll up to the form
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20">
      {/* Form Section */}
      <section
        className={`glass p-6 rounded-3xl border-2 transition-all ${editingId ? "border-blue-500/50" : "border-transparent"}`}
      >
        <h2 className="text-xl font-bold mb-4">
          {editingId ? "Edit Task" : "New Task"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title"
            className="w-full bg-white/5 border border-white/10 p-3 rounded-xl focus:border-blue-500 outline-none"
          />
          <textarea
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            placeholder="Description"
            className="w-full bg-white/5 border border-white/10 p-3 rounded-xl focus:border-blue-500 outline-none h-20"
          />
          <div className="flex gap-2">
            <button className="flex-1 bg-blue-600 hover:bg-blue-700 py-3 rounded-xl font-bold transition">
              {editingId ? "Save Changes" : "Add Task"}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={() => {
                  setEditingId(null);
                  setTitle("");
                  setDesc("");
                }}
                className="px-6 bg-white/10 hover:bg-white/20 rounded-xl transition"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </section>

      {/* List Section */}
      <div className="space-y-4">
        {tasks.map((task) => (
          <div
            key={task.id}
            className="glass p-5 rounded-2xl flex items-center justify-between group"
          >
            <div className="flex items-start gap-4 flex-1">
              <input
                type="checkbox"
                checked={task.status}
                onChange={() => toggleTaskStatus(task.id, task.status)}
                className="mt-1.5 w-5 h-5 accent-blue-500 cursor-pointer"
              />
              <div>
                <h3
                  className={`font-semibold ${task.status ? "line-through text-gray-500" : ""}`}
                >
                  {task.title}
                </h3>
                <p className="text-sm text-gray-400">{task.description}</p>
              </div>
            </div>

            <div className="flex gap-2 transition-opacity">
              <button
                onClick={() => startEdit(task)}
                className="text-blue-400 hover:text-blue-300 text-sm font-medium"
              >
                Edit
              </button>
              <button
                onClick={() => deleteTask(task.id)}
                className="text-red-500 hover:text-red-400 text-sm font-medium"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
