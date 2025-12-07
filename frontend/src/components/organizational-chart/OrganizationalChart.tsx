import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { organizationalChartApi } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { GroupIcon } from '../../icons';
import EditUserModal from './EditUserModal';
import EditUnitModal from './EditUnitModal';
import { ZoomControls } from './ZoomControls';
import { DeleteConfirmationModal } from './DeleteConfirmationModal';
import { UserCard } from './UserCard';
import { UnitCard } from './UnitCard';
import { UnassignedUsersSidebar } from './UnassignedUsersSidebar';
import { useOrganizationalChartData, Unit, User } from '../../hooks/useOrganizationalChartData';
import { useZoomControls } from '../../hooks/useZoomControls';
import { useSidebarDrag } from '../../hooks/useSidebarDrag';
import { useDeleteConfirmation } from '../../hooks/useDeleteConfirmation';
import { getErrorMessage } from '../../utils/errorHandler';

interface OrganizationalChartProps {
  onUserAssigned?: () => void;
  onDataChange?: (data: { units: Unit[]; unassignedUsers: User[] }) => void;
}

interface ChildrenLevelProps {
  children: Unit[];
  childUnitsMap: Map<number, Unit[]>;
  onDrop: (userId: number, unitId: number, userRole?: string) => void;
  onDelete?: (unitId: number) => void;
  onDeleteUser?: (userId: number) => void;
  onEdit?: (unit: Unit) => void;
  onEditUser?: (user: User) => void;
}

