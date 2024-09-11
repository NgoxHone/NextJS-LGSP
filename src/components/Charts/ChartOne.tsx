"use client";

import { ApexOptions } from "apexcharts";
import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { data2 } from "./data";
import { fetchData } from "../../../utilities/GlobalFunction";
const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});
import { bodyByYear } from "./body";
import { useRecoilState } from "recoil";
import { optionEnviroment, optionService } from "../../../utilities/Atom/atom";
import SelectGroupTwo from "../SelectGroup/SelectGroupTwo";

interface ChartOneState {
  series: {
    name: string;
    data: number[];
  }[];
}
const years = Array.from({ length: 5 }, (_, i) => 2023 + i);
const ChartOne: React.FC = () => {
  const [selectedEnv] = useRecoilState(optionEnviroment);
  let now = new Date();
  now.getFullYear();
  const [dataChar, setDataChar] = useState(data2);
  const [loading, setLoading] = useState(false);
  const [optionData] = useRecoilState(optionService);
  const [selectedOption, setSelectedOption] = useState("HTTTNTW");
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  const fetchDocuments = () => {
    setLoading(true);
    fetchData(bodyByYear(selectedYear, selectedOption,selectedEnv), setDataChar).finally(() =>
      setLoading(false),
    );
  };
  const handleSelectChange = (value: string) => {
    setSelectedOption(value);
  };
  useEffect(() => fetchDocuments(), [selectedOption,selectedYear,selectedEnv]);
  function transformData(aggregations) {
    const result = [];
    const applications = {};

    // Duyệt qua các tháng từ dữ liệu `count_by_month`
    aggregations?.by_api.buckets[0]?.count_by_month.buckets.forEach(
      (monthBucket) => {
        const monthIndex = monthBucket.key - 1; // Chuyển key từ 1-12 sang index 0-11
        monthBucket?.by_application_name?.buckets.forEach((appBucket) => {
          const appName = appBucket?.key;
          const appCount = appBucket?.doc_count;

          // Nếu chưa có `application_name` trong đối tượng `applications`, khởi tạo nó
          if (!applications[appName]) {
            applications[appName] = Array(12).fill(0); // Tạo mảng 12 phần tử, giá trị ban đầu là 0
          }

          // Gán giá trị cho tháng tương ứng
          applications[appName][monthIndex] = appCount;
        });
      },
    );

    // Chuyển đổi đối tượng `applications` thành mảng kết quả
    for (const [name, data] of Object.entries(applications)) {
      result.push({ name, data });
    }

    return result;
  }
  const handleYearChange = (event) => {
    setSelectedYear(Number(event.target.value));
    // setSelectedDate(new Date(Number(event.target.value), selectedMonth));
  };
  const data = transformData(dataChar?.aggregations);
  let finalValue =
    Math.ceil(Math.max(...data?.flatMap((item) => item.data)) / 1000) *
    1000 *
    1.2;
  const colors = ["#3C50E0", "#80CAEE", "#cccccc", "red"];

  const options: ApexOptions = {
    legend: {
      show: false,
      position: "top",
      horizontalAlign: "left",
    },
    colors: colors,
    chart: {
      fontFamily: "Satoshi, sans-serif",
      height: 335,
      type: "area",
      dropShadow: {
        enabled: true,
        color: "#623CEA14",
        top: 10,
        blur: 4,
        left: 0,
        opacity: 0.1,
      },

      toolbar: {
        show: false,
      },
    },
    responsive: [
      {
        breakpoint: 1024,
        options: {
          chart: {
            height: 300,
          },
        },
      },
      {
        breakpoint: 1366,
        options: {
          chart: {
            height: 350,
          },
        },
      },
    ],
    stroke: {
      width: [2, 2],
      curve: "straight",
    },
    // labels: {
    //   show: false,
    //   position: "top",
    // },
    grid: {
      xaxis: {
        lines: {
          show: true,
        },
      },
      yaxis: {
        lines: {
          show: true,
        },
      },
    },
    dataLabels: {
      enabled: false,
    },
    markers: {
      size: 4,
      colors: "#fff",
      strokeColors: ["#3C50E0", "#80CAEE"],
      strokeWidth: 3,
      strokeOpacity: 0.9,
      strokeDashArray: 0,
      fillOpacity: 1,
      discrete: [],
      hover: {
        size: 10,
        sizeOffset: 5,
      },
    },
    xaxis: {
      type: "category",
      categories: [
        "Tháng 1",
        "Tháng 2",
        "Tháng 3",
        "Tháng 4",
        "Tháng 5",
        "Tháng 6",
        "Tháng 7",
        "Tháng 8",
        "Tháng 9",
        "Tháng 10",
        "Tháng 11",
        "Tháng 12",
      ],
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
    },
    yaxis: {
      title: {
        style: {
          fontSize: "0px",
        },
      },
      min: 0,
      max: finalValue,
    },
  };
  // let data = [
  //   // {
  //   //   name: "Product One",
  //   //   data: [23, 11, 22, 27, 13, 22, 37, 21, 44, 22, 30, 45],
  //   // },

  //   // {
  //   //   name: "Product Two",
  //   //   data: [30, 25, 36, 30, 45, 35, 64, 52, 59, 36, 39, 51],
  //   // },

  //   {
  //     name: "Product Three",
  //     data: [30, 25, 36, 2, 45, 35, 12, 52, 11, 36, 39, 66666],
  //   }
  // ]

  return (
    <div className="col-span-12 rounded-lg border border-stroke bg-white px-5 pb-5 pt-7.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:col-span-8">
      <div className="flex flex-wrap items-start justify-between gap-3 sm:flex-nowrap">
        <div className="flex w-full flex-wrap gap-3 sm:gap-5">
          {data.map((item, index) => (
            <div key={index} className="flex min-w-47.5">
              <span
                style={{ borderColor: colors[index] }}
                className="mr-2 mt-1 flex h-4 w-full max-w-4 items-center justify-center rounded-full border border-primary"
              >
                <span
                  style={{ backgroundColor: colors[index] }}
                  className="block h-2.5 w-full max-w-2.5 rounded-full bg-primary"
                ></span>
              </span>

              <div className="w-full">
                <p
                  style={{ color: colors[index] }}
                  className="font-semibold text-primary"
                >
                  {item?.name}
                </p>
              </div>
            </div>
          ))}

          {/* <div className="flex min-w-47.5">
            <span className="mr-2 mt-1 flex h-4 w-full max-w-4 items-center justify-center rounded-full border border-secondary">
              <span className="block h-2.5 w-full max-w-2.5 rounded-full bg-secondary"></span>
            </span>
            <div className="w-full">
              <p className="font-semibold text-secondary">Total Sales</p>
              <p className="text-sm font-medium">12.04.2022 - 12.05.2022</p>
            </div>
          </div> */}
        </div>
        {/* <div className="flex w-full max-w-45 justify-end">
          <div className="inline-flex items-center rounded-md bg-whiter p-1.5 dark:bg-meta-4">
            <button className="rounded bg-white px-3 py-1 text-xs font-medium text-black shadow-card hover:bg-white hover:shadow-card dark:bg-boxdark dark:text-white dark:hover:bg-boxdark">
              Day
            </button>
            <button className="rounded px-3 py-1 text-xs font-medium text-black hover:bg-white hover:shadow-card dark:text-white dark:hover:bg-boxdark">
              Week
            </button>
            <button className="rounded px-3 py-1 text-xs font-medium text-black hover:bg-white hover:shadow-card dark:text-white dark:hover:bg-boxdark">
              Month
            </button>
          </div>
        </div> */}
      </div>
      <div className="flex gap-4 p-4">
        <div className="flex-1 h-15" style={{ alignSelf: "center" }}>
          {optionData != null && (
            <SelectGroupTwo
              onSelect={handleSelectChange}
              label=""
              options={optionData?.aggregations?.group_by_api?.buckets?.map(
                (i) => {
                  return { value: i.key, label: i.key };
                },
              )}
              className="h-15 w-full" // Đảm bảo chiều cao và độ rộng bằng 100%
            />
          )}
        </div>
        <div className="flex-1">
          <select
            value={selectedYear}
            onChange={handleYearChange}
            className="border-gray-400 dark:border-gray-600 dark:text-gray-300 relative z-20 h-15 w-full appearance-none rounded-md border border-stroke bg-transparent px-4 py-2 outline-none transition focus:border-primary focus:ring-2 focus:ring-blue-600 active:border-primary dark:border-form-strokedark dark:bg-boxdark dark:bg-form-input dark:focus:ring-blue-400"
            // style={{ minHeight: "48px" }} // Đặt chiều cao tối thiểu để đồng nhất
          >
            {years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <div id="chartOne" className="-ml-5">
          <ReactApexChart
            options={options}
            series={data}
            type="area"
            height={350}
            width={"100%"}
          />
        </div>
      </div>
    </div>
  );
};

export default ChartOne;
