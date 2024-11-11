import React, { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import ReactPaginate from "react-paginate"; // Import thư viện phân trang
import { optionEnviroment, optionService } from "../../../utilities/Atom/atom";
import axios from "axios";
import SelectGroupTwo from "../SelectGroup/SelectGroupTwo";
import { bodyLog } from "./body";
import { convertDateToMilliseconds, formatTimestampToDate, getDatabaseDescription, getStatusStyles } from "../../../utilities/GlobalFunction";
import { dataOption, dataOptionApp } from "../Chat/body";

const DetailServicesRes: React.FC = () => {
    const [optionData, setOptionData] = useRecoilState(optionService);
    const [optionDataApp, setOptionDataApp] = useState([]);
    const [selectedOption, setSelectedOption] = useState("Tất cả");
    const [selectedOption2, setSelectedOption2] = useState("Tất cả");
    const [selectedOptionApp, setSelectedOptionApp] = useState("Tất cả");
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [data, setData] = useState([]);
    const [selectedEnv] = useRecoilState(optionEnviroment);
    const [totalItems, setTotalItems] = useState(0); // Tổng số item
    const [page, setPage] = useState(0); // Trang hiện tại
    const itemsPerPage = 30; // Số lượng bản ghi mỗi trang

    const totalPages = Math.ceil(totalItems / itemsPerPage); // Tổng số trang

    const handleDateChange = (e, setDate) => {
        setDate(e.target.value);
    };
    const handleSelectChange = (value: string) => {
        setSelectedOption(value);
    };
    const handleSelectChange2 = (value: string) => {
        setSelectedOption2(value);
    };
    const handleSelectAppChange = (value: string) => {
        setSelectedOptionApp(value);
    };
    // const handlePageChange = (newPage: number) => {
    //     setPage(newPage);
    // };
    const getStatusStyles = (statusCode) => {
        switch (true) {
            case statusCode >= 200 && statusCode < 300:
                return "bg-green-500 text-white border-green-700"; // Thành công
            case statusCode >= 300 && statusCode < 400:
                return "bg-blue-500 text-white border-blue-700"; // Điều hướng
            case statusCode >= 400 && statusCode < 500:
                return "bg-yellow-500 text-white border-yellow-700"; // Lỗi client
            case statusCode >= 500:
                return "bg-red-500 text-white border-red-700"; // Lỗi server
            default:
                return "bg-gray-500 text-white border-gray-700"; // Không xác định
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
                    selectedOption2
                ),
            });
            const dataRes = response.data;

            setData(dataRes);
            setTotalItems(dataRes.hits.total.value); // Lưu tổng số item
        } catch (error) {
            console.error("Error fetching documents:", error);
        }
    };

    useEffect(() => {
        fetchData();
    }, [
        selectedOption,
        selectedEnv,
        selectedOptionApp,
        startDate,
        endDate,
        page,
        selectedOption2,
    ]);

    // Xử lý thay đổi trang
    const handlePageChange = (selectedItem) => {
        setPage(selectedItem.selected); // Cập nhật trang dựa vào chỉ số trang được chọn
    };

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
                <div className="flex flex-col w-full">
                    {data?.hits?.hits?.map((brand, index) => (
                        <div
                            className={` ${index === data?.hits?.hits?.length - 1
                                ? ""
                                : "border-b border-stroke dark:border-strokedark"
                                }`}
                            key={index}
                        >
                            <div className="flex items-center gap-1 p-2.5 xl:p-5">
                                <p className="hidden items-start font-medium text-black dark:text-white sm:block">
                                    {/* Tính số thứ tự dựa trên trang và vị trí hiện tại */}
                                    {page * itemsPerPage + index + 1}.
                                </p>
                                <div className="items-center p-2.5 xl:p-5">
                                    <p
                                        style={{
                                            color: "gray",
                                            fontWeight: "bold",
                                            flexDirection: "row",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "space-between",
                                            marginBottom: 5,
                                        }}
                                    >
                                        <span
                                            style={{ textAlign: "right", fontStyle: "italic" }}
                                            className="text-gray-200 dark:text-gray-400 text-sm"
                                        >
                                            {formatTimestampToDate(brand?._source.date_created)}
                                        </span>
                                        <p
                                            style={{
                                                borderWidth: 0,
                                                paddingTop: 3,
                                                paddingBottom: 3,
                                                fontWeight: "bold",
                                                // backgroundColor: 'red'
                                            }}
                                            className={`font-medium ml-3 p-2 border rounded ${getStatusStyles(
                                                brand?._source?.http_status_code
                                            )}`}
                                        >
                                            {brand?._source?.http_status_code}
                                        </p>
                                    </p>
                                    <p style={{ fontFamily: "sans-serif" }}>
                                        {getDatabaseDescription(brand?._source?.api)}
                                    </p>
                                    <p className="font-medium text-blue-600 dark:text-blue-400">
                                        {brand?._source?.api} - {brand?._source.am_key_type}
                                    </p>
                                    <p className="font-medium text-green-600 dark:text-green-600">
                                        {brand?._source?.full_request_path}
                                    </p>
                                    <p className="font-medium text-orange-400 dark:text-orange-400">
                                        {brand?._source?.application_name}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Sử dụng ReactPaginate để tạo điều khiển phân trang */}
                <div className="mt-4 flex justify-center gap-2 mb-10">
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
                    />
                </div>
            </div>
        </div>
    );
};

export default DetailServicesRes;
