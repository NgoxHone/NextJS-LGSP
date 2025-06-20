"use client";

import React, { useEffect, useState, useMemo } from "react";
import dynamic from "next/dynamic";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { useRecoilState } from "recoil";
import { accessTokenState } from "../../../../utilities/Atom/atom";
import ReactPaginate from "react-paginate";
import { FaSort, FaSortUp, FaSortDown, FaSearch } from "react-icons/fa";
import { useSearchParams } from "next/navigation";
import dayjs from "dayjs";

const SignIn = dynamic(() => import("../../auth/signin/page"), { ssr: false });
const DefaultLayout = dynamic(
    () => import("@/components/Layouts/DefaultLayout"),
    { ssr: false },
);

const ITEMS_PER_PAGE = 100;

function formatDateTime(mysqlDate: string) {
    if (!mysqlDate) return '';
    const date = new Date(mysqlDate.replace(' ', 'T'));
    if (isNaN(date.getTime())) return mysqlDate;
    const pad = (n: number) => n.toString().padStart(2, '0');
    return `${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())} ${pad(date.getDate())}/${pad(date.getMonth() + 1)}/${date.getFullYear()}`;
}

const Tag = ({ children }: { children: React.ReactNode }) => (
    <span className="inline-block bg-blue-100 text-blue-700 text-xs font-semibold rounded-full px-3 py-1 mr-2 mb-1 dark:bg-blue-900 dark:text-blue-200">
        {children}
    </span>
);

