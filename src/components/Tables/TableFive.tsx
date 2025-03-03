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
  status,
} from "../../../utilities/Atom/atom";
import { useRecoilState } from "recoil";
import arrowRightIcon from "../../acsset/button-arrow-right-1.png";
// import Link from "next/link";
import { useRouter } from "next/router";
import Link from "next/link";
import Image from "next/image";
const Table = ({
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
  const { aggregations } = data;
  const getTodayDate = () => {
    const today = new Date();
    today.setHours(23, 59, 59, 999);
  
    // Add 24 hours (in milliseconds) to get the end of tomorrow
    const tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000);
  
    // Convert to ISO string and adjust for timezone
    const localISOTime = new Date(tomorrow.getTime() - tomorrow.getTimezoneOffset() * 60000)
      .toISOString()
      .slice(0, -1);
  
    return localISOTime;
  };

  const getLastMonthDate = () => {
    const lastMonth = new Date();
    lastMonth.setMonth(lastMonth.getMonth() - 1);
    return lastMonth.toISOString().split("T")[0];
  };

  const [_, setSelectedOption3] = useRecoilState(selectService);
  const [_s, setStatus] = useRecoilState(status);

  const [matchingCount, setMatchingCount] = useRecoilState(matchingCountState);
  const [matchingCount2, setMatchingCount2] =
    useRecoilState(matchingCountState2);
  const [selectedEnv] = useRecoilState(optionEnviroment);
  const [selectedOptionApp, setSelectedOptionApp] =
    useRecoilState(optionOptionApp);
  const [selectedOption, setSelectedOption] = useRecoilState(optionOption);
  const [optionDataApp, setOptionDataApp] = useState([]);
  const [optionData, setOptionData] = useRecoilState(optionService);
  const [startDate, setStartDate] = useState(getLastMonthDate);
  const [endDate, setEndDate] = useState(getTodayDate);
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 500); // Debouncing 500ms
  // const router = useRouter();
  // const handleNavigation = () => {
  //   if (typeof window !== "undefined") { // Kiểm tra nếu đang ở client
  //     router.push("/");
  //   }
  // };
  const fetchOptionApp = async () => {
    try {
      const response = await axios({
        method: "post",
        url: "/api/service",
        headers: {
          "Content-Type": "application/json",
        },
        data: dataOptionApp(selectedEnv),
      });
      const dataRes = response.data;

      setOptionDataApp(dataRes);
      // setLoading(false);
    } catch (error) {
      console.error("Error fetching documents:", error);
    }
  };
  const fetchOption = async () => {
    try {
      const response = await axios({
        method: "post",
        url: "/api/service",
        headers: {
          "Content-Type": "application/json",
        },
        data: dataOption(selectedEnv),
      });
      const dataRes = response.data;

      setOptionData(dataRes);
      // setLoading(false);
    } catch (error) {
      console.error("Error fetching documents:", error);
    }
  };
  useEffect(() => {
    fetchOption();
    fetchOptionApp();
  }, [selectedEnv]);
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
    let worksheet;
    if (app) {
      worksheet = XLSX.utils.json_to_sheet(
        filteredData.map((bucket, index) => ({
          STT: index + 1,
          "Phần mềm": getDatabaseDescription(bucket.key),
          "Số lượng request": bucket.doc_count,
        })),
      );
    } else {
      worksheet = XLSX.utils.json_to_sheet(
        filteredData.map((bucket, index) => ({
          STT: index + 1,
          "Dịch vụ": getDatabaseDescription(bucket.key),
          "Số lượng request": bucket.doc_count,
        })),
      );
    }
    worksheet["!cols"] = [{ wch: 5 }, { wch: app ? 50 : 150 }, { wch: 20 }];
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
  const handleSelectAppChange = (value: string) => {
    setSelectedOptionApp(value);
  };
  const handleSelectChange = (value: string) => {
    setSelectedOption(value);
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
        {title != "" && (
          <p
            style={{
              fontSize: 17,
              fontWeight: "bold",
              fontFamily: "sans-serif",
            }}
          >
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
          {!lienthong && (
            <div className="mr-0">
              {optionDataApp != null && (
                <>
                  <label className="text-gray-700 dark:text-gray-300 mb-1 block text-sm font-medium">
                    Phần mềm
                  </label>
                  <SelectGroupTwo
                    onSelect={handleSelectAppChange}
                    label=""
                    options={[
                      { value: "Tất cả", label: "Tất cả" },
                      ...(
                        optionDataApp?.aggregations?.group_by_api?.buckets ?? []
                      ).map((i) => ({
                        value: i.key,
                        label: i.key,
                      })),
                    ]}
                  />
                </>
              )}
            </div>
          )}
          {app && (
            <div className="mr-0">
              {optionData != null && (
                <>
                  <label className="text-gray-700 dark:text-gray-300 mb-1 block text-sm font-medium">
                    Dịch vụ
                  </label>
                  <SelectGroupTwo
                    onSelect={handleSelectChange}
                    label=""
                    options={[
                      { value: "Tất cả", label: "Tất cả" },
                      ...(
                        optionData?.aggregations?.group_by_api?.buckets ?? []
                      ).map((i) => ({
                        value: i.key,
                        label: i.key,
                      })),
                    ]}
                  />
                </>
              )}
            </div>
          )}
        </div>

        {/* {search && (
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
        )} */}
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
      {/* {!loading ? */}
      <div className="mt-6">
        <table className="mb-10 min-w-full table-auto">
          <thead style={{ backgroundColor: "#f3f4f6", borderRadius: 20 }}>
            <tr className="bg-gray-200 text-gray-600 border-gray-300 round-lg text-sm uppercase leading-normal">
              <th className="w-[10%] px-6 py-3 text-left text-sm font-medium uppercase dark:bg-meta-4 xsm:text-base">
                STT
              </th>
              {!lienthong && (
                <th className="w-[10%] px-6 py-3 text-left text-sm font-medium uppercase dark:bg-meta-4 xsm:text-base">
                  {app ? "Mã" : "Mã"}
                </th>
              )}

              <th
                className={
                  lienthong
                    ? "w-[10%] px-6 py-3 text-left text-sm font-medium uppercase dark:bg-meta-4 xsm:text-base"
                    : "w-[50%] px-6 py-3 text-left text-sm font-medium uppercase dark:bg-meta-4 xsm:text-base"
                }
              >
                {app ? "Phần mềm" : "Dịch vụ"}
              </th>

              <th className="px-6 py-3 text-left text-sm font-medium uppercase dark:bg-meta-4 xsm:text-base">
                request
              </th>
              {!lienthong && !app && (
                <>
                  <th
                    style={{ textAlign: "center" }}
                    className="px-6 py-3 text-left text-xs font-medium uppercase dark:bg-meta-4 xsm:text-sm"
                  >
                    thành công
                  </th>
                  <th
                    style={{ textAlign: "center" }}
                    className="px-6 py-3 text-left text-xs font-medium uppercase dark:bg-meta-4 xsm:text-sm"
                  >
                    thất bại
                  </th>

                </>
              )}
            </tr>
          </thead>
          <tbody className="text-gray-600 text-sm font-light">
            {filteredData?.map((bucket, index) => (
              <React.Fragment key={bucket.key}>
                <tr
                  onClick={() => handleNavigation()}
                  style={{ alignItems: "center", justifyContent: "center" }}
                  className="table-row"
                >
                  <td
                    style={{ alignItems: "center" }}
                    className=" items-center whitespace-normal px-6 py-3 text-left"
                  >
                    {index + 1}
                  </td>
                  {!lienthong && (
                    <td
                      style={{ alignItems: "center" }}
                      className="items-center whitespace-normal px-6 py-3 text-left"
                    >
                      {bucket?.key}
                    </td>
                  )}
                  <td
                    style={{ alignItems: "center", textAlign: "justify" }}
                    className="items-center whitespace-normal px-6 py-3 text-left"
                  >
                    {getDatabaseDescription(bucket?.key)}
                  </td>
                  <td
                    style={{ fontWeight: "bold" }}
                    className={"px-6 py-3 text-left"}
                  >
                    {/* {!lienthong
                      ? bucket?.doc_count?.toLocaleString()
                      : bucket?.unique_correlation_count?.value?.toLocaleString()} */}
                    <Link
                      onClick={() => {
                        setSelectedOption3(bucket.key);
                      }}
                      href={`/details?startDay=${startDate}&endDay=${endDate}`}
                    // className="hover:text-blue-600 hover:underline"
                    >


                      {lienthong && "Tổng:"}
                      <a
                        style={{ color: lienthong ? 'black' : '' }}
                        className={!lienthong ? "text-blue-600" : ""}
                      >
                        {bucket?.doc_count?.toLocaleString()}
                      </a>
                    </Link>
                    {lienthong &&
                      index == 0 &&
                      matchingCount != 0 &&
                      !loading && (
                        <>
                          <p style={{ fontSize: 13 }}>
                            Thành công: {matchingCount.toLocaleString()} (
                            {Math.round(
                              (matchingCount / bucket?.doc_count) * 100,
                            ).toLocaleString() + "%"}
                            )
                          </p>
                          <p style={{ fontSize: 13 }}>
                            Thất bại:{" "}
                            {(
                              bucket?.doc_count - matchingCount
                            ).toLocaleString()}{" "}
                            (
                            {Math.round(
                              ((bucket?.doc_count - matchingCount) /
                                bucket?.doc_count) *
                              100,
                            ).toLocaleString() + "%"}
                            )
                          </p>
                        </>
                      )}
                    {lienthong &&
                      index == 1 &&
                      matchingCount2 != 0 &&
                      !loading && (
                        <>
                          <p style={{ fontSize: 13 }}>
                            Thành công:{" "}
                            {(
                              bucket?.doc_count - matchingCount2
                            ).toLocaleString()}{" "}
                            (
                            {Math.round(
                              ((bucket?.doc_count - matchingCount2) /
                                bucket?.doc_count) *
                              100,
                            ).toLocaleString() + "%"}
                            )
                          </p>
                          <p style={{ fontSize: 13 }}>
                            Thất bại: {matchingCount2.toLocaleString()} (
                            {Math.round(
                              (matchingCount2 / bucket?.doc_count) * 100,
                            ).toLocaleString() + "%"}
                            )
                          </p>
                        </>
                      )}
                  </td>

                  {!lienthong && !app && (
                    <>
                      <td
                        style={{ fontWeight: "bold", textAlign: "center" }}
                        className="px-6 py-3 text-left"
                      >
                        <Link className="text-blue-600"
                          onClick={() => {
                            setSelectedOption3(bucket.key);
                            setStatus("1");
                          }}
                          href={`/detailsResponse?startDay=${startDate}&endDay=${endDate}`}
                        // className="hover:text-blue-600 hover:underline"
                        >

                          {" "}
                          {(() => {
                            // Destructure values for better readability
                            const uniqueCount = bucket?.unique_correlation_count?.value;
                            const docCount = bucket?.doc_count;

                            // Determine what to display
                            if (uniqueCount > docCount) {
                              return docCount.toLocaleString(); // Show doc_count if unique_count exceeds it
                            } else if (uniqueCount) {
                              return uniqueCount.toLocaleString(); // Show unique_count if it exists
                            } else {
                              return "0"; // Fallback value if both counts are not present
                            }
                          })()}
                          {"\n"}
                          (
                          {bucket?.doc_count > 0
                            ? Math.round(
                              ((bucket?.unique_correlation_count?.value > bucket?.doc_count
                                ? bucket?.doc_count // Use doc_count if unique_correlation_count exceeds doc_count
                                : bucket?.unique_correlation_count?.value) /
                                bucket?.doc_count) *
                              100,
                            ).toLocaleString() + "%"
                            : "0%"}
                          )
                        </Link>


                        {/* {bucket?.unique_correlation_count?.value.toLocaleString()}{"\n"}
                        ({
                          bucket?.unique_correlation_count?.value > 0
                            ? Math.round(
                              (bucket?.unique_correlation_count?.value > bucket?.doc_count
                                ? bucket?.doc_count // Use doc_count if unique_correlation_count exceeds doc_count
                                : bucket?.unique_correlation_count?.value) / bucket?.doc_count * 100
                            ).toLocaleString() + "%"
                            : "0%"
                        }) */}
                      </td>
                      <td
                        style={{ fontWeight: "bold", textAlign: "center" }}
                        className="px-6 py-3 text-left"
                      >

                        <Link
                          onClick={() => {
                            setSelectedOption3(bucket.key);
                            setStatus("0")
                          }}
                          href={`/detailsResponse?startDay=${startDate}&endDay=${endDate}`}
                          // className="hover:text-blue-600 hover:underline"
                          className="text-blue-600"

                        // className="arrow-button"
                        >
                          {/* Thay chữ bằng SVG icon mũi tên */}
                          {bucket?.unique_correlation_count?.value >
                            bucket?.doc_count
                            ? 0
                            : (
                              bucket?.doc_count -
                              (bucket?.unique_correlation_count?.value || 0)
                            ).toLocaleString()}
                          <br />(
                          {
                            !bucket?.unique_correlation_count?.value >
                              bucket?.doc_count
                              ? "100%" // If unique_correlation_count exceeds doc_count, display 100%
                              : bucket?.unique_correlation_count?.value > 0
                                ? (() => {
                                  // Calculate the percentage
                                  const percentage =
                                    100 -
                                    Math.round(
                                      (bucket?.unique_correlation_count?.value /
                                        bucket?.doc_count) *
                                      100,
                                    );
                                  // Return 0% if the calculated percentage is less than 0
                                  return percentage < 0
                                    ? "0%"
                                    : percentage.toLocaleString() + "%";
                                })() // IIFE for inline calculation
                                : "0%" // If unique_correlation_count is 0 or not present, display 0%
                          }
                          )
                        </Link>


                      </td>
                    </>
                  )}

                  {/* Thêm lớp "arrow-button" để style */}
                  {/* {!lienthong && (
                    <td>
                      <Link
                        onClick={() => setSelectedOption3(bucket.key)}
                        href="/detailsResponse"
                        className="arrow-button"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="icon"
                        >
                          <line x1="5" y1="12" x2="19" y2="12"></line>
                          <polyline points="12 5 19 12 12 19"></polyline>
                        </svg>
                      </Link>
                    </td>
                  )} */}
                </tr>
                {index < filteredData.length - 1 && (
                  <tr>
                    <td colSpan="8">
                      <hr className="my-2 border-t border-[#cccccc] dark:border-[#4c4c4c]" />
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>

        {(filteredData?.length == 0 || !filteredData) &&
          (data?.init ? (
            <div className="mb-10 w-full" style={{ alignSelf: "center" }}>
              <a style={{ textAlign: "center", color: "gray" }}>Đang tải...</a>
            </div>
          ) : (
            <div className="mb-10 w-full" style={{ alignSelf: "center" }}>
              <a style={{ textAlign: "center", color: "gray" }}>
                Không tìm thấy dữ liệu
              </a>
            </div>
          ))}
      </div>
    </div>
  );
};

export default Table;
