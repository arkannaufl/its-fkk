import React from 'react';
import { BoltIcon } from '../../icons';

interface QuickActionsSectionProps {
  title?: string;
  description?: string;
  children: React.ReactNode;
}

export default function QuickActionsSection({
  title = 'Aksi Cepat',
  description = 'Ekspor struktur organisasi ke PDF untuk dicetak, atau tambahkan user dan unit baru ke sistem',
  children,
}: QuickActionsSectionProps) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/5 p-4 sm:p-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gray-100 dark:bg-gray-800 text-blue-500 dark:text-blue-400 shrink-0">
            <BoltIcon className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-gray-800 dark:text-white">
              {title}
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              {description}
            </p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2.5">
          {children}
        </div>
      </div>
    </div>
  );
}

