import { ApexOptions } from "apexcharts";
import React from "react";
import ReactApexChart from "react-apexcharts";

interface ChartThreeProps {
  data: { key: string; doc_count: number }[];
  title: string;
}

const ChartThree: React.FC<ChartThreeProps> = ({ data, title }) => {
  // Chuyển đổi dữ liệu thành định dạng mà ApexCharts yêu cầu
  const series = data.map((item) => item.doc_count);
  const labels = data.map((item) => item.key);

  // Cấu hình chart
  const options: ApexOptions = {
    chart: {
      fontFamily: "Satoshi, sans-serif",
      type: "donut",
    },
    colors: ["#3C50E0", "#6577F3", "#8FD0EF", "#0FADCF", "#FF7F7F", "#F5A623"], // Thêm màu cho các mục
    labels: labels,
    legend: {
      show: true,
      position: "bottom",
    },
    plotOptions: {
      pie: {
        donut: {
          size: "65%",
          background: "transparent",
        },
      },
    },
    dataLabels: {
      enabled: false,
    },
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
        breakpoint: 640,
        options: {
          chart: {
            width: 200,
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
      <div className="mb-3 justify-between gap-4 sm:flex">
        <div>
          <h5 className="text-xl font-semibold text-black dark:text-white">
            {title}
          </h5>
        </div>
        <div></div>
      </div>

      <div className="mb-5 mt-5">
        <div id="chartThree" className="mx-auto flex justify-center">
          <ReactApexChart options={options} series={series} type="donut" />
        </div>
      </div>

      <div className="-mx-8 mt-5 flex flex-wrap items-center justify-center gap-y-3">
        {data.map((item, index) => (
          <div key={index} className="w-full px-8 sm:w-1/2">
            <div className="flex w-full items-center">
              <span
                className="mr-2 block h-3 w-full max-w-3 rounded-full"
                style={{
                  backgroundColor:
                    options.colors[index % options.colors.length],
                }}
              ></span>
              <p className="flex w-full justify-between text-sm font-medium text-black dark:text-white">
                <span>
                  {item.key} ({item.doc_count})
                </span>
                <span>
                  {Math.round(
                    (item.doc_count / series.reduce((a, b) => a + b, 0)) * 100,
                  )}
                  %
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
