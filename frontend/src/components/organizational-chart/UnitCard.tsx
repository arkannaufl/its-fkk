import React from 'react';
import { useDrop } from 'react-dnd';
import { Unit, User } from '../../hooks/useOrganizationalChartData';
import { TrashBinIcon } from '../../icons';
// UserCard will be passed as children or rendered via callback

interface UnitCardProps {
  unit: Unit;
  onDrop: (userId: number, unitId: number, userRole?: string) => void;
  onDelete?: (unitId: number) => void;
  onDeleteUser?: (userId: number) => void;
  onEdit?: (unit: Unit) => void;
  onEditUser?: (user: User) => void;
  isRoot?: boolean;
  renderUserCard?: (user: User) => React.ReactNode;
}

export const UnitCard: React.FC<UnitCardProps> = ({
  unit,
  onDrop,
  onDelete,
  onDeleteUser,
  onEdit,
  onEditUser,
  isRoot = false,
  renderUserCard,
}) => {
  const [{ isOver }, drop] = useDrop({
    accept: 'user',
    drop: (item: { user: User; currentUnitId?: number }) => {
      if (item.currentUnitId !== unit.id) {
        onDrop(item.user.id, unit.id, item.user.role);
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'dekan':
        return 'bg-purple-50 dark:bg-purple-900';
      case 'wadek':
        return 'bg-blue-50 dark:bg-blue-900';
      case 'unit':
        return 'bg-green-50 dark:bg-green-900';
      default:
        return 'bg-gray-50 dark:bg-gray-800';
    }
  };

  return (
    <div
      ref={drop as unknown as React.RefObject<HTMLDivElement>}
      className={`rounded-xl transition-all duration-200 relative ${
        isRoot
          ? 'p-6 w-[400px] bg-white dark:bg-gray-800 border-l-4 border-purple-500 dark:border-purple-400 shadow-xl hover:shadow-2xl'
          : 'p-5 w-[360px]'
      } ${
        isOver
          ? 'bg-brand-50 dark:bg-brand-900/30 shadow-xl scale-105 ring-2 ring-brand-500/30 dark:ring-brand-400/30'
          : isRoot
            ? ''
            : `${getRoleColor(unit.role)} shadow-md hover:shadow-lg`
      }`}
      style={{
        outline: 'none',
        zIndex: 1,
        position: 'relative',
      }}
      role="region"
      aria-label={`Unit: ${unit.name}`}
    >
      <div className={isRoot ? 'mb-5' : 'mb-4'}>
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <h3
              className={`font-semibold text-gray-900 dark:text-white mb-1 truncate ${
                isRoot ? 'text-lg' : 'text-base'
              }`}
            >
              {unit.name}
            </h3>
            <p
              className={`text-gray-500 dark:text-gray-400 font-mono ${
                isRoot ? 'text-sm' : 'text-xs'
              }`}
            >
              {unit.code}
            </p>
          </div>
          {onEdit && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit(unit);
              }}
              className="p-1.5 rounded hover:bg-brand-50 dark:hover:bg-brand-500/20 text-gray-400 hover:text-brand-600 dark:hover:text-brand-400 transition-colors shrink-0"
              title="Edit unit"
              aria-label={`Edit unit ${unit.name}`}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
            </button>
          )}
          {onDelete && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(unit.id);
              }}
              className="p-1.5 rounded hover:bg-error-50 dark:hover:bg-error-500/20 text-gray-400 hover:text-error-600 dark:hover:text-error-400 transition-colors shrink-0"
              title="Hapus unit"
              aria-label={`Hapus unit ${unit.name}`}
            >
              <TrashBinIcon className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
      <div className="space-y-2 min-h-[60px]">
        {unit.users && unit.users.length > 0 ? (
          <div className="space-y-2">
            {unit.users.map((user) => (
              <div key={user.id} className="w-full">
                {renderUserCard ? renderUserCard(user) : null}
              </div>
            ))}
          </div>
        ) : (
          <div
            className="flex items-center justify-center py-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg"
            role="status"
            aria-label="Empty unit, drag user here"
          >
            <p className="text-xs text-gray-400 dark:text-gray-500 text-center">
              Tarik user<br />ke sini
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

