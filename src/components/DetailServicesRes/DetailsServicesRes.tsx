import React, { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import ReactPaginate from "react-paginate"; // Import thư viện phân trang
import { optionEnviroment, optionService, selectService, status } from "../../../utilities/Atom/atom";
import axios from "axios";
import SelectGroupTwo from "../SelectGroup/SelectGroupTwo";
import { bodyLog } from "./body";
import {
    convertDateToMilliseconds,
    formatTimestampToDate,
    getDatabaseDescription,
    getStatusStyles,
} from "../../../utilities/GlobalFunction";
import { dataOption, dataOptionApp } from "../Chat/body";

const DetailServicesRes: React.FC = () => {
    const [optionData, setOptionData] = useRecoilState(optionService);
    const [optionDataApp, setOptionDataApp] = useState([]);
    const [selectedOption, setSelectedOption] = useRecoilState(selectService);
    const [selectedOption2, setSelectedOption2] = useRecoilState(status);
    const [selectedOptionApp, setSelectedOptionApp] = useState("Tất cả");
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [data, setData] = useState([]);
    const [selectedEnv] = useRecoilState(optionEnviroment);
    const [totalItems, setTotalItems] = useState(0); // Tổng số item
    const [page, setPage] = useState(0); // Trang hiện tại
    const itemsPerPage = 30; // Số lượng bản ghi mỗi trang
    const [isParamsLoaded, setIsParamsLoaded] = useState(false); // State to check if params are loaded
    const totalPages = Math.ceil(totalItems / itemsPerPage); // Tổng số trang

    const handleDateChange = (e, setDate) => {
        setDate(e.target.value);
        setPage(0);
    };
    const handleSelectChange = (value: string) => {
        console.log(value)
        setSelectedOption(value);
        setPage(0);
    };
    const handleSelectChange2 = (value: string) => {
        setSelectedOption2(value);
        setPage(0);
    };
    const handleSelectAppChange = (value: string) => {
        setSelectedOptionApp(value);
        setPage(0);
    };
    // const handlePageChange = (newPage: number) => {
    //     setPage(newPage);
    // };
    const getStatusStyles = (statusCode) => {
        switch (true) {
            case statusCode >= 200 && statusCode < 300:
                return "text-green-500 "; // Thành công
            case statusCode >= 300 && statusCode < 400:
                return "text-blue-500"; // Điều hướng
            case statusCode >= 400 && statusCode < 500:
                return "text-yellow-500 text-white"; // Lỗi client
            case statusCode >= 500:
                return "bg-red-500 text-red border-red-700"; // Lỗi server
            default:
                return "bg-gray-500 text-black border-gray-700"; // Không xác định
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
                    selectedOption2,
                ),
            });
            const dataRes = response.data;
            console.log(dataRes);
            setData(dataRes);
            setTotalItems(dataRes.hits.total.value); // Lưu tổng số item
        } catch (error) {
            console.error("Error fetching documents:", error);
        }
    };

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
        // Wait for parameters to load before calling API
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
        page,
        selectedOption2,
        isParamsLoaded, // Only call API when params are loaded
    ]);
    // Xử lý thay đổi trang
    const handlePageChange = (selectedItem) => {
        setPage(selectedItem.selected); // Cập nhật trang dựa vào chỉ số trang được chọn
    };
    console.log("===>", selectedOption2)
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
                        <div className="mb-4 ml-2 w-full md:mb-0 md:w-auto">
                            <p style={{ fontFamily: "sans-serif" }}>Trạng thái</p>
                            <SelectGroupTwo
                                init={selectedOption2}

                                onSelect={handleSelectChange2}
                                label=""
                                options={[
                                    { value: "Tất cả", label: "Tất cả" },
                                    { value: "1", label: "Thành công" },
                                    { value: "0", label: "Thất bại" },
                                ]}
                            />
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
                                <th className="border border-stroke dark:border-strokedark p-3 text-left font-medium text-black dark:text-white">Mã thông báo</th>
                                <th className="border border-stroke dark:border-strokedark p-3 text-left font-medium text-black dark:text-white">API</th>
                                <th className="border border-stroke dark:border-strokedark p-3 text-left font-medium text-black dark:text-white">Mô tả</th>
                                <th className="border border-stroke dark:border-strokedark p-3 text-left font-medium text-black dark:text-white">Phần mềm</th>
                                <th className="border border-stroke dark:border-strokedark p-3 text-left font-medium text-black dark:text-white">Thông báo</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data?.hits?.hits?.map((brand, index) => (
                                <tr key={index} className={`${index % 2 === 0 ? 'bg-white dark:bg-gray-800' : 'bg-gray-50 dark:bg-gray-900'}`}>
                                    <td className="border border-stroke dark:border-strokedark p-3 text-black dark:text-white text-center">
                                        {page * itemsPerPage + index + 1}
                                    </td>
                                    <td className="border border-stroke dark:border-strokedark p-3 text-gray-500 dark:text-gray-400 italic">
                                        {formatTimestampToDate(brand?._source.date_created)}
                                    </td>
                                    <td className={`border border-stroke dark:border-strokedark p-3 font-medium text-center ${getStatusStyles(brand?._source?.http_status_code)}`}>
                                        {brand?._source?.http_status_code}
                                    </td>
                                    <td className="border border-stroke dark:border-strokedark p-3 font-medium text-orange-400 dark:text-orange-400">
                                        {brand?._source?.application_name}
                                    </td>
                                    <td className="border border-stroke dark:border-strokedark p-3 text-black dark:text-white" style={{ fontFamily: "sans-serif" }}>
                                        {getDatabaseDescription(brand?._source?.api)}
                                    </td>

                                    <td className="border border-stroke dark:border-strokedark p-3 font-medium text-blue-600 dark:text-blue-400">
                                        {brand?._source?.api} - {brand?._source.am_key_type}
                                    </td>

                                    <td className="border border-stroke dark:border-strokedark p-3 font-medium text-green-600 dark:text-green-600">
                                        {brand?._source?.error_message != "null" && brand?._source?.error_message}
                                    </td>

                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>


                {/* Sử dụng ReactPaginate để tạo điều khiển phân trang */}
                <div className="mb-10 mt-4 flex justify-center gap-2">
                    <ReactPaginate
                        previousLabel={"Trang trước"}
                        nextLabel={"Trang sau"}
                        breakLabel={"..."}
                        breakClassName={"break-me"}
                        pageCount={totalPages} // Tổng số trang
                        marginPagesDisplayed={2} // Số trang hiển thị ở đầu và cuối
                        pageRangeDisplayed={5} // Số trang hiển thị xung quanh trang hiện tại
                        onPageChange={handlePageChange} // Hàm xử lý khi trang thay đổi
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

export default DetailServicesRes;
