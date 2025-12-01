import Badge from "../ui/badge/Badge";
import { CalenderIcon } from "../../icons";

export interface DeadlineItem {
  id: string | number;
  title: string;
  deadline: string;
  daysLeft: number;
  priority: "tinggi" | "sedang" | "rendah";
  assignedBy?: string;
}

interface DeadlineListProps {
  items: DeadlineItem[];
  title?: string;
  onViewAll?: () => void;
  className?: string;
}

const priorityColors = {
  tinggi: "error",
  sedang: "warning",
  rendah: "success",
} as const;

export default function DeadlineList({
  items,
  title = "Deadline Terdekat",
  onViewAll,
  className = "",
}: DeadlineListProps) {
  const getUrgencyColor = (daysLeft: number) => {
    if (daysLeft <= 1) return "text-error-500";
    if (daysLeft <= 3) return "text-warning-500";
    return "text-gray-500";
  };

  const getUrgencyLabel = (daysLeft: number) => {
    if (daysLeft < 0) return "Terlambat!";
    if (daysLeft === 0) return "Hari ini!";
    if (daysLeft === 1) return "Besok";
    return `${daysLeft} hari lagi`;
  };

  return (
    <div
      className={`rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/5 sm:p-6 ${className}`}
    >
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
          {title}
        </h3>
        {onViewAll && (
          <button
            onClick={onViewAll}
            className="text-sm font-medium text-brand-500 hover:text-brand-600"
          >
            Lihat Semua
          </button>
        )}
      </div>

      <ul className="space-y-4">
        {items.map((item) => (
          <li
            key={item.id}
            className="flex items-start gap-4 p-4 rounded-xl border border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition"
          >
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gray-100 dark:bg-gray-800">
              <CalenderIcon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <h4 className="font-medium text-gray-800 dark:text-white/90 truncate">
                  {item.title}
                </h4>
                <Badge size="sm" color={priorityColors[item.priority]}>
                  {item.priority}
                </Badge>
              </div>

              <div className="flex items-center gap-3 mt-2">
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {item.deadline}
                </span>
                <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                <span
                  className={`text-sm font-medium ${getUrgencyColor(
                    item.daysLeft
                  )}`}
                >
                  {getUrgencyLabel(item.daysLeft)}
                </span>
              </div>

              {item.assignedBy && (
                <p className="mt-2 text-xs text-gray-400 dark:text-gray-500">
                  Ditugaskan oleh: {item.assignedBy}
                </p>
              )}
            </div>
          </li>
        ))}
      </ul>

      {items.length === 0 && (
        <p className="text-sm text-center text-gray-500 dark:text-gray-400 py-4">
          Tidak ada deadline dalam waktu dekat
        </p>
      )}
    </div>
  );
}


