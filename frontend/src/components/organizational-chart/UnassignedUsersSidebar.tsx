import React from 'react';
import { useDrop } from 'react-dnd';
import { User } from '../../hooks/useOrganizationalChartData';
import { UserCard } from './UserCard';

interface UnassignedUsersSidebarProps {
  unassignedUsers: User[];
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onDrop: (userId: number) => void;
  onDelete: (userId: number) => void;
  onEdit: (user: User) => void;
  position: { x: number; y: number };
  isLocked: boolean;
  isDragging?: boolean;
  onToggleLock: () => void;
  onMouseDown: (e: React.MouseEvent) => void;
  sidebarRef: React.RefObject<HTMLDivElement | null>;
}

export const UnassignedUsersSidebar: React.FC<UnassignedUsersSidebarProps> = ({
  unassignedUsers,
  searchQuery,
  onSearchChange,
  onDrop,
  onDelete,
  onEdit,
  position,
  isLocked,
  isDragging = false,
  onToggleLock,
  onMouseDown,
  sidebarRef,
}) => {
  const [{ isOver }, drop] = useDrop({
    accept: 'user',
    drop: (item: { user: User; currentUnitId?: number }) => {
      // Only unassign if user is currently assigned to a unit
      if (item.currentUnitId && item.user.role !== 'admin') {
        onDrop(item.user.id);
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  return (
    <div
      ref={(node) => {
        drop(node);
        if (node && sidebarRef) {
          (sidebarRef as React.MutableRefObject<HTMLDivElement | null>).current = node;
        }
      }}
      className={`w-80 shrink-0 rounded-xl border flex flex-col max-h-[calc(100vh-200px)] transition-all ${
        isOver
          ? 'border-brand-400 dark:border-brand-500 bg-brand-50 dark:bg-brand-900/30 shadow-xl ring-2 ring-brand-200 dark:ring-brand-800/50'
          : 'border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800 shadow-lg'
      } ${!isLocked ? 'cursor-move' : ''}`}
      style={{
        position: 'absolute',
        left: `${position.x}px`,
        top: `${position.y}px`,
        zIndex: 1000,
        transition: isDragging ? 'none' : undefined,
      }}
      role="complementary"
      aria-label="Unassigned users sidebar"
    >
      <div
        className={`p-5 border-b border-gray-200 dark:border-gray-700 shrink-0 bg-linear-to-r from-gray-50 to-white dark:from-gray-800/80 dark:to-gray-800/50 ${
          !isLocked ? 'cursor-move' : ''
        }`}
        onMouseDown={onMouseDown}
      >
        <div className="mb-3">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">
            User Belum Di-assign
          </h3>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
          Drag user ke unit untuk meng-assign atau drag kembali ke sini untuk unassign
        </p>

        {/* Search Bar with Lock Button */}
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Cari nama, email, username..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              onClick={(e) => e.stopPropagation()}
              onMouseDown={(e) => e.stopPropagation()}
              className="w-full px-3 py-2.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all"
              aria-label="Search unassigned users"
            />
            <svg
              className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500 pointer-events-none"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleLock();
            }}
            onMouseDown={(e) => e.stopPropagation()}
            className={`p-2 rounded-lg transition-colors shrink-0 ${
              isLocked
                ? 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
                : 'bg-brand-50 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400 hover:bg-brand-100 dark:hover:bg-brand-900/50'
            }`}
            title={isLocked ? 'Klik untuk unlock - sidebar bisa dipindah' : 'Klik untuk lock - sidebar tidak bisa dipindah'}
            aria-label={isLocked ? 'Unlock sidebar' : 'Lock sidebar'}
          >
            {isLocked ? (
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />
              </svg>
            )}
          </button>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-3">
        {unassignedUsers.length > 0 ? (
          unassignedUsers.map((user) => (
            <UserCard
              key={user.id}
              user={user}
              onDelete={onDelete}
              onEdit={onEdit}
            />
          ))
        ) : (
          <div className="text-center py-8 text-sm text-gray-500 dark:text-gray-400">
            {searchQuery ? 'Tidak ada user yang cocok dengan pencarian' : 'Tidak ada user yang belum di-assign'}
          </div>
        )}
      </div>
    </div>
  );
};

