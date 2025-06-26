import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import ReactPaginate from 'react-paginate';
import Dropdown from './Dropdown';
import { TableProps, TableApiResponse, TableColumn, DropdownOption } from './types';

function useDebounce<T>(value: T, delay: number) {
    const [debounced, setDebounced] = useState(value);
    useEffect(() => {
        const handler = setTimeout(() => setDebounced(value), delay);
        return () => clearTimeout(handler);
    }, [value, delay]);
    return debounced;
}

export default function Table<T = any>({
    columns,
    api,
    pageSizeOptions = [10, 20, 50],
    defaultPageSize = 20,
    searchPlaceholder = 'Tìm kiếm...',
    dropdownOptions,
    dropdownRender,
    dropdownOnChange,
    filterLabel = 'Bộ lọc',
}: TableProps<T>) {
    const [data, setData] = useState<T[]>([]);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(0); // react-paginate dùng 0-based
    const [pageSize, setPageSize] = useState(defaultPageSize);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(false);
    const [dropdownValue, setDropdownValue] = useState(dropdownOptions ? dropdownOptions[0]?.value : undefined);

    const debouncedSearch = useDebounce(search, 400);

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const params: any = {
                search: debouncedSearch,
                page: page + 1, // API thường dùng 1-based
                pageSize,
            };
            if (dropdownOptions && dropdownValue !== undefined) {
                params.filter = dropdownValue;
            }
            const res: TableApiResponse<T> = await api(params);
            setData(res.data);
            setTotal(res.total);
        } catch (e) {
            setData([]);
            setTotal(0);
        } finally {
            setLoading(false);
        }
    }, [api, debouncedSearch, page, pageSize, dropdownValue, dropdownOptions]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handlePageChange = (selected: { selected: number }) => setPage(selected.selected);
    const handlePageSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setPageSize(Number(e.target.value));
        setPage(0);
    };
    const handleDropdownChange = (val: any) => {
        setDropdownValue(val);
        setPage(0);
        dropdownOnChange && dropdownOnChange(val);
    };

    return (
        <div className="w-full bg-white rounded-lg shadow-sm">
            {/* Header với filter và search */}
            <div className="p-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex items-center gap-3">
                        {dropdownOptions && (
                            <div className="flex items-center gap-2">
                                <span className="text-sm font-medium text-gray-700 whitespace-nowrap">{filterLabel}:</span>
                                <Dropdown
                                    options={dropdownOptions}
                                    value={dropdownValue}
                                    onChange={val => dropdownOnChange && dropdownOnChange(val)}
                                    renderOption={dropdownRender}
                                />
                            </div>
                        )}
                    </div>
                    <div className="flex items-center gap-2">
                        <input
                            className="w-full sm:w-64 px-3 py-2 text-sm rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 transition-colors border border-gray-300"
                            placeholder={searchPlaceholder}
                            value={search}
                            onChange={e => { setSearch(e.target.value); setPage(0); }}
                        />

                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="min-w-full">
                    <thead className="bg-gray-50">
                        <tr>
                            {columns.map(col => (
                                <th
                                    key={col.field}
                                    className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${col.align ? `text-${col.align}` : ''}`}
                                    style={col.width ? { width: col.width } : {}}
                                >
                                    {col.title}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="bg-white">
                        {loading ? (
                            <tr>
                                <td colSpan={columns.length} className="px-6 py-12 text-center text-sm text-gray-500">
                                    <div className="flex items-center justify-center space-x-2">
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
                                        <span>Đang tải...</span>
                                    </div>
                                </td>
                            </tr>
                        ) : data.length === 0 ? (
                            <tr>
                                <td colSpan={columns.length} className="px-6 py-12 text-center text-sm text-gray-500">
                                    <div className="flex flex-col items-center">
                                        <div className="w-8 h-8 mb-2 text-gray-400">
                                            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                            </svg>
                                        </div>
                                        Không có dữ liệu
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            data.map((row, idx) => (
                                <tr key={idx} className="hover:bg-gray-50 transition-colors">
                                    {columns.map(col => (
                                        <td key={col.field} className={`px-6 py-4 whitespace-nowrap text-sm text-gray-900 ${col.align ? `text-${col.align}` : ''}`}>
                                            {col.render ? col.render(row) : (row as any)[col.field]}
                                        </td>
                                    ))}
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Footer với pagination và page size */}
            <div className="px-4 py-3 bg-gray-50 rounded-b-lg">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    {/* Page size selector */}
                    <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-700">Hiển thị:</span>
                        <select
                            className="px-3 py-1 text-sm rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                            value={pageSize}
                            onChange={handlePageSizeChange}
                        >
                            {pageSizeOptions.map(size => (
                                <option key={size} value={size}>{size} / trang</option>
                            ))}
                        </select>
                    </div>

                    {/* Pagination */}
                    <div className="flex items-center justify-center sm:justify-end">
                        <ReactPaginate
                            previousLabel={'‹'}
                            nextLabel={'›'}
                            breakLabel={'...'}
                            pageCount={Math.ceil(total / pageSize)}
                            marginPagesDisplayed={1}
                            pageRangeDisplayed={3}
                            onPageChange={handlePageChange}
                            forcePage={page}
                            containerClassName="flex items-center space-x-1"
                            pageClassName=""
                            pageLinkClassName="relative inline-flex items-center px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 hover:bg-gray-50 hover:text-gray-700 focus:z-10 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                            activeClassName=""
                            activeLinkClassName="relative inline-flex items-center px-3 py-2 text-sm font-medium text-blue-600 bg-blue-50 border border-blue-500 z-10 hover:bg-blue-100"
                            previousClassName=""
                            previousLinkClassName="relative inline-flex items-center px-2 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-l-md hover:bg-gray-50 hover:text-gray-700 focus:z-10 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                            nextClassName=""
                            nextLinkClassName="relative inline-flex items-center px-2 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-r-md hover:bg-gray-50 hover:text-gray-700 focus:z-10 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                            disabledClassName="opacity-50 cursor-not-allowed"
                            breakClassName=""
                            breakLinkClassName="relative inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300"
                        />
                    </div>

                    {/* Total count */}
                    <div className="flex items-center justify-center sm:justify-end">
                        <span className="text-sm text-gray-700">
                            Tổng: <span className="font-medium">{total.toLocaleString()}</span> bản ghi
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}

// TableCustom: nhận data, total, page, pageSize, onPageChange, onSearch, onDropdownChange từ props ngoài
export function TableCustom<T = any>({
    columns,
    data,
    total,
    page,
    pageSize,
    pageSizeOptions = [10, 20, 50],
    search = '',
    onSearch,
    dropdownOptions,
    dropdownValue,
    onDropdownChange,
    filterLabel = 'Bộ lọc',
    onPageChange,
    onPageSizeChange,
    loading = false,
    searchPlaceholder = 'Tìm kiếm...'
}: {
    columns: TableColumn<T>[];
    data: T[];
    total: number;
    page: number;
    pageSize: number;
    pageSizeOptions?: number[];
    search?: string;
    onSearch?: (val: string) => void;
    dropdownOptions?: DropdownOption[];
    dropdownValue?: any;
    onDropdownChange?: (val: any) => void;
    filterLabel?: string;
    onPageChange?: (page: number) => void;
    onPageSizeChange?: (size: number) => void;
    loading?: boolean;
    searchPlaceholder?: string;
}) {
    return (
        <div className="w-full bg-white rounded-lg shadow-sm">
            {/* Header với filter và search */}
            <div className="p-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex items-center gap-3">
                        {dropdownOptions && (
                            <div className="flex items-center gap-2">
                                <span className="text-sm font-medium text-gray-700 whitespace-nowrap">{filterLabel}:</span>
                                <Dropdown
                                    options={dropdownOptions}
                                    value={dropdownValue}
                                    onChange={val => onDropdownChange && onDropdownChange(val)}
                                />
                            </div>
                        )}
                    </div>
                    <div className="flex items-center gap-2">
                        <input
                            className="w-full sm:w-64 px-3 py-2 text-sm rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 transition-colors border border-gray-300"
                            placeholder={searchPlaceholder}
                            value={search}
                            onChange={e => onSearch && onSearch(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="min-w-full">
                    <thead className="bg-gray-50">
                        <tr>
                            {columns.map(col => (
                                <th
                                    key={col.field}
                                    className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${col.align ? `text-${col.align}` : ''}`}
                                    style={col.width ? { width: col.width } : {}}
                                >
                                    {col.title}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="bg-white">
                        {loading ? (
                            <tr>
                                <td colSpan={columns.length} className="px-6 py-12 text-center text-sm text-gray-500">
                                    <div className="flex items-center justify-center space-x-2">
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
                                        <span>Đang tải...</span>
                                    </div>
                                </td>
                            </tr>
                        ) : data.length === 0 ? (
                            <tr>
                                <td colSpan={columns.length} className="px-6 py-12 text-center text-sm text-gray-500">
                                    <div className="flex flex-col items-center">
                                        <div className="w-8 h-8 mb-2 text-gray-400">
                                            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                            </svg>
                                        </div>
                                        Không có dữ liệu
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            data.map((row, idx) => (
                                <tr key={idx} className="hover:bg-gray-50 transition-colors">
                                    {columns.map(col => (
                                        <td key={col.field} className={`px-6 py-4 whitespace-nowrap text-sm text-gray-900 ${col.align ? `text-${col.align}` : ''}`}>
                                            {col.render ? col.render(row) : (row as any)[col.field]}
                                        </td>
                                    ))}
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Footer với pagination và page size */}
            <div className="px-4 py-3 bg-gray-50 rounded-b-lg">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    {/* Page size selector */}
                    <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-700">Hiển thị:</span>
                        <select
                            className="px-3 py-1 text-sm rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                            value={pageSize}
                            onChange={e => onPageSizeChange && onPageSizeChange(Number(e.target.value))}
                        >
                            {pageSizeOptions.map(size => (
                                <option key={size} value={size}>{size} / trang</option>
                            ))}
                        </select>
                    </div>

                    {/* Pagination */}
                    <div className="flex items-center justify-center sm:justify-end">
                        <nav className="inline-flex -space-x-px">
                            <button
                                onClick={() => onPageChange && onPageChange(Math.max(page - 1, 0))}
                                disabled={page === 0}
                                className="px-3 py-1 border border-gray-300 text-sm bg-white text-gray-700 rounded-l-md focus:outline-none disabled:opacity-50"
                            >
                                &lt;
                            </button>
                            {Array.from({ length: Math.ceil(total / pageSize) }).map((_, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => onPageChange && onPageChange(idx)}
                                    className={`px-3 py-1 border border-gray-300 text-sm ${page === idx ? 'bg-blue-100 text-blue-700 font-bold' : 'bg-white text-gray-700'} focus:outline-none`}
                                >
                                    {idx + 1}
                                </button>
                            ))}
                            <button
                                onClick={() => onPageChange && onPageChange(Math.min(page + 1, Math.ceil(total / pageSize) - 1))}
                                disabled={page === Math.ceil(total / pageSize) - 1}
                                className="px-3 py-1 border border-gray-300 text-sm bg-white text-gray-700 rounded-r-md focus:outline-none disabled:opacity-50"
                            >
                                &gt;
                            </button>
                        </nav>
                    </div>

                    {/* Total count */}
                    <div className="flex items-center justify-center sm:justify-end">
                        <span className="text-sm text-gray-700">
                            Tổng: <span className="font-medium">{total.toLocaleString()}</span> bản ghi
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}