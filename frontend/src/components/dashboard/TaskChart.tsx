import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { useState } from "react";
import { Dropdown } from "../ui/dropdown/Dropdown";
import { DropdownItem } from "../ui/dropdown/DropdownItem";
import { MoreDotIcon } from "../../icons";

interface TaskChartProps {
  title: string;
  subtitle?: string;
  data: number[];
  categories: string[];
  type?: "bar" | "line" | "area";
  color?: string;
  height?: number;
  className?: string;
}

export default function TaskChart({
  title,
  subtitle,
  data,
  categories,
  type = "bar",
  color = "#F97316",
  height = 250,
  className = "",
}: TaskChartProps) {
  const [isOpen, setIsOpen] = useState(false);

  const options: ApexOptions = {
    colors: [color],
    chart: {
      fontFamily: "Outfit, sans-serif",
      type: type,
      height: height,
      toolbar: {
        show: false,
      },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "50%",
        borderRadius: 5,
        borderRadiusApplication: "end",
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      show: true,
      width: type === "bar" ? 4 : 2,
      colors: type === "bar" ? ["transparent"] : [color],
      curve: "smooth",
    },
    xaxis: {
      categories: categories,
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
      labels: {
        style: {
          colors: "#6B7280",
          fontSize: "12px",
        },
      },
    },
    yaxis: {
      labels: {
        style: {
          colors: "#6B7280",
          fontSize: "12px",
        },
      },
    },
    grid: {
      borderColor: "#E5E7EB",
      strokeDashArray: 4,
      yaxis: {
        lines: {
          show: true,
        },
      },
      xaxis: {
        lines: {
          show: false,
        },
      },
    },
    fill: {
      opacity: type === "area" ? 0.3 : 1,
      type: type === "area" ? "gradient" : "solid",
      gradient: {
        opacityFrom: 0.55,
        opacityTo: 0,
      },
    },
    tooltip: {
      y: {
        formatter: (val: number) => `${val} tugas`,
      },
    },
  };

  const series = [
    {
      name: "Tugas",
      data: data,
    },
  ];

  return (
    <div
      className={`overflow-hidden rounded-2xl border border-gray-200 bg-white px-5 pt-5 dark:border-gray-800 dark:bg-white/5 sm:px-6 sm:pt-6 ${className}`}
    >
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            {title}
          </h3>
          {subtitle && (
            <p className="mt-1 text-gray-500 text-theme-sm dark:text-gray-400">
              {subtitle}
            </p>
          )}
        </div>
        <div className="relative inline-block">
          <button
            className="dropdown-toggle"
            onClick={() => setIsOpen(!isOpen)}
          >
            <MoreDotIcon className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 size-6" />
          </button>
          <Dropdown
            isOpen={isOpen}
            onClose={() => setIsOpen(false)}
            className="w-40 p-2"
          >
            <DropdownItem
              onItemClick={() => setIsOpen(false)}
              className="flex w-full font-normal text-left text-gray-500 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
            >
              Lihat Detail
            </DropdownItem>
            <DropdownItem
              onItemClick={() => setIsOpen(false)}
              className="flex w-full font-normal text-left text-gray-500 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
            >
              Export
            </DropdownItem>
          </Dropdown>
        </div>
      </div>

      <div className="max-w-full overflow-x-auto custom-scrollbar">
        <div className="-ml-5 min-w-[500px] xl:min-w-full pl-2">
          <Chart options={options} series={series} type={type} height={height} />
        </div>
      </div>
    </div>
  );
}


