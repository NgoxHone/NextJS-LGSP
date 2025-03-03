import { BRAND } from "@/types/brand";
import Image from "next/image";
import DropdownDefault from "../Dropdowns/DropdownDefault";
import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { optionEnviroment, optionService, selectService } from "../../../utilities/Atom/atom";
import { dataOption, dataOptionApp } from "../Chat/body";
import { bodyLog } from "./body";
import axios from "axios";
import SelectGroupTwo from "../SelectGroup/SelectGroupTwo";
import ReactPaginate from "react-paginate"; // Import react-paginate

import {
  convertDateToMilliseconds,
  formatTimestampToDate,
  getDatabaseDescription,
} from "../../../utilities/GlobalFunction";
const DetailServices: React.FC = () => {
  const [optionData, setOptionData] = useRecoilState(optionService);
  const [optionDataApp, setOptionDataApp] = useState([]);
  const [isParamsLoaded, setIsParamsLoaded] = useState(false); // State to check if params are loaded
  const [selectedOption, setSelectedOption] = useRecoilState(selectService);
  const [selectedOptionApp, setSelectedOptionApp] = useState("Tất cả");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [data, setData] = useState([]);
  const [selectedEnv] = useRecoilState(optionEnviroment);
  const [totalItems, setTotalItems] = useState(0); // Tổng số item
  const [page, setPage] = useState(0); // Trang hiện tại
  const itemsPerPage = 30; // Số lượng bản ghi mỗi trang
  const handleDateChange = (e, setDate) => {
    setDate(e.target.value);
    setPage(0)
  };

  console.log(
    "ALO ALO",

    bodyLog(
      selectedEnv,
      selectedOption,
      selectedOptionApp,
      convertDateToMilliseconds(startDate),
      convertDateToMilliseconds(endDate),
      page * itemsPerPage,
      itemsPerPage,
    ),
  );
  const fetchData = async () => {
    try {
      const response = await axios({
        method: "post",
        url: "/api/service",
        headers: {
          "Content-Type": "application/json",
        },
        data: bodyLog(
          selectedEnv,
          selectedOption,
          selectedOptionApp,
          convertDateToMilliseconds(startDate),
          convertDateToMilliseconds(endDate),
          page * itemsPerPage,
          itemsPerPage,
        ),
      });
      const dataRes = response.data;
      console.log("ressss", bodyLog(
        selectedEnv,
        selectedOption,
        selectedOptionApp,
        convertDateToMilliseconds(startDate),
        convertDateToMilliseconds(endDate),
        page * itemsPerPage,
        itemsPerPage,
      ),);
      setData(dataRes);
      setTotalItems(dataRes.hits.total.value); // Lưu tổng số item
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
  useEffect(() => {
    fetchOption();
    fetchOptionApp();
  }, [selectedEnv]);
  useEffect(() => {
    // Load parameters from URL
    const urlParams = new URLSearchParams(window.location.search);
    const startDay = urlParams.get("startDay");
    const endDay = urlParams.get("endDay");

    // Set parameters from URL
    setStartDate(startDay);
    setEndDate(endDay);

    // Indicate that parameters have been loaded
    setIsParamsLoaded(true);
  }, []);
  useEffect(() => {
    if (isParamsLoaded) {
      const delay = setTimeout(() => {
        fetchData();
      }, 1000);

      return () => clearTimeout(delay); // Cleanup timeout if dependencies change
    }
  }, [
    selectedOption,
    selectedEnv,
    selectedOptionApp,
    startDate,
    endDate,
    page, isParamsLoaded
  ]);

  console.log(selectedOption);
  // Hàm xử lý khi người dùng chọn một giá trị mới từ dropdown
  const handleSelectChange = (value: string) => {
    setSelectedOption(value);
    setPage(0)
  };
  const handleSelectAppChange = (value: string) => {
    setSelectedOptionApp(value);
    setPage(0)

  };
  const handlePageChange = (selectedPage) => {
    setPage(selectedPage); // Đặt trang mới

  };
  console.log("dt", data);
  return (
    <div className="col-span-12 xl:col-span-7">
      <div className="rounded-lg border border-stroke bg-white px-5 pb-2.5 pt-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
        <div className="mb-6 flex flex-col justify-between md:flex-row">
          <div
            className="flex w-full flex-col md:flex-row"
            style={{
              alignSelf: "center",
              justifyContent: "space-evenly",
            }}
          >
            <div className="mb-4 mr-2 w-full md:mb-0 md:w-auto">
              <p style={{ fontFamily: "sans-serif" }}>Dịch vụ</p>
              {optionData != null && (
                <SelectGroupTwo
                  init={selectedOption}
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
              )}
            </div>
            <div className="mb-4 w-full md:mb-0 md:w-auto">
              <p style={{ fontFamily: "sans-serif" }}>Phần mềm</p>
              {optionData != null && (
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
              )}
            </div>
            <div className="mb-4 w-full flex-grow md:mb-0 md:ml-2 md:w-auto">
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
            <div className="w-full flex-grow md:ml-2 md:w-auto">
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
        </div>

        <div className="w-full overflow-auto">
          <table className="min-w-full border-collapse border border-stroke dark:border-strokedark">
            <thead>
              <tr className="bg-gray-100 dark:bg-gray-700">
                <th className="border border-stroke dark:border-strokedark p-3 text-left font-medium text-black dark:text-white">STT</th>
                <th className="border border-stroke dark:border-strokedark p-3 text-left font-medium text-black dark:text-white">Thời gian</th>
                <th className="border border-stroke dark:border-strokedark p-3 text-left font-medium text-black dark:text-white">Dịch vụ</th>
                <th className="border border-stroke dark:border-strokedark p-3 text-left font-medium text-black dark:text-white">Mô tả</th>
                <th className="border border-stroke dark:border-strokedark p-3 text-left font-medium text-black dark:text-white">Phần mềm</th>
                <th className="border border-stroke dark:border-strokedark p-3 text-left font-medium text-black dark:text-white">Full Request Path</th>
                {/* <th className="border border-stroke dark:border-strokedark p-3 text-left font-medium text-black dark:text-white">Header</th> */}

              </tr>
            </thead>
            <tbody>
              {data?.hits?.hits?.map((brand, index) => (
                <tr key={index} className={`${index % 2 === 0 ? 'bg-white dark:bg-gray-800' : 'bg-gray-50 dark:bg-gray-900'}`}>
                  <td className="border border-stroke dark:border-strokedark p-3 text-black dark:text-white font-medium">
                    {index + 1}.
                  </td>
                  <td className="border border-stroke dark:border-strokedark p-3 text-gray-500 dark:text-gray-400 italic text-sm">
                    {formatTimestampToDate(brand?._source.date_created)}
                  </td>
                  <td className="border border-stroke dark:border-strokedark p-3 font-medium text-blue-600 dark:text-blue-400">
                    {brand?._source?.api} - {brand?._source.am_key_type}
                  </td>
                  <td className="border border-stroke dark:border-strokedark p-3 text-black dark:text-white" style={{ fontFamily: "sans-serif" }}>
                    {getDatabaseDescription(brand?._source?.api)}
                  </td>

                  <td className="border border-stroke dark:border-strokedark p-3 font-medium text-orange-400 dark:text-orange-400">
                    {brand?._source?.application_name}
                  </td>
                  <td className="border border-stroke dark:border-strokedark p-3 font-medium text-green-600 dark:text-green-600">
                    {brand?._source?.full_request_path}
                  </td>
                  {/* <td
                    className="border border-stroke dark:border-strokedark p-3 font-medium text-green-600 dark:text-green-600 truncate max-w-xs"
                    title={brand?._source?.headers}
                  >
                    {brand?._source?.headers?.length > 30
                      ? brand?._source?.headers.slice(0, 30) + "..."
                      : brand?._source?.headers}
                  </td> */}

                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mb-10 mt-4 flex justify-center gap-2">
          <ReactPaginate
            previousLabel={"Trang trước"}
            nextLabel={"Trang sau"}
            breakLabel={"..."}
            breakClassName={"break-me"}
            pageCount={Math.ceil(totalItems / itemsPerPage)} // Tổng số trang
            marginPagesDisplayed={2} // Số trang hiển thị ở đầu và cuối
            pageRangeDisplayed={5} // Số trang hiển thị xung quanh trang hiện tại
            onPageChange={(selectedItem) =>
              handlePageChange(selectedItem.selected)
            } // Cập nhật page
            containerClassName={"pagination"} // Lớp CSS cho container phân trang
            activeClassName={"active"} // Lớp CSS cho trang đang hoạt động
            previousClassName={"prev-page"}
            nextClassName={"next-page"}
            disabledClassName={"disabled"}
            forcePage={page}
          />
        </div>
      </div>
    </div>
  );
};

export default DetailServices;

// const DetailServices: React.FC = () => {
//   const [optionData, setOptionData] = useRecoilState(optionService);
//   const [optionDataApp, setOptionDataApp] = useState([]);

//   const [selectedOption, setSelectedOption] = useState("Tất cả");
//   const [selectedOptionApp, setSelectedOptionApp] = useState("Tất cả");
//   const [startDate, setStartDate] = useState(null);
//   const [endDate, setEndDate] = useState(null);
//   const [data, setData] = useState([]);
//   const [totalItems, setTotalItems] = useState(0); // Tổng số item
//   const [page, setPage] = useState(0); // Trang hiện tại
//   const itemsPerPage = 30; // Số lượng bản ghi mỗi trang
//   const [selectedEnv] = useRecoilState(optionEnviroment);

//   const fetchData = async () => {
//     try {
//       const response = await axios({
//         method: "post",
//         url: "/api/service",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         data: bodyLog(
//           selectedEnv,
//           selectedOption,
//           selectedOptionApp,
//           convertDateToMilliseconds(startDate),
//           convertDateToMilliseconds(endDate),
//           page * itemsPerPage,
//           itemsPerPage,
//         ),
//       });
//       const dataRes = response.data;

//       setData(dataRes.hits.hits);
//       setTotalItems(dataRes.hits.total.value); // Lưu tổng số item
//     } catch (error) {
//       console.error("Error fetching documents:", error);
//     }
//   };

//   useEffect(() => {
//     fetchData();
//   }, [
//     selectedOption,
//     selectedEnv,
//     selectedOptionApp,
//     startDate,
//     endDate,
//     page,
//   ]);

//   const handleSelectChange = (value: string) => {
//     setSelectedOption(value);
//   };

//   const handleSelectAppChange = (value: string) => {
//     setSelectedOptionApp(value);
//   };

//   const handlePageChange = (newPage: number) => {
//     setPage(newPage);
//   };

//   return (
//     <div className="col-span-12 xl:col-span-7">
//       {/* Các thành phần khác */}
//       <div className="mb-6 flex flex-col justify-between md:flex-row">
//         <div
//           className="flex w-full flex-col md:flex-row"
//           style={{
//             alignSelf: "center",
//             justifyContent: "space-evenly",
//           }}
//         >
//           <div className="mb-4 mr-2 w-full md:mb-0 md:w-auto">
//             <p style={{ fontFamily: "sans-serif" }}>Dịch vụ</p>
//             {optionData != null && (
//               <SelectGroupTwo
//                 onSelect={handleSelectChange}
//                 label=""
//                 options={[
//                   { value: "Tất cả", label: "Tất cả" },
//                   ...(
//                     optionData?.aggregations?.group_by_api?.buckets ?? []
//                   ).map((i) => ({
//                     value: i.key,
//                     label: i.key,
//                   })),
//                 ]}
//               />
//             )}
//           </div>
//           <div className="mb-4 w-full md:mb-0 md:w-auto">
//             <p style={{ fontFamily: "sans-serif" }}>Phần mềm</p>
//             {optionData != null && (
//               <SelectGroupTwo
//                 onSelect={handleSelectAppChange}
//                 label=""
//                 options={[
//                   { value: "Tất cả", label: "Tất cả" },
//                   ...(
//                     optionDataApp?.aggregations?.group_by_api?.buckets ?? []
//                   ).map((i) => ({
//                     value: i.key,
//                     label: i.key,
//                   })),
//                 ]}
//               />
//             )}
//           </div>
//           <div className="mb-4 w-full flex-grow md:mb-0 md:ml-2 md:w-auto">
//             <label className="text-gray-700 dark:text-gray-300 mb-1 block text-sm font-medium">
//               Từ ngày
//             </label>
//             <input
//               type="date"
//               value={startDate}
//               onChange={(e) => handleDateChange(e, setStartDate)}
//               className="border-gray-400 dark:border-gray-600 dark:text-gray-300 relative z-20 w-full w-full appearance-none rounded rounded-md border border border-stroke bg-transparent px-12 px-4 py-2 py-3 outline-none transition focus:border-primary focus:outline-none focus:ring-2 focus:ring-blue-600 active:border-primary dark:border-form-strokedark dark:bg-boxdark dark:bg-form-input dark:focus:ring-blue-400"
//             />
//           </div>
//           <div className="w-full flex-grow md:ml-2 md:w-auto">
//             <label className="text-gray-700 dark:text-gray-300 mb-1 block text-sm font-medium">
//               Đến ngày
//             </label>
//             <input
//               type="date"
//               value={endDate}
//               onChange={(e) => handleDateChange(e, setEndDate)}
//               className="border-gray-400 dark:border-gray-600 dark:text-gray-300 relative z-20 w-full w-full appearance-none rounded rounded-md border border border-stroke bg-transparent px-12 px-4 py-2 py-3 outline-none transition focus:border-primary focus:outline-none focus:ring-2 focus:ring-blue-600 active:border-primary dark:border-form-strokedark dark:bg-boxdark dark:bg-form-input dark:focus:ring-blue-400"
//             />
//           </div>
//         </div>
//       </div>
//       <div className="flex flex-col">
//         {data?.map((brand, key) => (
//           <div
//             key={key}
//             className="border-b border-stroke dark:border-strokedark"
//           >
//             <div className="flex items-center gap-1 p-2.5 xl:p-5">
//               <p className="hidden items-start font-medium text-black dark:text-white sm:block">
//                 {key + 1}.
//               </p>
//               <div className="items-center p-2.5 xl:p-5">
//                 <p className="text-gray-200 dark:text-gray-400 text-sm italic">
//                   {formatTimestampToDate(brand?._source.date_created)}
//                 </p>
//                 <p style={{ fontFamily: "sans-serif" }}>
//                   {getDatabaseDescription(brand?._source?.api)}
//                 </p>
//                 <p className="font-medium text-blue-600 dark:text-blue-400">
//                   {brand?._source?.api} - {brand?._source.am_key_type}
//                 </p>
//                 <p className="font-medium text-green-600 dark:text-green-600">
//                   {brand?._source?.full_request_path}
//                 </p>
//                 <p className="font-medium text-orange-400 dark:text-orange-400">
//                   {brand?._source?.application_name}
//                 </p>
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* Phân trang */}

//     </div>
//   );
// };
// export default DetailServices
