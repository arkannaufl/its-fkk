import Avatar from "../ui/avatar/Avatar";

export interface ActivityItem {
  id: string | number;
  user: {
    name: string;
    avatar: string;
    status?: "online" | "offline" | "busy" | "none";
  };
  action: string;
  target?: string;
  time: string;
  category?: string;
}

interface ActivityListProps {
  items: ActivityItem[];
  title?: string;
  maxItems?: number;
  className?: string;
  onViewAll?: () => void;
}

export default function ActivityList({
  items,
  title = "Aktivitas Terbaru",
  maxItems = 5,
  className = "",
  onViewAll,
}: ActivityListProps) {
  const displayItems = items.slice(0, maxItems);

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
        {displayItems.map((item) => (
          <li key={item.id} className="flex gap-3">
            <Avatar
              src={item.user.avatar}
              alt={item.user.name}
              size="medium"
              status={item.user.status}
            />

            <div className="flex-1 min-w-0">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                <span className="font-medium text-gray-800 dark:text-white/90">
                  {item.user.name}
                </span>{" "}
                {item.action}{" "}
                {item.target && (
                  <span className="font-medium text-gray-800 dark:text-white/90">
                    {item.target}
                  </span>
                )}
              </p>

              <div className="flex items-center gap-2 mt-1 text-xs text-gray-500 dark:text-gray-400">
                {item.category && (
                  <>
                    <span>{item.category}</span>
                    <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                  </>
                )}
                <span>{item.time}</span>
              </div>
            </div>
          </li>
        ))}
      </ul>

      {items.length === 0 && (
        <p className="text-sm text-center text-gray-500 dark:text-gray-400 py-4">
          Tidak ada aktivitas terbaru
        </p>
      )}
    </div>
  );
}


