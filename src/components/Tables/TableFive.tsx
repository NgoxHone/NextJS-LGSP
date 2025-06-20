"use client";
import dynamic from "next/dynamic";
import React, { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import useDebounce from "../../hooks/useDebounce";
import MultiSelect from "../FormElements/MultiSelect";
import { getDatabaseDescription } from "../../../utilities/GlobalFunction";
import SelectGroupTwo from "../SelectGroup/SelectGroupTwo";
import axios from "axios";
import { dataOption, dataOptionApp } from "../Chat/body";
import {
  matchingCountState,
  matchingCountState2,
  optionEnviroment,
  optionOption,
  optionOptionApp,
  optionService,
  selectService,
  status as statusAtom,
} from "../../../utilities/Atom/atom";
import { useRecoilState } from "recoil";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { FaSearch } from "react-icons/fa";

// Types
interface Bucket {
  key: string;
  doc_count: number;
  unique_correlation_count?: {
    value: number;
  };
}

interface Aggregations {
  group_by_api: {
    buckets: Bucket[];
  };
}

interface TableData {
  aggregations: Aggregations;
  init?: boolean;
}

interface TableProps {
  data: TableData;
  onStartDateChange: (date: string) => void;
  onEndDateChange: (date: string) => void;
  search?: boolean;
  xuatEx?: boolean;
  title?: string;
  lienthong?: boolean;
  app?: boolean;
  loading?: boolean;
}

interface SelectOption {
  value: string;
  label: string;
}

interface OptionData {
  aggregations?: {
    group_by_api?: {
      buckets?: Bucket[];
    };
  };
}

// Define atom types
interface RecoilState<T> {
  key: string;
  default: T;
}

// Utility functions
const getTodayDate = (): string => {
  const today = new Date();
  today.setHours(23, 59, 59, 999);
  const tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000);
  return new Date(tomorrow.getTime() - tomorrow.getTimezoneOffset() * 60000)
    .toISOString()
    .slice(0, -1);
};

const getLastMonthDate = (): string => {
  const lastMonth = new Date();
  lastMonth.setMonth(lastMonth.getMonth() - 1);
  return lastMonth.toISOString().split("T")[0];
};

