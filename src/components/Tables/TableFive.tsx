import React, { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import useDebounce from "../../hooks/useDebounce";
import MultiSelect from "../FormElements/MultiSelect";
const Table = ({ data, onStartDateChange, onEndDateChange }) => {
  const { aggregations } = data;
  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  };

  const getLastMonthDate = () => {
    const lastMonth = new Date();
    lastMonth.setMonth(lastMonth.getMonth() - 1);
    return lastMonth.toISOString().split("T")[0];
  };

  const [startDate, setStartDate] = useState(getLastMonthDate());
  const [endDate, setEndDate] = useState(getTodayDate());
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 500); // Debouncing 500ms

  const handleDateChange = (e, setDate) => {
    setDate(e.target.value);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredData = aggregations.group_by_api.buckets.filter((bucket) =>
    bucket.key.toLowerCase().includes(debouncedSearchTerm.toLowerCase()),
  );

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(
      filteredData.map((bucket) => ({
        "Dịch vụ": bucket.key,
        "Số lượng request": bucket.doc_count,
      })),
    );

    worksheet["!cols"] = [{ wch: 30 }, { wch: 20 }];

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Data");
    XLSX.writeFile(workbook, "data.xlsx");
  };
  useEffect(() => {
    onStartDateChange(startDate);
  }, [startDate, onStartDateChange]);

  useEffect(() => {
    onEndDateChange(endDate);
  }, [endDate, onEndDateChange]);
  return (
    <div
      className="rounded-lg border border-stroke bg-white px-6 pb-4 pt-6 shadow-lg dark:border-strokedark dark:bg-boxdark sm:px-8 xl:pb-3"
      style={{ fontFamily: "'Roboto', sans-serif" }}
    >
      <div className="mb-6 flex flex-wrap items-center justify-between gap-6">
        <div className="dark:bg-boxdark dark:text-gray-200 flex w-full flex-wrap items-center gap-6 sm:w-auto">
          <div className="flex-grow">
            <label className="text-gray-700 dark:text-gray-300 mb-1 block text-sm font-medium">
              Từ ngày
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => handleDateChange(e, setStartDate)}
              className="relative z-20 w-full appearance-none rounded border border-stroke bg-transparent px-12 py-3 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input border-gray-400 dark:bg-boxdark dark:border-gray-600 dark:text-gray-300 w-full rounded-md border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600 dark:focus:ring-blue-400"
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
              className="relative z-20 w-full appearance-none rounded border border-stroke bg-transparent px-12 py-3 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input border-gray-400 dark:bg-boxdark dark:border-gray-600 dark:text-gray-300 w-full rounded-md border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600 dark:focus:ring-blue-400"
            />
          </div>
        </div>

        <div className="w-full sm:w-1/3">
          <label className="text-gray-700 mb-1 block text-sm font-medium">
            Tìm kiếm
          </label>
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder="Nhập từ khóa..."
            className="relative z-20 w-full appearance-none rounded border border-stroke bg-transparent px-12 py-3 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input border-gray-400 w-full rounded-md border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600 dark:bg-boxdark"
          />
        </div>
        <button style={{ alignSelf: "flex-end", backgroundColor: '#3C50E0' }}
          onClick={exportToExcel}
          className="rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700 dark:bg-meta-4"
        >
          Xuất Excel
        </button>
      </div>
      <div className="mt-6">
        <table className="mb-10 min-w-full table-auto ">
          <thead style={{ backgroundColor: "#f3f4f6", borderRadius: 5 }}>
            <tr className="bg-gray-200 text-gray-600 border-gray-300 text-sm uppercase leading-normal">
              <th className="px-6 py-3 text-left text-sm font-medium uppercase xsm:text-base dark:bg-meta-4">
                Dịch vụ
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium uppercase xsm:text-base dark:bg-meta-4">
                Số lượng request
              </th>
            </tr>
          </thead>
          <tbody className="text-gray-600 text-sm font-light">
            {filteredData.map((bucket) => (
              <tr
                className="border-gray-100 hover:bg-gray-100 fade-in"
                key={bucket.key}
              >
                <td className="flex items-center whitespace-nowrap px-6 py-3 text-left">
                  {bucket.key}
                </td>
                <td className="px-6 py-3 text-left">
                  {bucket.doc_count.toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredData.length == 0 && (
          <div className="mb-10 w-full" style={{ alignSelf: "center" }}>
            <a style={{ textAlign: "center", color: "gray" }}>
              Không tìm thấy dữ liệu
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default Table;
