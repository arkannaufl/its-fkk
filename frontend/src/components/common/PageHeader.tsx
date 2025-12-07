interface PageHeaderProps {
  title: string;
  subtitle?: string;
  icon: React.ReactNode;
  allowSubtitleWrap?: boolean;
}

export default function PageHeader({
  title,
  subtitle,
  icon,
  allowSubtitleWrap = false,
}: PageHeaderProps) {
  return (
    <header
      className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/5 sm:p-6"
      role="banner"
      aria-label={`Page header for ${title}`}
    >
      <div className="flex items-start gap-4">
        {/* Icon */}
        <div
          className="flex items-center justify-center w-14 h-14 rounded-xl bg-gray-100 dark:bg-gray-800 text-brand-500 dark:text-brand-400 shrink-0"
          aria-hidden="true"
        >
          {icon}
        </div>

        {/* Title & Subtitle */}
        <div className="min-w-0 flex-1">
          <h1 className="text-lg font-bold text-gray-800 dark:text-white sm:text-xl">
            {title}
          </h1>
          {subtitle && (
            <p className={`mt-1 text-sm text-gray-500 dark:text-gray-400 ${allowSubtitleWrap ? 'leading-relaxed' : 'truncate'}`}>
              {subtitle}
            </p>
          )}
        </div>
      </div>
    </header>
  );
}

