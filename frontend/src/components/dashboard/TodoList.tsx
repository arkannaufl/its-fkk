import { useState } from "react";
import Checkbox from "../form/input/Checkbox";
import Badge from "../ui/badge/Badge";

export interface TodoItem {
  id: string | number;
  title: string;
  completed: boolean;
  priority?: "tinggi" | "sedang" | "rendah";
  deadline?: string;
}

interface TodoListProps {
  initialItems: TodoItem[];
  title?: string;
  onToggle?: (id: string | number, completed: boolean) => void;
  onAddNew?: () => void;
  className?: string;
}

const priorityColors = {
  tinggi: "error",
  sedang: "warning",
  rendah: "success",
} as const;

export default function TodoList({
  initialItems,
  title = "To-do List",
  onToggle,
  onAddNew,
  className = "",
}: TodoListProps) {
  const [items, setItems] = useState(initialItems);

  const handleToggle = (id: string | number, completed: boolean) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, completed } : item
      )
    );
    onToggle?.(id, completed);
  };

  const completedCount = items.filter((item) => item.completed).length;
  const totalCount = items.length;

  return (
    <div
      className={`rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/5 sm:p-6 ${className}`}
    >
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            {title}
          </h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {completedCount} dari {totalCount} selesai
          </p>
        </div>
        {onAddNew && (
          <button
            onClick={onAddNew}
            className="inline-flex items-center justify-center w-9 h-9 rounded-lg bg-brand-500 text-white hover:bg-brand-600 transition"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M10 4.16666V15.8333M4.16666 10H15.8333"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        )}
      </div>

      {/* Progress bar */}
      <div className="mb-5">
        <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-800">
          <div
            className="h-2 bg-brand-500 rounded-full transition-all duration-300"
            style={{
              width: `${totalCount > 0 ? (completedCount / totalCount) * 100 : 0}%`,
            }}
          ></div>
        </div>
      </div>

      <ul className="space-y-3">
        {items.map((item) => (
          <li
            key={item.id}
            className={`flex items-center justify-between p-3 rounded-lg border ${
              item.completed
                ? "bg-gray-50 border-gray-100 dark:bg-gray-800/50 dark:border-gray-700"
                : "bg-white border-gray-200 dark:bg-gray-900 dark:border-gray-700"
            }`}
          >
            <div className="flex items-center gap-3 flex-1">
              <Checkbox
                checked={item.completed}
                onChange={(checked) => handleToggle(item.id, checked)}
              />
              <span
                className={`text-sm ${
                  item.completed
                    ? "text-gray-400 line-through"
                    : "text-gray-800 dark:text-white/90"
                }`}
              >
                {item.title}
              </span>
            </div>

            <div className="flex items-center gap-2">
              {item.priority && !item.completed && (
                <Badge size="sm" color={priorityColors[item.priority]}>
                  {item.priority}
                </Badge>
              )}
              {item.deadline && !item.completed && (
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {item.deadline}
                </span>
              )}
            </div>
          </li>
        ))}
      </ul>

      {items.length === 0 && (
        <p className="text-sm text-center text-gray-500 dark:text-gray-400 py-4">
          Tidak ada tugas
        </p>
      )}
    </div>
  );
}


