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
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState<"all" | "completed" | "pending">("all");

  // for filter UI
  const counts = {
    all: tasks.length,
    pending: tasks.filter((t) => !t.status).length,
    completed: tasks.filter((t) => t.status).length,
  };

  // New state to track if we are editing
  const [editingId, setEditingId] = useState<string | null>(null);

  // Create a filtered list of tasks based on the search query
  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      filter === "all"
        ? true
        : filter === "completed"
          ? task.status === true
          : filter === "pending"
            ? task.status === false
            : true;

    return matchesSearch && matchesStatus;
  });

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

      {/* Search Bar */}
      <div className="relative mb-6">
        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
          <svg
            className="w-5 h-5 text-gray-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
        <input
          type="text"
          placeholder="Search tasks..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full glass py-4 pl-12 pr-4 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500/50 transition-all placeholder:text-gray-600"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery("")}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white"
          >
            Clear
          </button>
        )}
      </div>
      {/* filters */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2 scrollbar-hide">
        {(["all", "pending", "completed"] as const).map((type) => (
          <button
            key={type}
            onClick={() => setFilter(type)}
            className={`px-5 py-2 rounded-full text-sm font-medium transition-all capitalize ${
              filter === type
                ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20"
                : "glass text-gray-400 hover:text-white"
            }`}
          >
            {type} ({counts[type]})
          </button>
        ))}
      </div>

      {/* List Section */}
      <section className="space-y-4">
        {filteredTasks.length > 0 ? (
          filteredTasks.map((task) => (
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
          ))
        ) : (
          <div className="text-center py-12 opacity-50 italic">
            {searchQuery
              ? "No matching tasks found."
              : "Your task list is empty."}
          </div>
        )}
      </section>
    </div>
  );
}
