import React from 'react';
import { useDrag } from 'react-dnd';
import { User } from '../../hooks/useOrganizationalChartData';
import { PencilIcon, TrashBinIcon } from '../../icons';

interface UserCardProps {
  user: User;
  unitId?: number;
  onDelete?: (userId: number) => void;
  onEdit?: (user: User) => void;
}

export const UserCard: React.FC<UserCardProps> = ({ user, unitId, onDelete, onEdit }) => {
  const [{ isDragging }, drag] = useDrag({
    type: 'user',
    item: { user, currentUnitId: unitId },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
    canDrag: user.role !== 'admin', // Admin tidak bisa di-drag
  });

  const isAdmin = user.role === 'admin';
  const isAssigned = unitId !== undefined && unitId !== null;

  // Get initials for avatar
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // Get role badge styling
  const getRoleBadge = (role?: string) => {
    if (!role) return null;

    const roleMap: Record<string, { label: string; color: string }> = {
      admin: { label: 'Admin', color: 'text-error-600 bg-error-50 dark:bg-error-500/20 dark:text-error-400' },
      dekan: { label: 'Dekan', color: 'text-purple-600 bg-purple-50 dark:bg-purple-500/20 dark:text-purple-400' },
      wadek: { label: 'Wadek', color: 'text-blue-600 bg-blue-50 dark:bg-blue-500/20 dark:text-blue-400' },
      unit: { label: 'Unit', color: 'text-green-600 bg-green-50 dark:bg-green-500/20 dark:text-green-400' },
      sdm: { label: 'SDM', color: 'text-gray-600 bg-gray-50 dark:bg-gray-500/20 dark:text-gray-400' },
    };

    const roleInfo = roleMap[role] || { label: role, color: 'text-gray-600 bg-gray-50 dark:bg-gray-500/20 dark:text-gray-400' };

    return (
      <span className={`inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-md whitespace-nowrap ${roleInfo.color}`}>
        {roleInfo.label}
      </span>
    );
  };

  return (
    <div
      ref={isAdmin ? undefined : (drag as unknown as React.RefObject<HTMLDivElement>)}
      className={`group relative p-4 pr-12 bg-white dark:bg-gray-800 rounded-xl border transition-all duration-200 ${
        isAdmin
          ? 'opacity-60 cursor-not-allowed border-gray-300 dark:border-gray-700 shadow-sm'
          : 'cursor-move border-gray-200 dark:border-gray-700 hover:border-brand-300 dark:hover:border-brand-600 hover:shadow-lg hover:shadow-brand-500/10 dark:hover:shadow-brand-500/20 hover:-translate-y-0.5'
      } ${isDragging ? 'opacity-50 scale-95' : 'shadow-md'} ${isAssigned ? 'w-full' : ''}`}
      title={isAdmin ? 'Admin tidak bisa di-assign ke unit' : 'Drag untuk assign ke unit'}
      role={isAdmin ? undefined : 'button'}
      tabIndex={isAdmin ? undefined : 0}
      aria-label={isAdmin ? `Admin: ${user.name}` : `User: ${user.name}, drag untuk assign`}
    >
      <div className="flex items-start gap-3 w-full">
        {/* Avatar */}
        <div
          className={`shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold ${
            isAdmin
              ? 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
              : 'bg-brand-100 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400'
          }`}
          aria-hidden="true"
        >
          {getInitials(user.name)}
        </div>

        {/* User Info */}
        <div className="flex-1 min-w-0 pr-10">
                  <p className="text-sm font-semibold text-gray-900 dark:text-white wrap-break-word leading-tight">
            {user.name}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 truncate mt-1">{user.email}</p>

          {/* Badge: Admin, Role (if assigned), or Belum Di-assign */}
          <div className="mt-2 flex flex-wrap gap-1">
            {isAdmin ? (
              <span className="inline-flex items-center px-2 py-0.5 text-xs font-medium text-error-600 bg-error-50 dark:bg-error-500/20 dark:text-error-400 rounded-md whitespace-nowrap">
                Admin
              </span>
            ) : isAssigned && user.role ? (
              getRoleBadge(user.role)
            ) : (
              <span className="inline-flex items-center px-2 py-0.5 text-xs font-medium text-gray-600 bg-gray-100 dark:bg-gray-700 dark:text-gray-300 rounded-md whitespace-nowrap">
                Belum Di-assign
              </span>
            )}
          </div>
        </div>

        {/* Actions - Absolute positioned to not affect layout */}
        <div className="absolute top-3 right-3 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity bg-white dark:bg-gray-800 rounded-lg p-1 shadow-sm">
          {!isAdmin && (
            <div className="cursor-move" aria-label="Drag handle">
              <svg
                className="w-4 h-4 text-gray-400 dark:text-gray-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 8h16M4 16h16"
                />
              </svg>
            </div>
          )}
          {onEdit && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit(user);
              }}
              className="p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400 hover:text-brand-600 dark:hover:text-brand-400 transition-colors"
              title="Edit user"
              aria-label={`Edit ${user.name}`}
            >
              <PencilIcon className="w-4 h-4" />
            </button>
          )}
          {onDelete && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(user.id);
              }}
              className="p-1.5 rounded hover:bg-error-50 dark:hover:bg-error-500/20 text-gray-400 hover:text-error-600 dark:hover:text-error-400 transition-colors"
              title="Hapus user"
              aria-label={`Hapus ${user.name}`}
            >
              <TrashBinIcon className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

