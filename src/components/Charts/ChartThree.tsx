"use client";
import { ApexOptions } from "apexcharts";
import React, { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";
import { FaChartBar, FaChartPie } from "react-icons/fa";

interface ChartThreeProps {
  data: { key: string; doc_count: number }[];
  title: string;
}

const ChartThree: React.FC<ChartThreeProps> = ({ data, title }) => {
  const [chartType, setChartType] = useState<'donut' | 'bar'>('donut');
  const barSeries = data.map((item) => item.doc_count);
  const series = chartType === 'bar'
    ? [{ name: 'Số lượng', data: barSeries }]
    : barSeries;
  const totalCount = barSeries.reduce((a, b) => a + b, 0);
  const labels = data.map((item) => item.key);
  const colors = ["#3C50E0", "#6577F3", "#8FD0EF", "#0FADCF", "#FF7F7F", "#F5A623"];

  const options: ApexOptions = {
    chart: {
      fontFamily: "Satoshi, sans-serif",
      type: chartType,
    },
    colors,
    labels: labels,
    legend: {
      show: true,
      position: "bottom",
    },
    plotOptions: chartType === 'donut' ? {
      pie: {
        donut: {
          size: "65%",
          background: "transparent",
        },
      },
    } : {
      bar: {
        borderRadius: 6,
        columnWidth: '40%',
        distributed: true,
      },
    },
    dataLabels: {
      enabled: false,
    },
    xaxis: chartType === 'bar' ? {
      categories: labels,
      labels: {
        style: {
          fontSize: '13px',
        },
      },
    } : undefined,
    responsive: [
      {
        breakpoint: 2600,
        options: {
          chart: {
            width: 380,
          },
        },
      },
      {
        breakpoint: 1024, // Tablet
        options: {
          chart: {
            width: 300, // Tăng kích thước khi ở chế độ tablet
          },
        },
      },
      {
        breakpoint: 768, // Điện thoại
        options: {
          chart: {
            width: 250, // Tăng kích thước khi ở chế độ điện thoại
          },
        },
      },
      {
        breakpoint: 640, // Điện thoại nhỏ hơn
        options: {
          chart: {
            width: 200, // Đảm bảo kích thước biểu đồ không quá nhỏ
          },
        },
      },
    ],
  };
  return (
    <div
      style={{ maxWidth: "50vw" }}
      className="col-span-12 px-5 pb-5 pt-7.5 dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:col-span-5"
    >
      <div className="mb-3 justify-between gap-4 sm:flex items-center">
        <div>
          <h5 className="text-xl font-semibold text-black dark:text-white">
            {title}
          </h5>
        </div>
        <button
          onClick={() => setChartType(chartType === 'donut' ? 'bar' : 'donut')}
          className="ml-auto flex items-center gap-1 px-2 py-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-gray-600 dark:text-gray-300 border border-gray-200 text-xs"
          title={chartType === 'donut' ? 'Xem dạng Bar chart' : 'Xem dạng Donut chart'}
        >
          {chartType === 'donut' ? <FaChartBar color="#3b50df" className="w-4 h-4" /> : <FaChartPie color="#3b50df" className="w-4 h-4" />}
          {/* <span>{chartType === 'donut' ? 'Biểu đồ cột' : 'Biểu đồ tròn'}</span> */}
        </button>
      </div>

      <div className="mb-5 mt-5">
        <div id="chartThree" className="mx-auto flex justify-center">
          <ReactApexChart options={options} series={series} type={chartType} />
        </div>
      </div>

      <div className="-mx-8 mt-5 flex flex-wrap items-center justify-center gap-y-3">
        {data.map((item, index) => (
          <div key={index} className="w-full px-8 sm:w-1/2">
            <div className="flex w-full items-center">
              <span
                className="mr-2 block h-3 w-full max-w-3 rounded-full"
                style={{
                  backgroundColor: colors[index % colors.length],
                }}
              ></span>
              <p className="flex w-full justify-between text-sm font-medium text-black dark:text-white">
                <span>
                  {item.key} ({item.doc_count})
                </span>
                <span>
                  {totalCount > 0 ? Math.round((item.doc_count / totalCount) * 100) : 0}%
                </span>
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChartThree;