const Table: React.FC<TableProps> = ({
  data,
  onStartDateChange,
  onEndDateChange,
  search = true,
  xuatEx = true,
  title = "",
  lienthong = true,
  app = false,
  loading = false,
}) => {
  // State management
  const [selectedOption3, setSelectedOption3] = useRecoilState<number>(selectService);
  const [status, setStatus] = useRecoilState<string>(statusAtom);
  const [matchingCount, setMatchingCount] = useRecoilState<number>(matchingCountState);
  const [matchingCount2, setMatchingCount2] = useRecoilState<number>(matchingCountState2);
  const [selectedEnv] = useRecoilState<string | null>(optionEnviroment);
  const [selectedOptionApp, setSelectedOptionApp] = useRecoilState<string | null>(optionOptionApp);
  const [selectedOption, setSelectedOption] = useRecoilState<string | null>(optionOption);
  const [optionDataApp, setOptionDataApp] = useState<TableData | null>(null);
  const [optionData, setOptionData] = useRecoilState<OptionData | null>(optionService);
  const [startDate, setStartDate] = useState<string>(getLastMonthDate());
  const [endDate, setEndDate] = useState<string>(getTodayDate());
  const [searchTerm, setSearchTerm] = useState<string>("");
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const router = useRouter();

  // Data fetching
  const fetchOptionApp = async () => {
    try {
      const response = await axios({
        method: "post",
        url: "/api/service",
        headers: { "Content-Type": "application/json" },
        data: dataOptionApp(selectedEnv),
      });
      setOptionDataApp(response.data);
    } catch (error) {
      console.error("Error fetching documents:", error);
    }
  };

  const fetchOption = async () => {
    try {
      const response = await axios({
        method: "post",
        url: "/api/service",
        headers: { "Content-Type": "application/json" },
        data: dataOption(selectedEnv),
      });
      setOptionData(response.data);
    } catch (error) {
      console.error("Error fetching documents:", error);
    }
  };

  // Event handlers
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>, setDate: (date: string) => void) => {
    setDate(e.target.value);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleSelectAppChange = (value: string) => {
    setSelectedOptionApp(value);
  };

  const handleSelectChange = (value: string) => {
    setSelectedOption(value);
  };

  // Data processing
  const filteredData = data.aggregations?.group_by_api.buckets?.filter((bucket) =>
    bucket.key.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
  );

  const totalRequestCount = filteredData?.reduce(
    (sum: number, item: Bucket) => sum + item.doc_count,
    0
  );

  // Excel export
  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(
      filteredData?.map((bucket, index) => ({
        STT: index + 1,
        [app ? "Phần mềm" : "Dịch vụ"]: getDatabaseDescription(bucket.key),
        "Số lượng request": bucket.doc_count,
      })) || []
    );

    // Apply styling
    worksheet["!cols"] = [{ wch: 5 }, { wch: app ? 50 : 150 }, { wch: 20 }];
    filteredData?.forEach((_, i) => {
      const rowNum = i + 2;
      worksheet[`A${rowNum}`].s = {
        alignment: { horizontal: "center" },
        font: { name: "Times New Roman" },
      };
      worksheet[`B${rowNum}`].s = {
        font: { name: "Times New Roman" },
      };
      worksheet[`C${rowNum}`].s = {
        alignment: { horizontal: "center" },
        font: { name: "Times New Roman" },
      };
    });

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Data");
    XLSX.writeFile(workbook, "ThongKeLGSP.xlsx");
  };

  // Effects
  useEffect(() => {
    fetchOption();
    fetchOptionApp();
  }, [selectedEnv]);

  useEffect(() => {
    onStartDateChange(startDate);
  }, [startDate, onStartDateChange]);

  useEffect(() => {
    onEndDateChange(endDate);
  }, [endDate, onEndDateChange]);

  // Render helpers
  const renderTableHeader = () => (
    <thead style={{ backgroundColor: "#f3f4f6", borderRadius: 20 }}>
      <tr className="bg-gray-200 text-gray-600 border-gray-300 round-lg text-sm uppercase leading-normal">
        <th className="w-[10%] px-6 py-3 text-left text-sm font-medium uppercase dark:bg-meta-4 xsm:text-base">
          STT
        </th>
        {!lienthong && (
          <th className="w-[10%] px-6 py-3 text-left text-sm font-medium uppercase dark:bg-meta-4 xsm:text-base">
            Mã
          </th>
        )}
        <th className={`${lienthong ? "w-[10%]" : "w-[50%]"} px-6 py-3 text-left text-sm font-medium uppercase dark:bg-meta-4 xsm:text-base`}>
          {app ? "Phần mềm" : "Dịch vụ"}
        </th>
        <th className="px-6 py-3 text-left text-sm font-medium uppercase dark:bg-meta-4 xsm:text-base">
          <div className="flex flex-col items-start">
            <span>Request <p className="text-sm  text-blue-600 text-center">
              {totalRequestCount?.toLocaleString()}
            </p></span>

          </div>
        </th>
        {!lienthong && !app && (
          <>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase dark:bg-meta-4 xsm:text-sm">
              thành công
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase dark:bg-meta-4 xsm:text-sm">
              thất bại
            </th>
          </>
        )}
      </tr>
    </thead>
  );

  const renderTableRow = (bucket: Bucket, index: number) => (
    <React.Fragment key={bucket.key}>
      <tr className="table-row" style={{ alignItems: "center", justifyContent: "center" }}>
        <td className="items-center whitespace-normal px-6 py-3 text-left">
          {index + 1}
        </td>
        {!lienthong && (
          <td className="items-center whitespace-normal px-6 py-3 text-left">
            <span
              className="text-blue-600  cursor-pointer hover:underline"
              title="Xem chi tiết dịch vụ này"
              onClick={() => router.push(`/services/detail?search=${encodeURIComponent(bucket.key)}`)}
            >
              {bucket.key}
            </span>
          </td>
        )}
        <td className="items-center whitespace-normal px-6 py-3 text-left" style={{ textAlign: "justify" }}>
          {getDatabaseDescription(bucket.key)}
        </td>
        <td className="px-6 py-3 text-left" style={{ fontWeight: "bold", textAlign: "center" }}>
          <Link
            onClick={() => setSelectedOption3(bucket.key)}
            href={`/details?startDay=${startDate}&endDay=${endDate}`}
          >
            {lienthong && "Tổng: "}
            <a style={{ color: lienthong ? "black" : "" }} className={!lienthong ? "text-blue-600" : ""}>
              {bucket.doc_count?.toLocaleString()}
            </a>
          </Link>
          {renderSuccessFailureStats(bucket, index)}
        </td>
        {!lienthong && !app && renderSuccessFailureColumns(bucket)}
      </tr>
      {index < (filteredData?.length || 0) - 1 && (
        <tr>
          <td colSpan={8}>
            <hr className="my-2 border-t border-[#cccccc] dark:border-[#4c4c4c]" />
          </td>
        </tr>
      )}
    </React.Fragment>
  );

  const renderSuccessFailureStats = (bucket: Bucket, index: number) => {
    if (!lienthong) return null;

    if (index === 0 && matchingCount !== 0 && !loading) {
      const successPercentage = Math.round((matchingCount / bucket.doc_count) * 100);
      const failurePercentage = Math.round(((bucket.doc_count - matchingCount) / bucket.doc_count) * 100);

      return (
        <>
          <p style={{ fontSize: 13 }}>
            Thành công: {matchingCount.toLocaleString()} ({successPercentage}%)
          </p>
          <p style={{ fontSize: 13 }}>
            Thất bại: {(bucket.doc_count - matchingCount).toLocaleString()} ({failurePercentage}%)
          </p>
        </>
      );
    }

    if (index === 1 && matchingCount2 !== 0 && !loading) {
      const successPercentage = Math.round(((bucket.doc_count - matchingCount2) / bucket.doc_count) * 100);
      const failurePercentage = Math.round((matchingCount2 / bucket.doc_count) * 100);

      return (
        <>
          <p style={{ fontSize: 13 }}>
            Thành công: {(bucket.doc_count - matchingCount2).toLocaleString()} ({successPercentage}%)
          </p>
          <p style={{ fontSize: 13 }}>
            Thất bại: {matchingCount2.toLocaleString()} ({failurePercentage}%)
          </p>
        </>
      );
    }

    return null;
  };

  const renderSuccessFailureColumns = (bucket: Bucket) => (
    <>
      <td className="px-6 py-3 text-left" style={{ fontWeight: "bold", textAlign: "center" }}>
        <Link
          className="text-blue-600"
          onClick={() => {
            setSelectedOption3(bucket.key);
            setStatus("1");
          }}
          href={`/detailsResponse?startDay=${startDate}&endDay=${endDate}`}
        >
          {(() => {
            const uniqueCount = bucket.unique_correlation_count?.value || 0;
            const docCount = bucket.doc_count;
            const displayCount = uniqueCount > docCount ? docCount : uniqueCount;
            const percentage = docCount > 0
              ? Math.round((displayCount / docCount) * 100)
              : 0;
            return `${displayCount.toLocaleString()}\n(${percentage}%)`;
          })()}
        </Link>
      </td>
      <td className="px-6 py-3 text-left" style={{ fontWeight: "bold", textAlign: "center" }}>
        <Link
          className="text-blue-600"
          onClick={() => {
            setSelectedOption3(bucket.key);
            setStatus("0");
          }}
          href={`/detailsResponse?startDay=${startDate}&endDay=${endDate}`}
        >
          {(() => {
            const uniqueCount = bucket.unique_correlation_count?.value || 0;
            const docCount = bucket.doc_count;
            const failureCount = uniqueCount > docCount ? 0 : docCount - uniqueCount;
            const percentage = uniqueCount > docCount
              ? 100
              : uniqueCount > 0
                ? Math.max(0, 100 - Math.round((uniqueCount / docCount) * 100))
                : 0;
            return `${failureCount.toLocaleString()}\n(${percentage}%)`;
          })()}
        </Link>
      </td>
    </>
  );

  return (
    <div
      className="rounded-lg border border-stroke bg-white px-6 pb-4 pt-6 shadow-lg dark:border-strokedark dark:bg-boxdark sm:px-8 xl:pb-3"
      style={{ fontFamily: "'Roboto', sans-serif" }}
    >
      <div className="mb-6 flex flex-wrap items-center justify-between gap-6">
        {title && (
          <p style={{ fontSize: 17, fontWeight: "bold", fontFamily: "sans-serif" }}>
            {title}
          </p>
        )}
        <div className="dark:text-gray-200 flex w-full flex-wrap items-center gap-6 dark:bg-boxdark sm:w-auto">
          <div className="flex-grow">
            <label className="text-gray-700 dark:text-gray-300 mb-1 block text-sm font-medium">
              Từ ngày
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => handleDateChange(e, setStartDate)}
              className="border-gray-400 dark:border-gray-600 dark:text-gray-300 relative z-20 w-full appearance-none rounded-md border border-stroke bg-transparent px-4 py-3 outline-none transition focus:border-primary focus:outline-none focus:ring-2 focus:ring-blue-600 active:border-primary dark:border-form-strokedark dark:bg-boxdark dark:bg-form-input dark:focus:ring-blue-400"
            />
          </div>
          <div className="flex-grow">
            <label className="text-gray-700 dark:text-gray-300 mb-1 block text-sm font-medium">
              Đến ngày
            </label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => handleDateChange(e, setEndDate)}
              className="border-gray-400 dark:border-gray-600 dark:text-gray-300 relative z-20 w-full appearance-none rounded-md border border-stroke bg-transparent px-4 py-3 outline-none transition focus:border-primary focus:outline-none focus:ring-2 focus:ring-blue-600 active:border-primary dark:border-form-strokedark dark:bg-boxdark dark:bg-form-input dark:focus:ring-blue-400"
            />
          </div>
          {!lienthong && optionDataApp && (
            <div className="mr-0">
              <label className="text-gray-700 dark:text-gray-300 mb-1 block text-sm font-medium">
                Phần mềm
              </label>
              <SelectGroupTwo
                onSelect={handleSelectAppChange}
                label=""
                options={[
                  { value: "Tất cả", label: "Tất cả" },
                  ...(optionDataApp?.aggregations?.group_by_api?.buckets || []).map((i: Bucket) => ({
                    value: i.key,
                    label: i.key,
                  })),
                ]}
                init="true"
              />
            </div>
          )}
          {app && optionData && (
            <div className="mr-0">
              <label className="text-gray-700 dark:text-gray-300 mb-1 block text-sm font-medium">
                Dịch vụ
              </label>
              <SelectGroupTwo
                onSelect={handleSelectChange}
                label=""
                options={[
                  { value: "Tất cả", label: "Tất cả" },
                  ...(optionData?.aggregations?.group_by_api?.buckets || []).map((i: Bucket) => ({
                    value: i.key,
                    label: i.key,
                  })),
                ]}
                init="true"
              />
            </div>
          )}
        </div>
        {xuatEx && (
          <button
            style={{ alignSelf: "flex-end", backgroundColor: "#3C50E0" }}
            onClick={exportToExcel}
            className="rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700 dark:bg-meta-4"
          >
            Xuất Excel
          </button>
        )}
      </div>

      <div className="mt-6">
        <table className="mb-10 min-w-full table-auto">
          {renderTableHeader()}
          <tbody className="text-gray-600 text-sm font-light">
            {filteredData?.map((bucket, index) => renderTableRow(bucket, index))}
          </tbody>
        </table>

        {(!filteredData?.length || !filteredData) && (
          <div className="mb-10 w-full" style={{ alignSelf: "center" }}>
            <a style={{ textAlign: "center", color: "gray" }}>
              {data?.init ? "Đang tải..." : "Không tìm thấy dữ liệu"}
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default Table;
