import React, { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import useDebounce from "../../hooks/useDebounce";
import MultiSelect from "../FormElements/MultiSelect";
import { getDatabaseDescription } from "../../../utilities/GlobalFunction";
const Table = ({
  data,
  onStartDateChange,
  onEndDateChange,
  search = true,
  xuatEx = true,
  title = "",
}) => {
  const { aggregations } = data;
  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  };

  const getLastMonthDate = () => {
    const lastMonth = new Date();
    lastMonth.setFullYear(lastMonth.getFullYear() - 1);
    return lastMonth.toISOString().split("T")[0];
  };

  const [startDate, setStartDate] = useState("2023-01-01");
  const [endDate, setEndDate] = useState(getTodayDate());
  const [searchTerm, setSearchTerm] = useState("");
  console.log("Today==>", getTodayDate());
  const debouncedSearchTerm = useDebounce(searchTerm, 500); // Debouncing 500ms

  const handleDateChange = (e, setDate) => {
    setDate(e.target.value);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredData = aggregations?.group_by_api.buckets?.filter((bucket) =>
    bucket.key.toLowerCase().includes(debouncedSearchTerm.toLowerCase()),
  );

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(
      filteredData.map((bucket, index) => ({
        STT: index + 1,
        "Dịch vụ": getDatabaseDescription(bucket.key),
        "Số lượng request": bucket.doc_count,
      })),
    );

    worksheet["!cols"] = [{ wch: 5 }, { wch: 100 }, { wch: 20 }];
    for (let i = 1; i <= filteredData.length; i++) {
      worksheet[`A${i + 1}`].s = {
        alignment: { horizontal: "center" },
        font: { name: "Times New Roman" },
      };

      worksheet[`B${i + 1}`].s = {
        font: { name: "Times New Roman" },
      };

      worksheet[`C${i + 1}`].s = {
        alignment: { horizontal: "center" },
        font: { name: "Times New Roman" },
      };
    }

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Data");
    XLSX.writeFile(workbook, "ThongKeLGSP.xlsx");
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
        <div className="dark:text-gray-200 flex w-full flex-wrap items-center gap-6 dark:bg-boxdark sm:w-auto">
          {title != "" && (
            <p style={{ fontSize: 17, fontWeight: "bold",fontFamily:"sans-serif" }}>{title}</p>
          )}
          <div className="flex-grow">
            <label className="text-gray-700 dark:text-gray-300 mb-1 block text-sm font-medium">
              Từ ngày
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => handleDateChange(e, setStartDate)}
              className="border-gray-400 dark:border-gray-600 dark:text-gray-300 relative z-20 w-full w-full appearance-none rounded rounded-md border border border-stroke bg-transparent px-12 px-4 py-2 py-3 outline-none transition focus:border-primary focus:outline-none focus:ring-2 focus:ring-blue-600 active:border-primary dark:border-form-strokedark dark:bg-boxdark dark:bg-form-input dark:focus:ring-blue-400"
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
              className="border-gray-400 dark:border-gray-600 dark:text-gray-300 relative z-20 w-full w-full appearance-none rounded rounded-md border border border-stroke bg-transparent px-12 px-4 py-2 py-3 outline-none transition focus:border-primary focus:outline-none focus:ring-2 focus:ring-blue-600 active:border-primary dark:border-form-strokedark dark:bg-boxdark dark:bg-form-input dark:focus:ring-blue-400"
            />
          </div>
        </div>

        {search && (
          <div className="w-full sm:w-1/3">
            <label className="text-gray-700 mb-1 block text-sm font-medium">
              Tìm kiếm
            </label>
            <input
              type="text"
              value={searchTerm}
              onChange={handleSearchChange}
              placeholder="Nhập từ khóa..."
              className="border-gray-400 relative z-20 w-full w-full appearance-none rounded rounded-md border border border-stroke bg-transparent px-12 px-4 py-2 py-3 outline-none transition focus:border-primary focus:outline-none focus:ring-2 focus:ring-blue-600 active:border-primary dark:border-form-strokedark dark:bg-boxdark dark:bg-form-input"
            />
          </div>
        )}
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
          <thead style={{ backgroundColor: "#f3f4f6", borderRadius: 20 }}>
            <tr className="bg-gray-200 text-gray-600 border-gray-300 text-sm uppercase leading-normal round-lg">
              <th className="w-[70%] px-6 py-3 text-left text-sm font-medium uppercase dark:bg-meta-4 xsm:text-base">
                Dịch vụ
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium uppercase dark:bg-meta-4 xsm:text-base">
                request
              </th>
            </tr>
          </thead>
          <tbody className="text-gray-600 text-sm font-light">
            {filteredData?.map((bucket, index) => (
              <React.Fragment key={bucket.key}>
                <tr
                  style={{ alignItems: "center", justifyContent: "center" }}
                  className="hover:bg-gray-100 fade-in"
                >
                  <td
                    style={{ alignItems: "center" }}
                    className="flex items-center whitespace-normal px-6 py-3 text-left"
                  >
                    {getDatabaseDescription(bucket?.key)}
                  </td>
                  <td
                    style={{ fontWeight: "bold" }}
                    className="px-6 py-3 text-left"
                  >
                    {bucket.doc_count.toLocaleString()}
                  </td>
                </tr>
                {index < filteredData.length - 1 && (
                  <tr>
                    <td colSpan="2">
                      <hr className="my-2 border-t border-[#cccccc] dark:border-[#4c4c4c]" />
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>

        {(filteredData?.length == 0 || !filteredData) && (
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
