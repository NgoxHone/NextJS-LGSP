"use client";
import React, { useEffect, useState } from "react";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { FaSearch, FaSignInAlt, FaSignOutAlt } from "react-icons/fa";
import SignIn from "../auth/signin/page";
import { useRecoilState } from "recoil";
import { accessTokenState } from "../../../utilities/Atom/atom";

const columns = [
    { key: "STT", label: "STT" },
    { key: "OPERATION", label: "Trạng thái" },
    { key: "SUBJECT", label: "Người dùng" },
    { key: "APP_NAME", label: "Tên ứng dụng" },
    { key: "SESSION_START_TIME", label: "Thời gian thực hiện" },
    { key: "DETAIL", label: "Chi tiết" },
    // { key: "EXPIRY_TIME", label: "Hết hạn" },
];

const SsoLoginsPage = () => {
    const [accessToken] = useRecoilState(accessTokenState);
    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [search, setSearch] = useState("");
    const [operationFilter, setOperationFilter] = useState<string>("all");

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

    const filteredData = data.filter((row: any) => {
        const matchSearch = row.SUBJECT?.toLowerCase().includes(search.toLowerCase()) ||
            row.APP_NAME?.toLowerCase().includes(search.toLowerCase());
        const matchOperation =
            operationFilter === "all" ||
            (operationFilter === "login" && row.OPERATION === "STORE") ||
            (operationFilter === "logout" && row.OPERATION === "DELETE");
        return matchSearch && matchOperation;
    });

    // Hàm format thời gian từ số sang ngày giờ
    function formatTime(ts: string) {
        if (!ts) return "";
        let t = Number(ts);
        if (isNaN(t)) return ts;
        // Nếu là microseconds (dài hơn 13 số), chia cho 1000
        if (t > 1e15) t = Math.floor(t / 1000000);
        else if (t > 1e12) t = Math.floor(t / 1000);
        const d = new Date(t);
        if (isNaN(d.getTime())) return ts;
        return d.toLocaleString("vi-VN");
    }

    function renderDetailCell(detail: any[]) {
        if (!Array.isArray(detail)) return <span className="text-gray-400 italic">(trống)</span>;
        const getVal = (type: string) => detail.find((d) => d.PROPERTY_TYPE === type)?.PROPERTY_VALUE;
        const loginTime = getVal("Login Time");
        const lastAccessTime = getVal("Last Access Time");
        const userAgent = getVal("User Agent");
        const ip = getVal("IP");
        return (
            <div className="text-xs text-gray-700 dark:text-gray-200">
                {/* <div><b>Login Time:</b> {loginTime ? formatTime(loginTime) : <span className="text-gray-400 italic">(trống)</span>}</div> */}
                <div><b>IP:</b> {ip || <span className="text-gray-400 italic">(trống)</span>}</div>
                <div className="break-words whitespace-pre-line max-w-xs">{userAgent}</div>
                {/* <div><b>Last Access Time:</b> {lastAccessTime ? formatTime(lastAccessTime) : <span className="text-gray-400 italic">(trống)</span>}</div> */}
            </div>
        );
    }

    return (
        <>

            {!accessToken ? (
                <SignIn />
            ) : (

                <DefaultLayout>
                    <Breadcrumb pageName="Thống kê login SSO" />
                    <div className="rounded-sm border border-stroke bg-white px-5 pb-2.5 pt-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1 mt-6">
                        <h2 className="text-xl font-semibold mb-4 text-black dark:text-white">Thống kê login SSO</h2>
                        <div className="mb-4 flex flex-col sm:flex-row sm:items-center gap-2">
                            <div className="relative w-full max-w-xs">
                                <input
                                    type="text"
                                    className="w-full rounded border border-stroke px-4 py-2 pl-10 text-sm focus:border-primary focus:outline-none dark:bg-boxdark dark:text-white"
                                    placeholder="Tìm kiếm theo người dùng hoặc tên ứng dụng..."
                                    value={search}
                                    onChange={e => setSearch(e.target.value)}
                                />
                                <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            </div>
                            <div>
                                <select
                                    className="rounded border border-stroke px-3 py-2 text-sm focus:border-primary focus:outline-none dark:bg-boxdark dark:text-white"
                                    value={operationFilter}
                                    onChange={e => setOperationFilter(e.target.value)}
                                >
                                    <option value="all">Tất cả</option>
                                    <option value="login">Đăng nhập</option>
                                    <option value="logout">Đăng xuất</option>
                                </select>
                            </div>
                        </div>
                        {loading && <p>Đang tải dữ liệu...</p>}
                        {error && <p style={{ color: 'red' }}>{error}</p>}
                        <div className="max-w-full overflow-x-auto">
                            <table className="w-full table-auto">
                                <thead>
                                    <tr className="bg-gray-2 text-left dark:bg-meta-4">
                                        {columns.map(col => (
                                            <th key={col.key} className="px-4 py-4 font-medium text-black dark:text-white whitespace-nowrap">{col.label}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredData.map((row, idx) => (
                                        <tr key={idx} className="border-b border-[#eee] dark:border-strokedark">
                                            <td className="px-4 py-4 whitespace-nowrap">{idx + 1}</td>
                                            <td className="px-4 py-4 whitespace-nowrap">
                                                {row.OPERATION === "STORE" ? (
                                                    <span className="inline-flex items-center text-green-600 font-semibold"><FaSignInAlt className="mr-1" /> Đăng nhập</span>
                                                ) : row.OPERATION === "DELETE" ? (
                                                    <span className="inline-flex items-center text-red-600 font-semibold"><FaSignOutAlt className="mr-1" /> Đăng xuất</span>
                                                ) : (
                                                    <span className="text-gray-400 italic">{row.OPERATION}</span>
                                                )}
                                            </td>
                                            <td className="px-4 py-4 whitespace-nowrap">{row.SUBJECT || <span className="text-gray-400 italic">(trống)</span>}</td>
                                            <td className="px-4 py-4 whitespace-nowrap">{row.APP_NAME || <span className="text-gray-400 italic">(trống)</span>}</td>
                                            <td className="px-4 py-4 whitespace-nowrap">{formatTime(row.SESSION_START_TIME)}</td>
                                            <td className="px-4 py-4 whitespace-nowrap">{renderDetailCell(row.detail)}</td>
                                            {/* <td className="px-4 py-4 whitespace-nowrap">{formatTime(row.EXPIRY_TIME)}</td> */}

                                        </tr>
                                    ))}
                                    {(!filteredData || filteredData.length === 0) && !loading && (
                                        <tr>
                                            <td colSpan={columns.length} className="px-4 py-4 text-center text-gray-500">Không có dữ liệu</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </DefaultLayout>)}
        </>
    );
};

export default SsoLoginsPage; 