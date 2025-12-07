import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import Badge from "../ui/badge/Badge";

export type TaskStatus = "baru" | "proses" | "review" | "selesai" | "ditolak";
export type TaskPriority = "tinggi" | "sedang" | "rendah";

export interface Task {
  id: string | number;
  title: string;
  assignee?: {
    name: string;
    avatar?: string;
    unit?: string;
  };
  priority: TaskPriority;
  status: TaskStatus;
  deadline: string;
  createdAt?: string;
}

interface TaskTableProps {
  tasks: Task[];
  title?: string;
  showAssignee?: boolean;
  showPriority?: boolean;
  showCreatedAt?: boolean;
  onViewAll?: () => void;
  className?: string;
}

const statusColors: Record<TaskStatus, "success" | "warning" | "error" | "info" | "primary"> = {
  baru: "info",
  proses: "warning",
  review: "primary",
  selesai: "success",
  ditolak: "error",
};

const statusLabels: Record<TaskStatus, string> = {
  baru: "Baru",
  proses: "Dalam Proses",
  review: "Review",
  selesai: "Selesai",
  ditolak: "Ditolak",
};

const priorityColors: Record<TaskPriority, "error" | "warning" | "success"> = {
  tinggi: "error",
  sedang: "warning",
  rendah: "success",
};

const priorityLabels: Record<TaskPriority, string> = {
  tinggi: "Tinggi",
  sedang: "Sedang",
  rendah: "Rendah",
};

export default function TaskTable({
  tasks,
  title = "Daftar Tugas",
  showAssignee = true,
  showPriority = true,
  showCreatedAt = false,
  onViewAll,
  className = "",
}: TaskTableProps) {
  return (
    <div
      className={`overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/5 sm:px-6 ${className}`}
    >
      <div className="flex flex-col gap-2 mb-4 sm:flex-row sm:items-center sm:justify-between">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
          {title}
        </h3>
        {onViewAll && (
          <button
            onClick={onViewAll}
            className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-theme-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-200"
            aria-label={`View all ${title.toLowerCase()}`}
          >
            Lihat Semua
          </button>
        )}
      </div>

      <div className="max-w-full overflow-x-auto custom-scrollbar">
        <Table>
          <TableHeader className="border-gray-100 dark:border-gray-800 border-y">
            <TableRow>
              <TableCell
                isHeader
                className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Tugas
              </TableCell>
              {showAssignee && (
                <TableCell
                  isHeader
                  className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Ditugaskan
                </TableCell>
              )}
              {showPriority && (
                <TableCell
                  isHeader
                  className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Prioritas
                </TableCell>
              )}
              <TableCell
                isHeader
                className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Status
              </TableCell>
              <TableCell
                isHeader
                className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                {showCreatedAt ? "Dibuat" : "Deadline"}
              </TableCell>
            </TableRow>
          </TableHeader>

          <TableBody className="divide-y divide-gray-100 dark:divide-gray-800">
            {tasks.map((task) => (
              <TableRow key={task.id}>
                <TableCell className="py-3">
                  <p className="font-medium text-gray-800 text-theme-sm dark:text-white/90">
                    {task.title}
                  </p>
                </TableCell>
                {showAssignee && (
                  <TableCell className="py-3">
                    {task.assignee ? (
                      <div className="flex items-center gap-2">
                        {task.assignee.avatar && (
                          <img
                            src={task.assignee.avatar}
                            alt={`Avatar of ${task.assignee.name}`}
                            className="w-8 h-8 rounded-full"
                            loading="lazy"
                          />
                        )}
                        <div>
                          <p className="text-sm text-gray-800 dark:text-white/90">
                            {task.assignee.name}
                          </p>
                          {task.assignee.unit && (
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {task.assignee.unit}
                            </p>
                          )}
                        </div>
                      </div>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </TableCell>
                )}
                {showPriority && (
                  <TableCell className="py-3">
                    <Badge size="sm" color={priorityColors[task.priority]}>
                      {priorityLabels[task.priority]}
                    </Badge>
                  </TableCell>
                )}
                <TableCell className="py-3">
                  <Badge size="sm" color={statusColors[task.status]}>
                    {statusLabels[task.status]}
                  </Badge>
                </TableCell>
                <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                  {showCreatedAt ? task.createdAt : task.deadline}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {tasks.length === 0 && (
          <p className="text-sm text-center text-gray-500 dark:text-gray-400 py-8">
            Tidak ada tugas
          </p>
        )}
      </div>
    </div>
  );
}


