"use client";

import { Task } from "@/services/taskService";

interface TaskItemProps {
  task: Task;
  onToggle: (id: string, currentStatus: boolean) => void;
  onDelete: (id: string) => void;
  onEdit: (task: Task) => void;
}

export default function TaskItem({
  task,
  onToggle,
  onDelete,
  onEdit,
}: TaskItemProps) {
  return (
    <div className="glass p-4 rounded-2xl flex items-center justify-between active:bg-white/5 transition-colors group">
      <div className="flex items-center gap-4 flex-1">
        {/* Checkbox Hitbox */}
        <label className="relative flex items-center p-2 rounded-full cursor-pointer">
          <input
            type="checkbox"
            checked={task.status}
            onChange={() => onToggle(task.id, task.status)}
            className="w-6 h-6 rounded-lg accent-blue-500 border-white/20 cursor-pointer"
          />
        </label>

        {/* Content Area */}
        <div onClick={() => onEdit(task)} className="flex-1 cursor-pointer">
          <h3
            className={`font-medium text-[17px] leading-tight transition-all ${
              task.status ? "line-through text-gray-500" : "text-white"
            }`}
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

      {/* Delete Button */}
      <button
        onClick={(e) => {
          e.stopPropagation(); // Prevents triggering the Edit click
          onDelete(task.id);
        }}
        className="p-2 text-gray-600 hover:text-red-500 active:text-red-400 transition-colors"
        aria-label="Delete task"
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
  );
}
