"use client";
import { useEffect, useState, Fragment, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import dynamic from "next/dynamic";
import { useRecoilState } from "recoil";
import { accessTokenState } from "../../../../utilities/Atom/atom";
import { formatVietnamTime } from "../../../../utilities/GlobalFunction";
const CkEditor = dynamic(() => import('@/components/CkEditor'), { ssr: false });
// import { CKEditor } from "@ckeditor/ckeditor5-react";
// import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

const DefaultLayout = dynamic(
    () => import("@/components/Layouts/DefaultLayout"),
    { ssr: false },
);
const SignIn = dynamic(() => import("../../auth/signin/page"), { ssr: false });

const methodColors: Record<string, string> = {
    GET: "bg-blue-500 border-blue-100 text-blue-50",
    POST: "bg-green-500 border-green-100 text-green-50",
    PUT: "bg-orange-500 border-orange-100 text-orange-50",
    DELETE: "bg-orange-500 border-orange-100 text-orange-50",
    PATCH: "bg-purple-500 border-purple-100 text-purple-50",
};

const methodColorsLight: Record<string, string> = {
    GET: "bg-blue-50 border-blue-100 text-blue-600",
    POST: "bg-green-50 border-green-100 text-green-600",
    PUT: "bg-orange-50 border-orange-100 text-orange-600",
    DELETE: "bg-red-50 border-red-100 text-red-600",
    PATCH: "bg-purple-50 border-purple-100 text-purple-600",
};


const methodBgColorsHex: Record<string, string> = {
    GET: "#eff8ff",      // bg-blue-50
    POST: "#ecfdf5",     // bg-green-50
    PUT: "#fff7ed",      // bg-orange-50
    DELETE: "#fef2f2",   // bg-red-50
    PATCH: "#f5f3ff",    // bg-purple-50
};


// Icons as SVG components
const ChevronDownIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
    </svg>
);

const ChevronRightIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
    </svg>
);

const PlusIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
    </svg>
);

const TrashIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
);

const SaveIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
    </svg>
);

const Accordion = ({ title, children, defaultOpen = false, styleParent, styleChildren }: any) => {
    const [open, setOpen] = useState(defaultOpen);
    return (
        <div style={{ borderColor: '#eaeaea', borderWidth: 1, ...styleParent }} className="mb-3 bg-white dark:bg-boxdark rounded-lg">
            <button
                className="w-full flex justify-between items-center px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150 outline-none"
                onClick={() => setOpen((v: boolean) => !v)}
                type="button"
            >
                <div className="flex items-center space-x-2 w-full">
                    {open ? <ChevronDownIcon /> : <ChevronRightIcon />}
                    <div className="flex-1 flex items-center justify-between min-w-0">{title}</div>
                </div>
            </button>
            {open && (
                <div style={{ ...styleChildren }} className="bg-gray-50/50 dark:bg-gray-900/30">
                    <div className="p-4">{children}</div>
                </div>
            )}
        </div>
    );
};