const ServiceDetailPage = () => {
    const [accessToken] = useRecoilState(accessTokenState);
    const [apis, setApis] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [search, setSearch] = useState("");
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc' | null>(null);
    const [currentPage, setCurrentPage] = useState(0);
    const searchParams = useSearchParams();
    const [fromDate, setFromDate] = useState<string>("");
    const [toDate, setToDate] = useState<string>("");
    console.log(apis)
    useEffect(() => {
        if (accessToken) {
            setLoading(true);
            fetch("/api/getApis")
                .then((res) => {
                    if (!res.ok) throw new Error("Lỗi khi lấy dữ liệu API");
                    return res.json();
                })
                .then((data) => {
                    setApis(data);
                    setError(null);
                })
                .catch((err) => {
                    setError(err.message);
                })
                .finally(() => setLoading(false));
        }
    }, [accessToken]);

    useEffect(() => {
        const searchValue = searchParams?.get("search") || "";
        if (searchValue) setSearch(searchValue);
    }, [searchParams]);

    const filteredAndSortedApis = useMemo(() => {
        let filtered = apis.filter((api: any) =>
        (api.API_NAME?.toLowerCase().includes(search.toLowerCase()) ||
            api.CONTEXT?.toLowerCase().includes(search.toLowerCase()))
        );
        // Lọc theo ngày
        if (fromDate) {
            filtered = filtered.filter((api: any) => {
                const d = dayjs(api.API_CREATED_TIME);
                return d.isAfter(dayjs(fromDate).startOf('day').subtract(1, 'second'));
            });
        }
        if (toDate) {
            filtered = filtered.filter((api: any) => {
                const d = dayjs(api.API_CREATED_TIME);
                return d.isBefore(dayjs(toDate).endOf('day').add(1, 'second'));
            });
        }
        if (sortOrder) {
            filtered = filtered.sort((a: any, b: any) => {
                const dateA = new Date(a.API_CREATED_TIME);
                const dateB = new Date(b.API_CREATED_TIME);
                if (sortOrder === 'asc') return dateA.getTime() - dateB.getTime();
                return dateB.getTime() - dateA.getTime();
            });
        }
        return filtered;
    }, [apis, search, sortOrder, fromDate, toDate]);

    const pageCount = Math.ceil(filteredAndSortedApis.length / ITEMS_PER_PAGE);
    const currentItems = filteredAndSortedApis.slice(
        currentPage * ITEMS_PER_PAGE,
        (currentPage + 1) * ITEMS_PER_PAGE
    );

    const handlePageClick = (selectedItem: { selected: number }) => {
        setCurrentPage(selectedItem.selected);
    };

    const handleSortClick = () => {
        setSortOrder((prev) => {
            if (prev === 'asc') return 'desc';
            if (prev === 'desc') return null;
            return 'asc';
        });
    };

    // Reset page khi search hoặc sort
    useEffect(() => {
        setCurrentPage(0);
    }, [search, sortOrder]);

    return (
        <>
            {!accessToken ? (
                <SignIn />
            ) : (
                <DefaultLayout>
                    <Breadcrumb pageName="Chi tiết dịch vụ" />
                    <div className="rounded-sm border border-stroke bg-white px-5 pb-2.5 pt-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1 mt-6">
                        {/* <h2 className="text-xl font-semibold mb-4 text-black dark:text-white">Danh sách API</h2> */}
                        <div className="mb-4 flex flex-col sm:flex-row sm:items-center gap-2">
                            <div className="relative w-full max-w-xs">
                                <input
                                    type="text"
                                    className="w-full rounded border border-stroke px-4 py-2 pl-10 text-sm focus:border-primary focus:outline-none dark:bg-boxdark dark:text-white"
                                    placeholder="Tìm kiếm theo tên dịch vụ hoặc context..."
                                    value={search}
                                    onChange={e => setSearch(e.target.value)}
                                />
                                <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            </div>
                            <div className="flex gap-2 items-center">
                                <label className="text-sm text-gray-600 dark:text-gray-300">Từ ngày</label>
                                <input
                                    type="date"
                                    className="rounded border border-stroke px-2 py-1 text-sm focus:border-primary focus:outline-none dark:bg-boxdark dark:text-white"
                                    value={fromDate}
                                    onChange={e => setFromDate(e.target.value)}
                                    max={toDate || undefined}
                                />
                                <label className="text-sm text-gray-600 dark:text-gray-300">Đến ngày</label>
                                <input
                                    type="date"
                                    className="rounded border border-stroke px-2 py-1 text-sm focus:border-primary focus:outline-none dark:bg-boxdark dark:text-white"
                                    value={toDate}
                                    onChange={e => setToDate(e.target.value)}
                                    min={fromDate || undefined}
                                />
                            </div>
                        </div>
                        {loading && <p style={{ marginBottom: 10 }}>Đang tải dữ liệu...</p>}
                        {error && <p style={{ color: 'red' }}>{error}</p>}
                        <div className="max-w-full overflow-x-auto">
                            <table className="w-full table-auto">
                                <thead>
                                    <tr className="bg-gray-2 text-left dark:bg-meta-4">
                                        <th className="min-w-[40px] px-4 py-4 font-medium text-black dark:text-white">STT</th>
                                        <th className="min-w-[220px] px-4 py-4 font-medium text-black dark:text-white">Tên dịch vụ</th>
                                        <th className="min-w-[180px] px-4 py-4 font-medium text-black dark:text-white">Context</th>
                                        <th className="min-w-[180px] px-4 py-4 font-medium text-black dark:text-white cursor-pointer select-none" onClick={handleSortClick}>
                                            Thời gian tạo
                                            <span className="inline-block ml-2 align-middle">
                                                {sortOrder === null && <FaSort className="inline" />}
                                                {sortOrder === 'asc' && <FaSortUp className="inline" />}
                                                {sortOrder === 'desc' && <FaSortDown className="inline" />}
                                            </span>
                                        </th>
                                        <th className="min-w-[220px] px-4 py-4 font-medium text-black dark:text-white">Phần mềm</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {currentItems.map((api, idx) => {

                                        return (
                                            <tr key={idx} className="border-b border-[#eee] dark:border-strokedark">
                                                <td className="px-4 py-4">{currentPage * ITEMS_PER_PAGE + idx + 1}</td>
                                                <td className="px-4 py-4 font-semibold text-black dark:text-white">{api.API_NAME}</td>
                                                <td className="px-4 py-4">{api.CONTEXT}</td>
                                                <td className="px-4 py-4">{formatDateTime(api.API_CREATED_TIME)}</td>
                                                <td className="px-4 py-4">
                                                    {Array.isArray(api.APPLICATION_NAMES) && api.APPLICATION_NAMES.length > 0 ? (
                                                        <div className="flex flex-wrap">
                                                            {api.APPLICATION_NAMES.map((name: string, i: number) => {
                                                                return (
                                                                    <Tag key={i}>{name}</Tag>
                                                                )
                                                            })}
                                                        </div>
                                                    ) : (
                                                        <span className="text-gray-400 italic">Không có</span>
                                                    )}
                                                </td>
                                            </tr>
                                        )
                                    })}
                                    {(!currentItems || currentItems.length === 0) && !loading && (
                                        <tr>
                                            <td colSpan={5} className="px-4 py-4 text-center text-gray-500">Không có dữ liệu</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                        {/* <div className="flex justify-center mt-6">
              <ReactPaginate
                previousLabel={"<"}
                nextLabel={">"}
                breakLabel={"..."}
                pageCount={pageCount}
                marginPagesDisplayed={2}
                pageRangeDisplayed={3}
                onPageChange={handlePageClick}
                containerClassName={"flex items-center space-x-2"}
                pageClassName={"px-3 py-1 rounded border border-gray-300 dark:border-strokedark cursor-pointer"}
                activeClassName={"bg-primary text-white border-primary"}
                previousClassName={"px-3 py-1 rounded border border-gray-300 dark:border-strokedark cursor-pointer"}
                nextClassName={"px-3 py-1 rounded border border-gray-300 dark:border-strokedark cursor-pointer"}
                disabledClassName={"opacity-50 cursor-not-allowed"}
                forcePage={currentPage}
              />
            </div> */}
                    </div>
                </DefaultLayout>
            )}
        </>
    );
};

export default ServiceDetailPage; 