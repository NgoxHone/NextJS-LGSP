"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";

const ApiDetailPage = () => {
  const params = useParams();
  const id = params?.id;
  const [api, setApi] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    fetch(`/api/getApis?id=${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Không tìm thấy API hoặc lỗi server");
        return res.json();
      })
      .then((data) => {
        if (!data) throw new Error("Không tìm thấy API");
        setApi(data);
        setError("");
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <Breadcrumb pageName="Chi tiết API" />
      <h1 className="text-2xl font-bold mb-4">Chi tiết API</h1>
      {loading && <p>Đang tải...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {api && (
        <div className="bg-white dark:bg-boxdark rounded shadow p-6">
          <div className="mb-2"><b>ID:</b> {api.API_ID}</div>
          <div className="mb-2"><b>Tên API:</b> {api.API_NAME}</div>
          <div className="mb-2"><b>Version:</b> {api.API_VERSION}</div>
          <div className="mb-2"><b>Context:</b> {api.CONTEXT}</div>
          <div className="mb-2"><b>Ngày tạo:</b> {api.API_CREATED_TIME}</div>
          <div className="mb-2"><b>Phần mềm sử dụng:</b> {Array.isArray(api.APPLICATION_NAMES) ? api.APPLICATION_NAMES.join(", ") : "Không có"}</div>
        </div>
      )}
    </div>
  );
};

export default ApiDetailPage;