const OrganizationalChartContent = ({ onUserAssigned, onDataChange }: OrganizationalChartProps) => {
  const { showSuccess } = useToast();
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const zoomContainerRef = useRef<HTMLDivElement>(null);

  // Custom hooks for data management
  const { units, unassignedUsers, loading, error, loadChart, setError } = useOrganizationalChartData();
  const { zoomLevel, handleZoomIn, handleZoomOut, handleZoomReset } = useZoomControls();
  const [isSidebarLocked, setIsSidebarLocked] = useState(true);
  const sidebarDrag = useSidebarDrag({
    isLocked: isSidebarLocked,
    zoomLevel,
    containerRef: chartContainerRef,
    zoomContainerRef,
  });
  const deleteConfirmation = useDeleteConfirmation(onUserAssigned, loadChart);

  // Edit modals
  const [editUserModal, setEditUserModal] = useState<{ isOpen: boolean; user: User | null }>({
    isOpen: false,
    user: null,
  });
  const [editUnitModal, setEditUnitModal] = useState<{ isOpen: boolean; unit: Unit | null }>({
    isOpen: false,
    unit: null,
  });

  // Search state
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    // Load initial data only
    // Updates will happen via callbacks (onUserAssigned, drag-drop, etc.)
    loadChart();
  }, [loadChart]);

  // Notify parent component when data changes
  useEffect(() => {
    if (onDataChange && units.length >= 0) {
      onDataChange({ units, unassignedUsers });
    }
  }, [units, unassignedUsers, onDataChange]);

  const handleDrop = useCallback(async (userId: number, unitId: number, userRole?: string) => {
    // Validasi: Admin tidak bisa di-assign
    if (userRole === 'admin') {
      setError('User dengan role admin tidak bisa di-assign ke unit.');
      return;
    }

    try {
      setError(null);
      const response = await organizationalChartApi.assignUserToUnit(userId, { unit_id: unitId });
      if (response.success) {
        showSuccess('User berhasil di-assign ke unit');
        onUserAssigned?.();
        await loadChart();
      }
    } catch (err: unknown) {
      setError(getErrorMessage(err));
    }
  }, [onUserAssigned, loadChart, showSuccess, setError]);

  const handleOpenDeleteUserModal = useCallback((userId: number) => {
    const user = [...unassignedUsers, ...units.flatMap(u => u.users || [])].find(u => u.id === userId);
    if (user) {
      deleteConfirmation.openDeleteUserModal(user);
    }
  }, [unassignedUsers, units, deleteConfirmation]);

  const handleOpenDeleteUnitModal = useCallback((unitId: number) => {
    const unit = units.find(u => u.id === unitId);
    if (unit) {
      deleteConfirmation.openDeleteUnitModal(unit);
    }
  }, [units, deleteConfirmation]);

  const handleUnassignUser = useCallback(async (userId: number) => {
    try {
      setError(null);
      const response = await organizationalChartApi.unassignUser(userId);
      if (response.success) {
        showSuccess('User berhasil di-unassign');
        onUserAssigned?.();
        await loadChart();
      }
    } catch (err: unknown) {
      setError(getErrorMessage(err));
    }
  }, [onUserAssigned, loadChart, showSuccess, setError]);


  const handleOpenEditUserModal = (user: User) => {
    setEditUserModal({ isOpen: true, user });
  };

  const handleOpenEditUnitModal = (unit: Unit) => {
    setEditUnitModal({ isOpen: true, unit });
  };

  // Filter unassigned users based on search query
  const filteredUnassignedUsers = useMemo(() => 
    unassignedUsers.filter(user =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (user.username && user.username.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (user.employee_id && user.employee_id.toLowerCase().includes(searchQuery.toLowerCase()))
    ), [unassignedUsers, searchQuery]
  );

  // Render UserCard helper
  const renderUserCard = useCallback((user: User, unitId?: number) => {
    return (
      <UserCard
        key={user.id}
        user={user}
        unitId={unitId}
        onDelete={handleOpenDeleteUserModal}
        onEdit={handleOpenEditUserModal}
      />
    );
  }, [handleOpenDeleteUserModal, handleOpenEditUserModal]);

  // ChildrenLevel component with simplified line calculation
  const ChildrenLevel = ({ children, childUnitsMap, onDrop, onDelete, onDeleteUser, onEdit, onEditUser }: ChildrenLevelProps) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const unitRefs = useRef<(HTMLDivElement | null)[]>([]);
    const [lineStyle, setLineStyle] = useState<{ left: number; width: number } | null>(null);

    const calculateLine = useCallback(() => {
      if (children.length <= 1 || !containerRef.current) {
        setLineStyle(null);
        return;
      }
      
      // Ensure array is properly sized
      if (unitRefs.current.length < children.length) {
        unitRefs.current = [...unitRefs.current, ...new Array(children.length - unitRefs.current.length).fill(null)];
      }
      
      const allRefsReady = unitRefs.current.length >= children.length && 
                          unitRefs.current.slice(0, children.length).every(ref => ref !== null && ref !== undefined);
      
      if (!allRefsReady) return;
      
      const firstUnit = unitRefs.current[0];
      const lastUnit = unitRefs.current[children.length - 1];
      
      if (!firstUnit || !lastUnit || !containerRef.current) return;
      
      const containerRect = containerRef.current.getBoundingClientRect();
      const firstRect = firstUnit.getBoundingClientRect();
      const lastRect = lastUnit.getBoundingClientRect();
      
      const firstCenter = firstRect.left + firstRect.width / 2 - containerRect.left;
      const lastCenter = lastRect.left + lastRect.width / 2 - containerRect.left;
      
      if (lastCenter > firstCenter) {
        setLineStyle({
          left: firstCenter,
          width: lastCenter - firstCenter
        });
      }
    }, [children.length]);

    useEffect(() => {
      setLineStyle(null);
      
      if (children.length <= 1) return;

      const timeouts: ReturnType<typeof setTimeout>[] = [];
      
      for (let i = 0; i < 10; i++) {
        const timeout = setTimeout(() => calculateLine(), 100 + (100 * i));
        timeouts.push(timeout);
      }

      window.addEventListener('resize', calculateLine);

      return () => {
        timeouts.forEach(timeout => clearTimeout(timeout));
        window.removeEventListener('resize', calculateLine);
      };
    }, [children, calculateLine]);

    return (
      <div 
        ref={containerRef}
        className="flex flex-row items-start justify-center gap-4 mb-8 relative" 
        style={{ minHeight: '40px', position: 'relative', zIndex: 1 }}
      >
        {/* Horizontal connector line - behind cards, spanning from first to last child */}
        {children.length > 1 && (
          <div 
            className="absolute h-0.5 bg-gray-400 dark:bg-gray-500"
            style={{ 
              top: '-80px',
              left: lineStyle ? `${lineStyle.left}px` : '50%',
              width: lineStyle && lineStyle.width > 0 ? `${lineStyle.width}px` : '0px',
              transform: lineStyle ? 'none' : 'translateX(-50%)',
              pointerEvents: 'none',
              zIndex: 1,
              opacity: lineStyle && lineStyle.width > 0 ? 1 : 0,
              transition: 'opacity 0.3s ease-out'
            }}
          ></div>
        )}
        
        {children.map((childUnit, index) => {
          const grandchildren = childUnitsMap.get(childUnit.id) || [];
          
          return (
            <div 
              key={childUnit.id} 
              ref={(el) => { 
                if (unitRefs.current.length <= index) {
                  unitRefs.current = [...unitRefs.current, ...new Array(index + 1 - unitRefs.current.length).fill(null)];
                }
                unitRefs.current[index] = el;
                
                if (el) {
                  setTimeout(() => {
                    const refsForChildren = unitRefs.current.slice(0, children.length);
                    const allReady = refsForChildren.length === children.length && 
                                    refsForChildren.every(ref => ref !== null && ref !== undefined);
                    if (allReady) {
                      calculateLine();
                    }
                  }, 100);
                }
              }}
              className="flex flex-col items-center relative shrink-0"
              style={{ zIndex: 1 }}
            >
              {/* Vertical line - continuous through card center, behind card */}
              {children.length > 1 && (
                <div 
                  className="absolute w-0.5 bg-gray-400 dark:bg-gray-500 pointer-events-none"
                  style={{ 
                    top: '-80px',
                    bottom: grandchildren.length > 0 ? '-12px' : '-32px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    zIndex: 0
                  }}
                ></div>
              )}
              
              {/* Vertical line down to grandchildren if exists */}
              {grandchildren.length > 0 && (
                <div 
                  className="absolute w-0.5 bg-gray-400 dark:bg-gray-500 pointer-events-none"
                  style={{ 
                    bottom: '-12px',
                    height: '12px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    zIndex: 0
                  }}
                ></div>
              )}
              
              {/* Child Unit Card - on top of lines, centered on vertical line */}
              <div className="mb-8 relative" style={{ zIndex: 1, position: 'relative' }}>
                <UnitCard 
                  unit={childUnit} 
                  onDrop={onDrop} 
                  onDelete={onDelete} 
                  onDeleteUser={onDeleteUser}
                  onEdit={onEdit}
                  onEditUser={onEditUser}
                  isRoot={false}
                  renderUserCard={renderUserCard}
                />
              </div>

              {/* Connector Line from Child to Grandchildren */}
              {grandchildren.length > 0 && (
                <GrandchildrenLevel
                  grandchildren={grandchildren}
                  onDrop={onDrop}
                  onDelete={onDelete}
                  onDeleteUser={onDeleteUser}
                  onEdit={onEdit}
                  onEditUser={onEditUser}
                />
              )}
            </div>
          );
        })}
      </div>
    );
  };

  // GrandchildrenLevel component with simplified line calculation
  const GrandchildrenLevel = ({ 
    grandchildren, 
    onDrop, 
    onDelete, 
    onDeleteUser,
    onEdit,
    onEditUser
  }: { 
    grandchildren: Unit[];
    onDrop: (userId: number, unitId: number, userRole?: string) => void;
    onDelete?: (unitId: number) => void;
    onDeleteUser?: (userId: number) => void;
    onEdit?: (unit: Unit) => void;
    onEditUser?: (user: User) => void;
  }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const unitRefs = useRef<(HTMLDivElement | null)[]>([]);
    const [lineStyle, setLineStyle] = useState<{ left: number; width: number } | null>(null);

    const calculateLine = useCallback(() => {
      if (grandchildren.length <= 1 || !containerRef.current) {
        setLineStyle(null);
        return;
      }
      
      if (unitRefs.current.length < grandchildren.length) {
        unitRefs.current = [...unitRefs.current, ...new Array(grandchildren.length - unitRefs.current.length).fill(null)];
      }
      
      const allRefsReady = unitRefs.current.length >= grandchildren.length && 
                          unitRefs.current.slice(0, grandchildren.length).every(ref => ref !== null && ref !== undefined);
      
      if (!allRefsReady) return;
      
      const firstUnit = unitRefs.current[0];
      const lastUnit = unitRefs.current[grandchildren.length - 1];
      
      if (!firstUnit || !lastUnit || !containerRef.current) return;
      
      const containerRect = containerRef.current.getBoundingClientRect();
      const firstRect = firstUnit.getBoundingClientRect();
      const lastRect = lastUnit.getBoundingClientRect();
      
      const firstCenter = firstRect.left + firstRect.width / 2 - containerRect.left;
      const lastCenter = lastRect.left + lastRect.width / 2 - containerRect.left;
      
      if (lastCenter > firstCenter) {
        setLineStyle({
          left: firstCenter,
          width: lastCenter - firstCenter
        });
      }
    }, [grandchildren.length]);

    useEffect(() => {
      setLineStyle(null);
      
      if (grandchildren.length <= 1) return;

      const timeouts: ReturnType<typeof setTimeout>[] = [];
      
      for (let i = 0; i < 10; i++) {
        const timeout = setTimeout(() => calculateLine(), 100 + (100 * i));
        timeouts.push(timeout);
      }

      window.addEventListener('resize', calculateLine);

      return () => {
        timeouts.forEach(timeout => clearTimeout(timeout));
        window.removeEventListener('resize', calculateLine);
      };
    }, [grandchildren, calculateLine]);

    return (
      <>
        {/* Vertical line down from child - behind cards */}
        <div className="w-0.5 h-12 bg-gray-400 dark:bg-gray-500 mb-0" style={{ zIndex: 1 }}></div>
        
        {/* Grandchildren Units (Third Level) */}
        <div 
          ref={containerRef}
          className="flex flex-row items-start justify-center gap-3 flex-wrap mt-0 relative" 
          style={{ maxWidth: '900px', minHeight: '40px', position: 'relative', zIndex: 1 }}
        >
          {/* Horizontal connector line - behind cards, spanning from first to last grandchild */}
          {grandchildren.length > 1 && (
            <div 
              className="absolute h-0.5 bg-gray-400 dark:bg-gray-500"
              style={{ 
                top: '-80px',
                left: lineStyle ? `${lineStyle.left}px` : '50%',
                width: lineStyle && lineStyle.width > 0 ? `${lineStyle.width}px` : '0px',
                transform: lineStyle ? 'none' : 'translateX(-50%)',
                pointerEvents: 'none',
                zIndex: 1,
                opacity: lineStyle && lineStyle.width > 0 ? 1 : 0,
                transition: 'opacity 0.3s ease-out'
              }}
            ></div>
          )}
          
          {grandchildren.map((grandchildUnit, index) => {
            return (
              <div 
                key={grandchildUnit.id} 
                ref={(el) => { 
                  if (unitRefs.current.length <= index) {
                    unitRefs.current = [...unitRefs.current, ...new Array(index + 1 - unitRefs.current.length).fill(null)];
                  }
                  unitRefs.current[index] = el;
                  
                  if (el) {
                    setTimeout(() => {
                      const refsForGrandchildren = unitRefs.current.slice(0, grandchildren.length);
                      const allReady = refsForGrandchildren.length === grandchildren.length && 
                                      refsForGrandchildren.every(ref => ref !== null && ref !== undefined);
                      if (allReady) {
                        calculateLine();
                      }
                    }, 100);
                  }
                }}
                className="flex flex-col items-center relative shrink-0"
              >
                {/* Vertical line - continuous through card center, behind card */}
                {grandchildren.length > 1 && (
                  <div 
                    className="absolute w-0.5 bg-gray-400 dark:bg-gray-500 pointer-events-none"
                    style={{ 
                      top: '-80px',
                      bottom: '-32px',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      zIndex: 0
                    }}
                  ></div>
                )}
                
                {/* Grandchild Unit Card - on top of lines, centered on vertical line */}
                <div className="relative" style={{ zIndex: 1, position: 'relative' }}>
                  <UnitCard 
                    unit={grandchildUnit} 
                    onDrop={onDrop} 
                    onDelete={onDelete} 
                    onDeleteUser={onDeleteUser}
                    onEdit={onEdit}
                    onEditUser={onEditUser}
                    isRoot={false}
                    renderUserCard={renderUserCard}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </>
    );
  };


  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-brand-200 border-t-brand-500 rounded-full animate-spin"></div>
          <p className="text-gray-500 dark:text-gray-400">Memuat struktur organisasi...</p>
        </div>
      </div>
    );
  }

  // Group units by parent
  const rootUnits = units.filter((u) => !u.parent_unit_id);
  const childUnitsMap = new Map<number, Unit[]>();
  units.forEach((unit) => {
    if (unit.parent_unit_id) {
      if (!childUnitsMap.has(unit.parent_unit_id)) {
        childUnitsMap.set(unit.parent_unit_id, []);
      }
      childUnitsMap.get(unit.parent_unit_id)!.push(unit);
    }
  });

  return (
    <div className="relative h-[calc(100vh-280px)] min-h-[600px]">
        {/* Zoom Controls - Fixed Position (outside scroll container, stays in place) */}
        <ZoomControls
          zoomLevel={zoomLevel}
          onZoomIn={handleZoomIn}
          onZoomOut={handleZoomOut}
          onZoomReset={handleZoomReset}
        />

      {/* Main Content Area - Organizational Chart */}
      <div className="relative h-full overflow-auto custom-scrollbar bg-linear-to-br from-gray-50 via-white to-gray-50 dark:from-gray-900/50 dark:via-gray-900/30 dark:to-gray-900/50" ref={chartContainerRef}>
        {/* Error Message */}
        {error && (
          <div className="absolute top-4 left-4 right-4 z-40 p-4 text-sm text-error-600 bg-error-50 rounded-xl dark:bg-error-500/20 dark:text-error-400 border border-error-200 dark:border-error-500/30 shadow-lg">
            <div className="flex items-center gap-3">
              <svg
                className="w-5 h-5 shrink-0"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span className="font-medium">{error}</span>
            </div>
          </div>
        )}

        {/* Chart Content with Zoom */}
        <div 
          ref={zoomContainerRef}
          style={{ 
            transform: `scale(${zoomLevel})`,
            transformOrigin: 'top left',
            minHeight: `${100 / zoomLevel}%`,
            minWidth: `${100 / zoomLevel}%`,
            position: 'relative',
          }}
          className="p-8"
        >
          {/* Sidebar - Unassigned Users (inside zoom container) */}
          {unassignedUsers.length > 0 && (
            <UnassignedUsersSidebar
              unassignedUsers={filteredUnassignedUsers}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              onDrop={handleUnassignUser}
              onDelete={handleOpenDeleteUserModal}
              onEdit={handleOpenEditUserModal}
              position={sidebarDrag.sidebarPosition}
              isLocked={isSidebarLocked}
              isDragging={sidebarDrag.isDragging}
              onToggleLock={() => setIsSidebarLocked(!isSidebarLocked)}
              onMouseDown={sidebarDrag.handleMouseDown}
              sidebarRef={sidebarDrag.sidebarRef}
            />
          )}

          {/* Organizational Chart - Tree Structure */}
          {rootUnits.length > 0 ? (
            <div className="inline-block min-w-full">
            {rootUnits.map((rootUnit) => {
              const children = childUnitsMap.get(rootUnit.id) || [];
              
              return (
                <div key={rootUnit.id} className="relative">
                  {/* Root Unit (Top Level - Dekan) */}
                  <div className="flex justify-center mb-8 relative" style={{ zIndex: 10 }}>
                    <UnitCard 
                      unit={rootUnit} 
                      onDrop={handleDrop} 
                      onDelete={handleOpenDeleteUnitModal} 
                      onDeleteUser={handleOpenDeleteUserModal}
                      onEdit={handleOpenEditUnitModal}
                      onEditUser={handleOpenEditUserModal}
                      isRoot={true}
                      renderUserCard={renderUserCard}
                    />
                  </div>

                  {/* Connector Line from Root to Children - behind cards */}
                  {children.length > 0 && (
                    <>
                      {/* Vertical line down from root */}
                      <div className="flex justify-center mb-0" style={{ zIndex: 0, position: 'relative' }}>
                        <div className="w-0.5 h-12 bg-gray-400 dark:bg-gray-500"></div>
                      </div>

                      {/* Children Units (Second Level - Wadek) */}
                      <ChildrenLevel 
                        children={children}
                        childUnitsMap={childUnitsMap}
                        onDrop={handleDrop}
                        onDelete={handleOpenDeleteUnitModal}
                        onDeleteUser={handleOpenDeleteUserModal}
                        onEdit={handleOpenEditUnitModal}
                        onEditUser={handleOpenEditUserModal}
                      />
                    </>
                  )}
                </div>
              );
            })}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 mb-4">
                <GroupIcon className="w-8 h-8 text-gray-400 dark:text-gray-500" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Belum Ada Unit
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Klik "Tambah Unit" untuk membuat unit pertama
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Edit User Modal */}
      <EditUserModal
        isOpen={editUserModal.isOpen}
        onClose={() => setEditUserModal({ isOpen: false, user: null })}
        onSuccess={() => {
          setEditUserModal({ isOpen: false, user: null });
          loadChart();
          onUserAssigned?.();
        }}
        user={editUserModal.user}
      />

      {/* Edit Unit Modal */}
      <EditUnitModal
        isOpen={editUnitModal.isOpen}
        onClose={() => setEditUnitModal({ isOpen: false, unit: null })}
        onSuccess={() => {
          setEditUnitModal({ isOpen: false, unit: null });
          loadChart();
          onUserAssigned?.();
        }}
        unit={editUnitModal.unit}
        units={units}
      />

      {/* Delete User Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={deleteConfirmation.deleteUserModal.isOpen}
        onClose={deleteConfirmation.closeDeleteUserModal}
        onConfirm={deleteConfirmation.confirmDeleteUser}
        item={deleteConfirmation.deleteUserModal.item}
        itemType="user"
        isDeleting={deleteConfirmation.isDeleting}
      />

      {/* Delete Unit Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={deleteConfirmation.deleteUnitModal.isOpen}
        onClose={deleteConfirmation.closeDeleteUnitModal}
        onConfirm={deleteConfirmation.confirmDeleteUnit}
        item={deleteConfirmation.deleteUnitModal.item}
        itemType="unit"
        isDeleting={deleteConfirmation.isDeleting}
      />
    </div>
  );
};

export default function OrganizationalChart(props: OrganizationalChartProps) {
  return (
    <DndProvider backend={HTML5Backend}>
      <OrganizationalChartContent {...props} />
    </DndProvider>
  );
}
