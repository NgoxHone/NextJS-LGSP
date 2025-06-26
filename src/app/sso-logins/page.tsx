"use client";
import React, { useEffect, useState, useMemo } from "react";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { FaSearch, FaSignInAlt, FaSignOutAlt, FaFilter, FaChartBar, FaUsers, FaGlobe, FaClock } from "react-icons/fa";
import SignIn from "../auth/signin/page";
import { useRecoilState } from "recoil";
import { accessTokenState } from "../../../utilities/Atom/atom";
import ChartThree from "@/components/Charts/ChartThree";
import ReactPaginate from "react-paginate";
import Table from '@/components/CommonTable/Table';
import { TableColumn, DropdownOption } from '@/components/CommonTable/types';
import { TableApiResponse } from '@/components/CommonTable/types';
import { TableCustom } from '@/components/CommonTable/Table';

const ITEMS_PER_PAGE = 10;

const SsoLoginsPage = () => {
    const [accessToken] = useRecoilState(accessTokenState);
    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [search, setSearch] = useState("");
    const [operationFilter, setOperationFilter] = useState<string>("all");
    const [currentPage, setCurrentPage] = useState(0);
    const [selectedApp, setSelectedApp] = useState<string>("all");
    const [fromDate, setFromDate] = useState<string>("");
    const [toDate, setToDate] = useState<string>("");

    // State cho table custom
    const [tablePage, setTablePage] = useState(0);
    const [tablePageSize, setTablePageSize] = useState(10);
    const [tableSearch, setTableSearch] = useState("");
    const [tableDropdown, setTableDropdown] = useState("all");

    useEffect(() => {
        setLoading(true);
        fetch("/api/getSsoLogins")
            .then((res) => {
                if (!res.ok) throw new Error("Lỗi khi lấy dữ liệu SSO");
                return res.json();
            })
            .then((data) => {
                setData(data);
                setError(null);
            })
            .catch((err) => setError(err.message))
            .finally(() => setLoading(false));
    }, []);

    // Lấy danh sách ứng dụng duy nhất
    const appOptions = useMemo(() => {
        const apps = Array.from(new Set(data.map(r => r.APP_NAME).filter(Boolean)));
        return ["all", ...apps];
    }, [data]);

    // Lọc dữ liệu theo search và dropdown trạng thái
    const filteredData = data.filter((row: any) => {
        const matchSearch = row.SUBJECT?.toLowerCase().includes(tableSearch.toLowerCase()) ||
            row.APP_NAME?.toLowerCase().includes(tableSearch.toLowerCase());
        const matchOperation =
            tableDropdown === "all" ||
            (tableDropdown === "login" && row.OPERATION === "STORE") ||
            (tableDropdown === "logout" && row.OPERATION === "DELETE");
        const matchApp = selectedApp === "all" || row.APP_NAME === selectedApp;
        // Chuẩn hóa SESSION_START_TIME
        let sessionTime = Number(row.SESSION_START_TIME);
        if (sessionTime > 1e15) sessionTime = Math.floor(sessionTime / 1_000_000);
        else if (sessionTime > 1e12) sessionTime = Math.floor(sessionTime / 1_000);
        let matchDate = true;
        if (fromDate) {
            const fromTs = new Date(fromDate + 'T00:00:00').getTime();
            matchDate = matchDate && sessionTime >= fromTs;
        }
        if (toDate) {
            const toTs = new Date(toDate + 'T23:59:59').getTime();
            matchDate = matchDate && sessionTime <= toTs;
        }
        return matchSearch && matchOperation && matchApp && matchDate;
    });
    const pageCount = Math.ceil(filteredData.length / tablePageSize);
    const currentItems = filteredData.slice(
        tablePage * tablePageSize,
        (tablePage + 1) * tablePageSize
    );
    useEffect(() => {
        setTablePage(0);
    }, [tableSearch, tableDropdown, selectedApp, fromDate, toDate, tablePageSize]);

    // Thống kê
    const loginCount = filteredData.filter((r) => r.OPERATION === "STORE").length;
    const logoutCount = filteredData.filter((r) => r.OPERATION === "DELETE").length;
    const totalUsers = new Set(filteredData.map(r => r.SUBJECT)).size;
    const totalApps = new Set(filteredData.map(r => r.APP_NAME)).size;

    const chartData = [
        { key: "Đăng nhập", doc_count: loginCount },
        { key: "Đăng xuất", doc_count: logoutCount },
    ];

    function formatTime(ts: string) {
        if (!ts) return "";
        let t = Number(ts);
        if (isNaN(t)) return ts;
        if (t > 1e15) t = Math.floor(t / 1000000);
        else if (t > 1e12) t = Math.floor(t / 1000);
        const d = new Date(t);
        if (isNaN(d.getTime())) return ts;
        return d.toLocaleString("vi-VN", {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    function renderDetailCell(detail: any[]) {
        if (!Array.isArray(detail)) return <span className="text-gray-400 text-sm">(N/A)</span>;
        const getVal = (type: string) => detail.find((d) => d.PROPERTY_TYPE === type)?.PROPERTY_VALUE;
        const ip = getVal("IP");
        const userAgent = getVal("User Agent");

        return (
            <div className="space-y-1">
                <div className="text-sm font-medium text-gray-900 dark:text-white">
                    {ip || <span className="text-gray-400">(N/A)</span>}
                </div>
                {userAgent && (
                    <div className="text-xs text-gray-500 dark:text-gray-400 max-w-xs truncate font-bold">
                        {userAgent}
                    </div>
                )}
            </div>
        );
    }

    const columns: TableColumn<any>[] = [
        {
            field: 'SUBJECT',
            title: 'Người dùng',
            render: (row: any) => (
                <div className="flex items-center">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold text-sm">
                        {row.SUBJECT?.charAt(0)?.toUpperCase() || 'U'}
                    </div>
                    <div className="ml-3">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">{row.SUBJECT || 'Unknown'}</div>
                    </div>
                </div>
            ),
        },
        {
            field: 'APP_NAME',
            title: 'Ứng dụng',
            render: (row: any) => <div className="text-sm text-gray-900 dark:text-white">{row.APP_NAME || 'N/A'}</div>,
        },
        {
            field: 'OPERATION',
            title: 'Trạng thái',
            render: (row: any) => row.OPERATION === 'STORE' ? (
                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-1.5"></div>
                    Đăng nhập
                </span>
            ) : (
                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-500 dark:bg-gray-700/20 dark:text-gray-400">
                    <div className="w-2 h-2 bg-gray-400 rounded-full mr-1.5"></div>
                    Đăng xuất
                </span>
            ),
        },
        {
            field: 'SESSION_START_TIME',
            title: 'Thời gian',
            render: (row: any) => <div className="text-sm text-gray-900 dark:text-white">{formatTime(row.SESSION_START_TIME)}</div>,
        },
    ];

    const dropdownOptions: DropdownOption[] = [
        { label: 'Tất cả', value: 'all' },
        { label: 'Đăng nhập', value: 'login' },
        { label: 'Đăng xuất', value: 'logout' },
    ];

    const api = async ({ search = '', page, pageSize, filter }: { search?: string; page: number; pageSize: number; filter?: any }): Promise<TableApiResponse<any>> => {
        const res = await fetch('/api/getSsoLogins');
        const allData = await res.json();
        const filtered = allData.filter((row: any) => {
            const matchSearch = row.SUBJECT?.toLowerCase().includes((search || '').toLowerCase()) ||
                row.APP_NAME?.toLowerCase().includes((search || '').toLowerCase());
            const matchOperation =
                filter === 'all' ||
                (filter === 'login' && row.OPERATION === 'STORE') ||
                (filter === 'logout' && row.OPERATION === 'DELETE');
            return matchSearch && matchOperation;
        });
        return {
            data: filtered.slice((page - 1) * pageSize, page * pageSize),
            total: filtered.length,
        };
    };

    return (
        <>
            {!accessToken ? (
                <SignIn />
            ) : (
                <DefaultLayout>
                    <div className="min-h-screen from-slate-50 to-blue-50 dark:from-gray-900 dark:to-slate-900">
                        {/* Main Content Grid */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {/* Login Activities Table */}
                            <div className="lg:col-span-2">
                                <div style={{ marginBottom: 30 }} className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm">
                                    <div className="mb-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div>
                                            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Ứng dụng</label>
                                            <select
                                                className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-sm focus:outline-none"
                                                value={selectedApp}
                                                onChange={e => setSelectedApp(e.target.value)}
                                            >
                                                {appOptions.map(app => (
                                                    <option key={app} value={app}>{app === "all" ? "Tất cả" : app}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Từ ngày</label>
                                            <input
                                                type="date"
                                                className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-sm focus:outline-none"
                                                value={fromDate}
                                                onChange={e => setFromDate(e.target.value)}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Đến ngày</label>
                                            <input
                                                type="date"
                                                className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-sm focus:outline-none"
                                                value={toDate}
                                                onChange={e => setToDate(e.target.value)}
                                            />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                                        <div className="flex flex-col items-center bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 shadow">
                                            <FaSignInAlt className="text-blue-600 dark:text-blue-400 text-2xl mb-1" />
                                            <span className="text-lg font-bold text-blue-700 dark:text-blue-300">{loginCount}</span>
                                            <span className="text-xs text-gray-500 mt-1">Đăng nhập</span>
                                        </div>
                                        <div style={{ backgroundColor: '#fafafa' }} className="flex flex-col items-center bg-gray-50 dark:bg-gray-700/20 rounded-xl p-4 shadow">
                                            <FaSignOutAlt className="text-gray-600 dark:text-gray-300 text-2xl mb-1" />
                                            <span className="text-lg font-bold text-gray-700 dark:text-gray-200">{logoutCount}</span>
                                            <span className="text-xs text-gray-500 mt-1">Đăng xuất</span>
                                        </div>
                                        <div className="flex flex-col items-center bg-green-50 dark:bg-green-900/20 rounded-xl p-4 shadow">
                                            <FaUsers className="text-green-600 dark:text-green-400 text-2xl mb-1" />
                                            <span className="text-lg font-bold text-green-700 dark:text-green-300">{totalUsers}</span>
                                            <span className="text-xs text-gray-500 mt-1">Người dùng</span>
                                        </div>
                                        <div className="flex flex-col items-center bg-purple-50 dark:bg-purple-900/20 rounded-xl p-4 shadow">
                                            <FaGlobe className="text-purple-600 dark:text-purple-400 text-2xl mb-1" />
                                            <span className="text-lg font-bold text-purple-700 dark:text-purple-300">{totalApps}</span>
                                            <span className="text-xs text-gray-500 mt-1">Ứng dụng</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm">
                                    <div className="p-6">
                                        <TableCustom
                                            columns={columns}
                                            data={currentItems}
                                            total={filteredData.length}
                                            page={tablePage}
                                            pageSize={tablePageSize}
                                            pageSizeOptions={[10, 20, 50]}
                                            search={tableSearch}
                                            onSearch={setTableSearch}
                                            dropdownOptions={dropdownOptions}
                                            dropdownValue={tableDropdown}
                                            onDropdownChange={setTableDropdown}
                                            filterLabel="Trạng thái"
                                            onPageChange={setTablePage}
                                            onPageSizeChange={setTablePageSize}
                                            
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Right Sidebar */}
                            <div className="space-y-6">
                                {/* Chart */}
                                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm">
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                            Thống kê
                                        </h3>
                                        <button className="text-gray-400 hover:text-gray-600">
                                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                                <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                                            </svg>
                                        </button>
                                    </div>
                                    <ChartThree data={chartData} title="" />
                                </div>

                                {/* Bộ lọc và số liệu đăng nhập/đăng xuất */}


                                {/* Recent Activity */}
                                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm">
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                            Hoạt động gần đây
                                        </h3>
                                    </div>
                                    <div className="space-y-4">
                                        {currentItems.slice(0, 5).map((item, idx) => (
                                            <div key={idx} className="flex items-start space-x-3">
                                                <div className={`flex-shrink-0 w-2 h-2 rounded-full mt-2 ${item.OPERATION === 'STORE' ? 'bg-green-500' : 'bg-red-500'
                                                    }`}></div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm text-gray-900 dark:text-white">
                                                        <span className="font-medium">{item.SUBJECT}</span>
                                                        {' '}
                                                        {item.OPERATION === 'STORE' ? 'đăng nhập' : 'đăng xuất'}
                                                        {' '}
                                                        <span className="text-gray-500">{item.APP_NAME}</span>
                                                    </p>
                                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                                        {formatTime(item.SESSION_START_TIME)}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </DefaultLayout>
            )}
        </>
    );
};

export default SsoLoginsPage;