const ApiDetail = () => {
    const [accessToken] = useRecoilState(accessTokenState);
    const searchParams = useSearchParams();
    const id = searchParams?.get("id");
    const [api, setApi] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [editApi, setEditApi] = useState<any>(null);
    const [saving, setSaving] = useState(false);
    const router = useRouter();
    const methodsEndRef = useRef<HTMLDivElement>(null);
    const [lastAddedMethodIdx, setLastAddedMethodIdx] = useState<number | null>(null);
    const [prevMethodsCount, setPrevMethodsCount] = useState(0);
    const [editMode, setEditMode] = useState(true);

    useEffect(() => {
        if (!id) return;
        setLoading(true);
        fetch(`/api/api-docs/${id}`)
            .then((res) => {
                if (res.ok) return res.json();
                throw new Error();
            })
            .then((data) => {
                if (!data.methods && (data.fields || data.body || data.headers)) {
                    data.methods = [
                        {
                            method: "GET",
                            summary: "",
                            headers: data.headers || [],
                            fields: data.fields || [],
                            body: data.body || [],
                            response: data.response || [],
                            example: data.example || {},
                        },
                    ];
                    delete data.headers;
                    delete data.fields;
                    delete data.body;
                    delete data.response;
                    delete data.example;
                }
                setApi(data);
                setEditApi(data);
                setError("");
            })
            .catch(() => {
                fetch(`/api/getApis?id=${id}`)
                    .then((res) => {
                        if (!res.ok) throw new Error("Không tìm thấy API hoặc lỗi server");
                        return res.json();
                    })
                    .then((data) => {
                        setApi(data);
                        setEditApi(data);
                        setError("");
                    })
                    .catch((err) => setError(err.message))
                    .finally(() => setLoading(false));
            })
            .finally(() => setLoading(false));
    }, [id]);

    if (!accessToken) return <SignIn />;

    const handleChange = (field: string, value: any) => {
        setEditApi((prev: any) => ({ ...prev, [field]: value }));
    };

    const handleMethodChange = (idx: number, field: string, value: any) => {
        setEditApi((prev: any) => {
            const methods = [...(prev.methods || [])];
            methods[idx] = { ...methods[idx], [field]: value };
            return { ...prev, methods };
        });
    };

    const handleMethodArrayChange = (mIdx: number, key: string, idx: number, subKey: string, value: any) => {
        setEditApi((prev: any) => {
            const methods = [...(prev.methods || [])];
            const arr = [...(methods[mIdx][key] || [])];
            arr[idx] = { ...arr[idx], [subKey]: value };
            methods[mIdx][key] = arr;
            return { ...prev, methods };
        });
    };

    const handleAddMethodArrayItem = (mIdx: number, key: string, item: any) => {
        setEditApi((prev: any) => {
            const methods = [...(prev.methods || [])];
            methods[mIdx][key] = [...(methods[mIdx][key] || []), item];
            return { ...prev, methods };
        });
    };

    const handleRemoveMethodArrayItem = (mIdx: number, key: string, idx: number) => {
        setEditApi((prev: any) => {
            const methods = [...(prev.methods || [])];
            const arr = [...(methods[mIdx][key] || [])];
            arr.splice(idx, 1);
            methods[mIdx][key] = arr;
            return { ...prev, methods };
        });
    };

    const handleAddMethod = () => {
        setEditApi((prev: any) => ({
            ...prev,
            methods: [
                ...(prev.methods || []),
                {
                    method: "GET",
                    summary: "",
                    headers: [],
                    fields: [],
                    body: [],
                    response: [],
                    example: {},
                },
            ],
        }));
    };

    const handleRemoveMethod = (idx: number) => {
        setEditApi((prev: any) => {
            const methods = [...(prev.methods || [])];
            methods.splice(idx, 1);
            return { ...prev, methods };
        });
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const res = await fetch(`/api/api-docs/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(editApi),
            });
            if (!res.ok) throw new Error("Lưu thất bại");
            setApi(editApi);
            alert("Lưu thành công!");
        } catch (e) {
            alert("Lưu thất bại!");
        } finally {
            setSaving(false);
        }
    };

    // useEffect(() => {
    //     if (!editApi?.methods) return;
    //     if (editApi.methods.length > prevMethodsCount) {
    //         setLastAddedMethodIdx(editApi.methods.length - 1);
    //         setTimeout(() => {
    //             methodsEndRef.current?.scrollIntoView({ behavior: "smooth" });
    //         }, 200);
    //     }
    //     setPrevMethodsCount(editApi.methods.length);
    // }, [editApi?.methods]);

    // useEffect(() => {
    //     if (lastAddedMethodIdx !== null) {
    //         setLastAddedMethodIdx(null);
    //     }
    // }, [lastAddedMethodIdx]);

    return (
        <DefaultLayout>
            <Breadcrumb pageName="Chi tiết API" />
            <div className="w-full">
                {loading && (
                    <div className="flex items-center justify-center p-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                        <span className="ml-2 text-gray-600 dark:text-gray-400">Đang tải...</span>
                    </div>
                )}
                {error && (
                    <div className="bg-red-50 border border-red-100 text-red-700 px-4 py-3 rounded-lg mb-4">
                        {error}
                    </div>
                )}
                {editApi && (
                    <div className="bg-white dark:bg-boxdark rounded-lg shadow-sm">
                        {/* Header Section */}
                        <div className="p-6">
                            <div className="flex items-center space-x-3 mb-3">
                                <span className="text-2xl font-mono font-bold text-gray-900 dark:text-gray-100">
                                    {editApi.API_NAME || "/endpoint"}
                                </span>
                                {/* Switch bật/tắt chỉnh sửa */}
                                <label className="flex items-center space-x-2 cursor-pointer select-none">
                                    <span className="text-sm">Chỉnh sửa</span>
                                    <input
                                        type="checkbox"
                                        checked={editMode}
                                        onChange={() => setEditMode(v => !v)}
                                        className="form-checkbox h-5 w-5 text-blue-600"
                                    />
                                </label>
                            </div>
                            {/* CKEditor cho mô tả API cha */}
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Mô tả API</label>
                                {editMode ? (
                                    <CkEditor
                                        editorData={editApi.description || ""}
                                        setEditorData={data => handleChange("description", data)}
                                        handleOnUpdate={(data) => handleChange("description", data)}
                                    />
                                ) : (
                                    <div className="prose max-w-none mb-3 text-lg" dangerouslySetInnerHTML={{ __html: editApi.description }} />
                                )}
                            </div>
                            <div className="flex flex-wrap gap-4 text-sm text-gray-500 dark:text-gray-400">
                                {editApi.API_CREATED_TIME && (
                                    <span>Ngày tạo: {formatVietnamTime(editApi.API_CREATED_TIME)}</span>
                                )}
                                {editApi.APPLICATION_NAMES?.length > 0 && (
                                    <span>Phần mềm: {editApi.APPLICATION_NAMES.join(", ")}</span>
                                )}
                            </div>
                        </div>

                        {/* Methods Section */}
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                                    API Methods
                                </h2>
                                <button
                                    className="inline-flex items-center space-x-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-150 outline-none"
                                    onClick={() => handleAddMethod()}
                                >
                                    <PlusIcon />
                                    <span>Thêm</span>
                                </button>
                            </div>

                            {/* Group methods by type */}
                            {Object.entries((editApi.methods || []).reduce((acc: any, m: any, idx: number) => {
                                if (!acc[m.method]) acc[m.method] = [];
                                acc[m.method].push({ ...m, _idx: idx });
                                return acc;
                            }, {})).map(([method, methodList], groupIdx, arr) => {
                                const typedMethodList = methodList as any[];
                                return (
                                    <div key={method}>
                                        <Accordion
                                            styleChildren={{ backgroundColor: '#fafafa' }}
                                            styleParent={{ backgroundColor: methodBgColorsHex[method] }}
                                            title={
                                                <div className="flex items-center w-full">
                                                    <div className="flex items-center space-x-3 flex-shrink-0">
                                                        <span className={`px-3 py-1 rounded-md font-semibold text-sm border ${methodColors[method] || 'bg-gray-500 border-gray-100 text-gray-50'}`}>{method}</span>
                                                        <span className="text-gray-500 dark:text-gray-400 text-sm">{typedMethodList.length} endpoint{typedMethodList.length > 1 ? 's' : ''}</span>
                                                    </div>
                                                    <button
                                                        className="inline-flex items-center space-x-2 bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded text-xs font-medium transition-colors duration-150 outline-none ml-auto"
                                                        style={{ backgroundColor: '#fa6666' }}
                                                        onClick={e => {
                                                            e.stopPropagation();
                                                            setEditApi((prev: any) => ({
                                                                ...prev,
                                                                methods: prev.methods.filter((m: any) => m.method !== method)
                                                            }));
                                                        }}
                                                        title={`Xóa tất cả ${method} methods`}
                                                    >
                                                        <TrashIcon className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            }
                                            defaultOpen={groupIdx === 0}
                                        >
                                            <div className="space-y-4">
                                                {typedMethodList.map((m: any, mIdx: number) => (
                                                    <div key={m._idx}>
                                                        <div>
                                                            <Accordion
                                                                title={
                                                                    <div className="flex items-center w-full">
                                                                        <div className="flex items-center space-x-3 flex-1">
                                                                            <span className={`px-2 py-1 rounded text-xs font-medium ${methodColorsLight[m.method] || 'bg-gray-100 border-gray-300 text-gray-700'}`}>{m.method}</span>
                                                                            <span className="font-mono text-sm text-gray-700 dark:text-gray-300">
                                                                                {editApi.CONTEXT}
                                                                                <span style={{ fontWeight: 'bold' }}>{m.summary || editApi.path || "/"}</span>
                                                                            </span>
                                                                        </div>
                                                                        <button
                                                                            className="inline-flex items-center space-x-2 bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded text-xs font-medium transition-colors duration-150 outline-none ml-auto"
                                                                            style={{ backgroundColor: '#fa6666' }}
                                                                            onClick={e => { e.stopPropagation(); handleRemoveMethod(m._idx); }}
                                                                            title="Xóa method"
                                                                        >
                                                                            <TrashIcon className="w-4 h-4" />
                                                                        </button>
                                                                    </div>
                                                                }
                                                                defaultOpen={lastAddedMethodIdx === m._idx}
                                                            >
                                                                <div className="space-y-6">
                                                                    {/* Method Info */}
                                                                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                                                                        <div className="md:col-span-3">
                                                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                                                HTTP Method
                                                                            </label>
                                                                            <select style={{ borderColor: "#eaeaea" }}
                                                                                className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 outline-none transition-colors duration-150"
                                                                                value={m.method}
                                                                                onChange={e => handleMethodChange(m._idx, 'method', e.target.value)}
                                                                                disabled={!editMode}
                                                                            >
                                                                                <option>GET</option>
                                                                                <option>POST</option>
                                                                                <option>PUT</option>
                                                                                <option>DELETE</option>
                                                                                <option>PATCH</option>
                                                                            </select>
                                                                        </div>
                                                                        <div className="md:col-span-7">
                                                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                                                Endpoint
                                                                            </label>
                                                                            <input style={{ borderColor: "#eaeaea" }}
                                                                                className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 outline-none transition-colors duration-150"
                                                                                placeholder="Endpoint"
                                                                                value={m.summary}
                                                                                onChange={e => handleMethodChange(m._idx, 'summary', e.target.value)}
                                                                                disabled={!editMode}
                                                                            />
                                                                        </div>
                                                                        {/* CKEditor cho mô tả method (API con) */}
                                                                        <div className="md:col-span-12">
                                                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Mô tả method</label>
                                                                            {editMode ? (
                                                                                <CkEditor
                                                                                    editorData={m.description || ""}
                                                                                    setEditorData={data => handleMethodChange(m._idx, "description", data)}
                                                                                    handleOnUpdate={(data) => handleMethodChange(m._idx, "description", data)}
                                                                                />
                                                                            ) : (
                                                                                <div className="prose max-w-none mt-2" dangerouslySetInnerHTML={{ __html: m.description }} />
                                                                            )}
                                                                        </div>
                                                                    </div>

                                                                    {/* Parameter Sections */}
                                                                    {['headers'].map((section) => (
                                                                        <Accordion
                                                                            key={section}
                                                                            title={
                                                                                <div className="flex items-center space-x-2">
                                                                                    <span className="text-base font-medium capitalize">
                                                                                        {section}
                                                                                    </span>
                                                                                    <span className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-1 rounded-full text-xs">
                                                                                        {(m[section] || []).length}
                                                                                    </span>
                                                                                </div>
                                                                            }
                                                                            defaultOpen={false}
                                                                        >
                                                                            <div className="space-y-4">
                                                                                <button
                                                                                    className="inline-flex items-center space-x-2 bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded-md text-sm font-medium transition-colors duration-150 outline-none"
                                                                                    onClick={() => handleAddMethodArrayItem(m._idx, section, {
                                                                                        key: section === 'headers' ? '' : undefined,
                                                                                        name: section === 'headers' ? undefined : '',
                                                                                        value: section === 'headers' ? '' : undefined,
                                                                                        type: section === 'headers' ? undefined : '',
                                                                                        description: ''
                                                                                    })}
                                                                                >
                                                                                    <PlusIcon />
                                                                                    <span>Thêm {section === 'headers' ? 'header' : 'body field'}</span>
                                                                                </button>

                                                                                {(m[section] || []).length > 0 && (
                                                                                    <div className="overflow-x-auto">
                                                                                        <table className="w-full rounded-lg">
                                                                                            <thead className="bg-gray-50 dark:bg-gray-800">
                                                                                                <tr>
                                                                                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                                                                                        {section === 'headers' ? 'Key' : 'Trường thôn tin'}
                                                                                                    </th>
                                                                                                    {section === 'headers' && (
                                                                                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                                                                                            Value
                                                                                                        </th>
                                                                                                    )}
                                                                                                    {section !== 'headers' && (
                                                                                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                                                                                            Kiểu dữ liệu
                                                                                                        </th>
                                                                                                    )}
                                                                                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                                                                                        Mô tả
                                                                                                    </th>
                                                                                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                                                                                        Thao tác
                                                                                                    </th>
                                                                                                </tr>
                                                                                            </thead>
                                                                                            <tbody>
                                                                                                {(m[section] || []).map((item: any, idx: number) => (
                                                                                                    <tr key={idx} className="hover:bg-gray-50 dark:hover:bg-gray-800/30">
                                                                                                        <td className="px-4 py-3">
                                                                                                            <input
                                                                                                                className="w-full px-2 py-1 border border-gray-100 dark:border-gray-700 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm outline-none transition-colors duration-150"
                                                                                                                placeholder={section === 'headers' ? 'Header key' : 'Field name'}
                                                                                                                value={section === 'headers' ? item.key : item.name}
                                                                                                                onChange={e => handleMethodArrayChange(m._idx, section, idx, section === 'headers' ? 'key' : 'name', e.target.value)}
                                                                                                                disabled={!editMode}
                                                                                                            />
                                                                                                        </td>
                                                                                                        {section === 'headers' && (
                                                                                                            <td className="px-4 py-3">
                                                                                                                <input
                                                                                                                    className="w-full px-2 py-1 border border-gray-100 dark:border-gray-700 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm outline-none transition-colors duration-150"
                                                                                                                    placeholder="Header value"
                                                                                                                    value={item.value}
                                                                                                                    onChange={e => handleMethodArrayChange(m._idx, section, idx, 'value', e.target.value)}
                                                                                                                    disabled={!editMode}
                                                                                                                />
                                                                                                            </td>
                                                                                                        )}
                                                                                                        {section !== 'headers' && (
                                                                                                            <td className="px-4 py-3">
                                                                                                                <input
                                                                                                                    className="w-full px-2 py-1 border border-gray-100 dark:border-gray-700 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm outline-none transition-colors duration-150"
                                                                                                                    placeholder="Data type"
                                                                                                                    value={item.type}
                                                                                                                    onChange={e => handleMethodArrayChange(m._idx, section, idx, 'type', e.target.value)}
                                                                                                                    disabled={!editMode}
                                                                                                                />
                                                                                                            </td>
                                                                                                        )}
                                                                                                        <td className="px-4 py-3">
                                                                                                            <input
                                                                                                                className="w-full px-2 py-1 border border-gray-100 dark:border-gray-700 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm outline-none transition-colors duration-150"
                                                                                                                placeholder="Description"
                                                                                                                value={item.description}
                                                                                                                onChange={e => handleMethodArrayChange(m._idx, section, idx, 'description', e.target.value)}
                                                                                                                disabled={!editMode}
                                                                                                            />
                                                                                                        </td>
                                                                                                        <td className="px-4 py-3">
                                                                                                            <button
                                                                                                                className="inline-flex items-center space-x-1 text-red-500 hover:text-red-600 text-sm outline-none"
                                                                                                                onClick={() => handleRemoveMethodArrayItem(m._idx, section, idx)}
                                                                                                                disabled={!editMode}
                                                                                                            >
                                                                                                                <TrashIcon className="w-4 h-4" />
                                                                                                            </button>
                                                                                                        </td>
                                                                                                    </tr>
                                                                                                ))}
                                                                                            </tbody>
                                                                                        </table>
                                                                                    </div>
                                                                                )}
                                                                            </div>
                                                                        </Accordion>
                                                                    ))}
                                                                    {/* Response as a single CKEditor */}
                                                                    <Accordion
                                                                        key="response"
                                                                        title={<span className="text-base font-medium capitalize">Response</span>}
                                                                        defaultOpen={false}
                                                                    >
                                                                        <div className="space-y-2">
                                                                            {editMode ? (
                                                                                <CkEditor
                                                                                    editorData={m.response || ''}
                                                                                    setEditorData={data => handleMethodChange(m._idx, 'response', data)}
                                                                                    handleOnUpdate={data => handleMethodChange(m._idx, 'response', data)}
                                                                                />
                                                                            ) : (
                                                                                <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: m.response }} />
                                                                            )}
                                                                        </div>
                                                                    </Accordion>
                                                                    {/* {m.method === 'GET' && (
                                                                        <Accordion
                                                                            key="fields"
                                                                            title={
                                                                                <div className="flex items-center space-x-2">
                                                                                    <span className="text-base font-medium capitalize">Parameters</span>
                                                                                    <span className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-1 rounded-full text-xs">
                                                                                        {(m['fields'] || []).length}
                                                                                    </span>
                                                                                </div>
                                                                            }
                                                                            defaultOpen={false}
                                                                        >
                                                                            <div className="space-y-4">
                                                                                <button
                                                                                    className="inline-flex items-center space-x-2 bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded-md text-sm font-medium transition-colors duration-150 outline-none"
                                                                                    onClick={() => handleAddMethodArrayItem(m._idx, 'fields', {
                                                                                        key: undefined,
                                                                                        name: undefined,
                                                                                        value: undefined,
                                                                                        type: undefined,
                                                                                        description: ''
                                                                                    })}
                                                                                >
                                                                                    <PlusIcon />
                                                                                    <span>Thêm parameter</span>
                                                                                </button>

                                                                                {(m['fields'] || []).length > 0 && (
                                                                                    <div className="overflow-x-auto">
                                                                                        <table className="w-full rounded-lg">
                                                                                            <thead className="bg-gray-50 dark:bg-gray-800">
                                                                                                <tr>
                                                                                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                                                                                        Trường thông tin
                                                                                                    </th>
                                                                                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                                                                                        Kiểu dữ liệu
                                                                                                    </th>
                                                                                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                                                                                        Mô tả
                                                                                                    </th>
                                                                                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                                                                                        Thao tác
                                                                                                    </th>
                                                                                                </tr>
                                                                                            </thead>
                                                                                            <tbody>
                                                                                                {(m['fields'] || []).map((item: any, idx: number) => (
                                                                                                    <tr key={idx} className="hover:bg-gray-50 dark:hover:bg-gray-800/30">
                                                                                                        <td className="px-4 py-3">
                                                                                                            <input
                                                                                                                className="w-full px-2 py-1 border border-gray-100 dark:border-gray-700 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm outline-none transition-colors duration-150"
                                                                                                                placeholder="Field name"
                                                                                                                value={item.name}
                                                                                                                onChange={e => handleMethodArrayChange(m._idx, 'fields', idx, 'name', e.target.value)}
                                                                                                                disabled={!editMode}
                                                                                                            />
                                                                                                        </td>
                                                                                                        <td className="px-4 py-3">
                                                                                                            <input
                                                                                                                className="w-full px-2 py-1 border border-gray-100 dark:border-gray-700 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm outline-none transition-colors duration-150"
                                                                                                                placeholder="Data type"
                                                                                                                value={item.type}
                                                                                                                onChange={e => handleMethodArrayChange(m._idx, 'fields', idx, 'type', e.target.value)}
                                                                                                                disabled={!editMode}
                                                                                                            />
                                                                                                        </td>
                                                                                                        <td className="px-4 py-3">
                                                                                                            <input
                                                                                                                className="w-full px-2 py-1 border border-gray-100 dark:border-gray-700 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm outline-none transition-colors duration-150"
                                                                                                                placeholder="Description"
                                                                                                                value={item.description}
                                                                                                                onChange={e => handleMethodArrayChange(m._idx, 'fields', idx, 'description', e.target.value)}
                                                                                                                disabled={!editMode}
                                                                                                            />
                                                                                                        </td>
                                                                                                        <td className="px-4 py-3">
                                                                                                            <button
                                                                                                                className="inline-flex items-center space-x-1 text-red-500 hover:text-red-600 text-sm outline-none"
                                                                                                                onClick={() => handleRemoveMethodArrayItem(m._idx, 'fields', idx)}
                                                                                                                disabled={!editMode}
                                                                                                            >
                                                                                                                <TrashIcon className="w-4 h-4" />
                                                                                                                <span>Remove</span>
                                                                                                            </button>
                                                                                                        </td>
                                                                                                    </tr>
                                                                                                ))}
                                                                                            </tbody>
                                                                                        </table>
                                                                                    </div>
                                                                                )}
                                                                            </div>
                                                                        </Accordion>
                                                                    )} */}
                                                                    <Accordion title="Example" defaultOpen={false}>
                                                                        <div className="space-y-2">
                                                                            {editMode ? <CkEditor
                                                                                editorData={m.example || ''}
                                                                                setEditorData={data => handleMethodChange(m._idx, 'example', data)}
                                                                                handleOnUpdate={data => handleMethodChange(m._idx, 'example', data)}
                                                                            /> : <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: m.example }} />}
                                                                            {/* <textarea
                                                                                className="w-full px-3 py-2 border border-gray-100 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 font-mono text-sm outline-none transition-colors duration-150"
                                                                                rows={8}
                                                                                value={JSON.stringify(m.example, null, 2)}
                                                                                onChange={e => {
                                                                                    let val = {};
                                                                                    try { val = JSON.parse(e.target.value); } catch { val = m.example; }
                                                                                    handleMethodChange(m._idx, 'example', val);
                                                                                }}
                                                                                placeholder='{\n  "example": "data"\n}'
                                                                            /> */}
                                                                        </div>
                                                                    </Accordion>
                                                                </div>
                                                            </Accordion>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </Accordion>
                                    </div>
                                );
                            })}

                            {/* Save Button */}
                            <div className="flex justify-end pt-6 mt-8">
                                <button
                                    className="inline-flex items-center space-x-2 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-150 outline-none"
                                    onClick={() => handleSave()}
                                    disabled={saving}
                                >
                                    <SaveIcon />
                                    <span>{saving ? 'Đang lưu...' : 'Lưu'}</span>
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
            <div ref={methodsEndRef} />
        </DefaultLayout>
    );
};

export default ApiDetail;