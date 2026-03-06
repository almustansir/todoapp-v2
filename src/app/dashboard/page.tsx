"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { db } from "@/lib/firebase/config";
import { useRouter } from "next/navigation"; // Ensure this import exists
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
  const { user, loading } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState<"all" | "completed" | "pending">("all");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

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

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth"); // Redirect to auth if not logged in
    }
  }, [user, loading, router]);

  // Real-time listener for user-specific tasks
  useEffect(() => {
    // 1. Guard clause: If no user, don't return anything (implicitly returns undefined/void)
    if (!user) return;

    const q = query(
      collection(db, "tasks"),
      where("userId", "==", user.uid),
      orderBy("createdAt", "desc"),
    );

    // 2. onSnapshot returns a function that unsubscribes the listener
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const taskData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Task[];
      setTasks(taskData);
    });

    // 3. Always return the unsubscribe function for cleanup
    return () => unsubscribe();
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Logic to clear form and exit edit mode
  const cancelEdit = () => {
    setEditingId(null);
    setTitle("");
    setDesc("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // ADD THIS LINE: If there's no title, no user, or we're already submitting, stop.
    if (!title.trim() || !user || isSubmitting) return;

    setIsSubmitting(true);
    try {
      if (editingId) {
        await updateTask(editingId, title, desc);
        setEditingId(null);
      } else {
        // TypeScript now knows 'user' is NOT null here because of the check above
        await addTask(user.uid, title, desc);
      }
      cancelEdit();
      setTitle("");
      setDesc("");
    } catch (err) {
      console.error("Failed to save task:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // const handleSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault();
  //   if (!title.trim() || isSubmitting) return;

  //   setIsSubmitting(true);
  //   try {
  //     if (editingId) {
  //       // Logic for UPDATING
  //       await updateTask(editingId, title, desc);
  //       setEditingId(null);
  //     } else {
  //       // Logic for CREATING
  //       await addTask(user.uid, title, desc);
  //     }
  //     cancelEdit(); // Reusing the function here to clean up
  //     setTitle("");
  //     setDesc("");
  //   } finally {
  //     setIsSubmitting(false);
  //   }
  // };

  // const handleSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault();
  //   if (!title.trim() || !user) return;

  //   if (editingId) {
  //     // Logic for UPDATING
  //     await updateTask(editingId, title, desc);
  //     setEditingId(null);
  //   } else {
  //     // Logic for CREATING
  //     await addTask(user.uid, title, desc);
  //   }
  //   cancelEdit(); // Reusing the function here to clean up

  //   setTitle("");
  //   setDesc("");
  // };

  const startEdit = (task: Task) => {
    setEditingId(task.id);
    setTitle(task.title);
    setDesc(task.description || "");
    window.scrollTo({ top: 0, behavior: "smooth" }); // Scroll up to the form
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20">
      {/* Form Section */}
      {/* Task Form: Now more compact for mobile, expands on focus */}
      <section className="glass p-4 rounded-2xl mb-6">
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Type a new task..."
            className="w-full bg-white/5 border border-white/10 p-4 rounded-xl text-lg focus:border-blue-500 outline-none placeholder:text-gray-500"
          />

          {/* Collapsible description to save space */}
          {(title || editingId) && (
            <div className="flex flex-col gap-3 animate-in fade-in slide-in-from-top-2">
              <textarea
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
                placeholder="Details (optional)"
                className="w-full bg-white/5 border border-white/10 p-3 rounded-xl focus:border-blue-500 outline-none h-20 text-sm"
              />
              <div className="flex gap-2">
                <button
                  disabled={isSubmitting}
                  className={`flex-1 bg-blue-600 active:scale-95 py-4 rounded-xl font-bold transition-transform ${isSubmitting ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  {editingId ? "Update Task" : "Add Task"}
                </button>
                {editingId && (
                  <button
                    type="button" // This prevents the form from submitting
                    onClick={cancelEdit}
                    className="px-6 bg-white/10 rounded-xl"
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>
          )}
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
      <div className="space-y-3 px-1">
        {filteredTasks.length === 0 && (
          <div className="text-center py-20 opacity-50">
            <p className="text-sm font-medium">Your task list is empty.</p>
            <p className="text-xs">Add a task above to get started!</p>
          </div>
        )}

        {filteredTasks.map((task) => (
          <div
            key={task.id}
            className="glass p-4 rounded-2xl flex items-center justify-between active:bg-white/5 transition-colors"
          >
            <div className="flex items-center gap-4 flex-1">
              {/* Larger Checkbox Hitbox */}
              <label className="relative flex items-center p-2 rounded-full cursor-pointer">
                <input
                  type="checkbox"
                  checked={task.status}
                  onChange={() => toggleTaskStatus(task.id, task.status)}
                  className="w-6 h-6 rounded-lg accent-blue-500 border-white/20"
                />
              </label>

              <div
                onClick={() => startEdit(task)}
                className="flex-1 cursor-pointer"
              >
                <h3
                  className={`font-medium text-[17px] leading-tight ${task.status ? "line-through text-gray-500" : "text-white"}`}
                >
                  {task.title}
                </h3>
                {task.description && (
                  <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">
                    {task.description}
                  </p>
                )}
              </div>
            </div>

            {/* Swipe actions replacement for desktop 'hover' */}
            <button
              onClick={() => deleteTask(task.id)}
              className="p-2 text-gray-600 hover:text-red-500 active:text-red-400"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
