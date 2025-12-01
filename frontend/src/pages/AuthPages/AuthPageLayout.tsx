import React from "react";
import GridShape from "../../components/common/GridShape";
import { Link } from "react-router";
import ThemeTogglerTwo from "../../components/common/ThemeTogglerTwo";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative p-6 bg-white z-1 dark:bg-gray-900 sm:p-0">
      <div className="relative flex flex-col justify-center w-full h-screen lg:flex-row dark:bg-gray-900 sm:p-0">
        {children}
        <div className="relative items-center hidden w-full h-full overflow-hidden lg:w-1/2 bg-white dark:bg-gray-900 lg:grid">
          {/* <!-- ===== Common Grid Shape Start ===== --> */}
          <GridShape />
          <div className="relative z-10 flex items-center justify-center">
            <div className="flex flex-col items-center px-6 text-center">
              <Link to="/" className="block mb-7">
                <img
                  src="/images/logo/logo.svg"
                  alt="Its logo"
                  className="block w-auto h-16 sm:h-20 max-w-[280px] dark:hidden"
                />
                <img
                  src="/images/logo/logo-dark.svg"
                  alt="Its dark logo"
                  className="hidden w-auto h-16 sm:h-20 max-w-[280px] dark:block"
                />
              </Link>
              <p className="text-gray-400 text-base sm:text-lg dark:text-white/60">
                Smart and Structured Task Management Platform
              </p>
            </div>
          </div>
        </div>
        <div className="fixed z-50 hidden bottom-6 right-6 sm:block">
          <ThemeTogglerTwo />
        </div>
      </div>
    </div>
  );
}
