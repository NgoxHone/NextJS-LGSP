import axios from "axios";
import { jwtDecode } from "jwt-decode";

export const getTimestampRanges = () => {
  // Lấy thời điểm hiện tại
  const now = new Date();

  // Lấy thời điểm bắt đầu của hôm nay (00:00:00 hôm nay)
  const startOfToday = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
  ).getTime();

  // Lấy thời điểm bắt đầu của hôm qua (00:00:00 hôm qua)
  const startOfYesterday = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate() - 1,
  ).getTime();

  const endOfYesterday = startOfToday - 1;
  const endOfToday = now.getTime();

  return {
    today: {
      gt: startOfToday,
      lt: endOfToday,
    },
    yesterday: {
      gt: startOfYesterday,
      lt: endOfYesterday,
    },
  };
};

export function formatTimestampToDate(timestamp) {
  const date = new Date(timestamp);

  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();

  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");

  return `${day}/${month}/${year} - ${hours}:${minutes}:${seconds}`;
}

export const convertDateToMilliseconds = (dateString) => {
  const date = new Date(dateString);
  return date.getTime();
};

export const fetchData = async (data, setState, path = "/api/service") => {
  try {
    const response = await axios({
      method: "post",
      url: path,
      headers: {
        "Content-Type": "application/json",
      },
      data: data,
    });
    const dataRes = response.data;
    setState(dataRes);
  } catch (error) {
    console.error("Error fetching documents:", error);
  }
};
export const fetchData2 = async (data, setState, path = "/api/service") => {
  try {
    const response = await axios({
      method: "post",
      url: path,
      headers: {
        "Content-Type": "application/json",
      },
      data: data,
    });
    const dataRes = response.data;

    // Update state if setState is provided
    if (setState) {
      setState(dataRes);
    }

    // Return the response data
    return dataRes;
  } catch (error) {
    console.error("Error fetching documents:", error);
    throw error; // Optionally rethrow the error for handling in the caller function
  }
};
export const fetchData3 = async (data, setState, path = "/api/service") => {
  try {
    const response = await axios({
      method: "post",
      url: path,
      headers: {
        "Content-Type": "application/json",
      },
      data: data,
    });

    // Kiểm tra cấu trúc dữ liệu trả về từ Elasticsearch
    const dataRes = response.data;
    console.log("Elasticsearch Response Data:", dataRes);

    // Trích xuất correlation_id từ buckets nếu dữ liệu trả về đúng cấu trúc
    const correlationIds = dataRes.aggregations?.correlation_ids?.buckets.map(
      (bucket) => bucket.key.correlation_id,
    );

    // Cập nhật state nếu setState được cung cấp
    if (setState) {
      setState(correlationIds);
    }

    // Trả về danh sách correlation_id
    return correlationIds;
  } catch (error) {
    console.error("Error fetching documents:", error);
    throw error;
  }
};

export function getDatabaseDescription(id) {
  switch (id) {
    case 1:
      return "Hệ thống định danh và xác thực điện tử (Bộ Công an)";
    case "DKDN":
      return "Cơ sở dữ liệu quốc gia về Đăng ký doanh nghiệp (Bộ Kế hoạch và Đầu tư)";
    case "BHXH":
      return "Cơ sở dữ liệu quốc gia về bảo hiểm (Bảo hiểm Xã hội Việt Nam)";
    case 4:
      return "Cơ sở dữ liệu đất đai quốc gia (phân hệ tập trung tại Bộ Tài nguyên và Môi trường)";
    case "CSDL_CCVC":
      return "Cơ sở dữ liệu quốc gia về cán bộ, công chức, viên chức (Bộ Nội vụ)";
    case "VBQPPL":
      return "Cơ sở dữ liệu quốc gia về văn bản quy phạm pháp luật (Bộ Tư pháp)";
    case 7:
      return "Cơ sở dữ liệu quốc gia về giá (Bộ Tài chính)";
    case "BoGTVT":
      return "Cơ sở dữ liệu đăng kiểm phương tiện (Bộ Giao thông vận tải)";
    case "LLTP-VNeID":
      return "Hệ thống cấp phiếu lý lịch tư pháp trực tuyến (Bộ Tư pháp)";
    case "QuanLyHoTich":
      return "Hệ thống thông tin đăng ký và quản lý hộ tịch (Bộ Tư pháp)";
    case 11:
      return "Hệ thống cấp mã số đơn vị có quan hệ với ngân sách (Bộ Tài chính)";
    case "DMDC":
      return "Hệ thống thông tin quản lý danh mục điện tử dùng chung của các cơ quan nhà nước phục vụ phát triển Chính phủ điện tử Việt Nam (Bộ Thông tin và Truyền thông)";
    case 13:
      return "Cổng liên thông TNMT-Thuế (Bộ Tài nguyên và Môi trường)";
    case "DVC-GPLX":
      return "Hệ thống dịch vụ công quản lý giao thông vận tải lĩnh vực đường bộ (Bộ Giao thông vận tải)";
    case 15:
      return "Cổng dịch vụ công của Bộ Xây dựng";
    case "DVC_BTXH":
      return "Hệ thống Đăng ký, giải quyết chính sách trợ giúp xã hội trực tuyến và cơ sở dữ liệu về trợ giúp xã hội (Bộ Lao động-Thương binh và Xã hội)";
    case 17:
      return "Hệ thống dịch vụ hành chính công của Tổng Công ty Bưu điện Việt Nam";
    case "HTTTNTW":
      return "Hệ thống thông tin nguồn Trung ương (Bộ Thông tin và Truyền thông) và hệ thống thông tin nguồn địa phương";
    case 19:
      return "Hệ thống danh mục điện tử dùng chung ngành tài chính (Bộ Tài chính)";
    case 20:
      return "Hệ thống danh mục dùng chung ngành ngân hàng (Ngân hàng Nhà nước Việt Nam)";
    case 21:
      return "Hệ thống dịch vụ, tiện ích của Tập đoàn Điện lực Việt Nam (EVN)";
    case "CSDL_DanCu":
      return "Cơ sở dữ liệu quốc gia về dân cư (Bộ Công an)";
    case "DKKD":
      return "Cơ sở dữ liệu Đăng ký kinh doanh (Bộ Kế hoạch và Đầu tư)";
    case "CSDL_GIA":
      return "Cơ sở dữ liệu quốc gia về giá (Bộ Tài chính)";
    case "PHANANH_CAMAU":
      return "Hệ thống thông tin phản ánh";
    case "NongNghiepCaMau":
      return "Hệ thống thông tin cơ sở dữ liệu nông nghiệp";
    case "TAUCA":
      return "Hệ thống thông tin tàu cá";
    case "CDDH_ChinhPhu":
      return "Hệ thống chỉ đạo điều hành chính phủ";
    case "CSDL_DATDAI":
      return "Cơ sở dữ liệu đất đai";
    case "DMDC-NHNN":
      return "Hệ thống danh mục dùng chung ngành ngân hàng (Ngân hàng Nhà nước Việt Nam)";
    case "VDXP":
      return "Hệ thông liên thông văn bản quốc gia";
    case "VDXP_Product":
      return "Hệ thông liên thông văn bản quốc gia";
    case "VNPOST":
      return "Hệ thống bưu điện quốc gia VNPOST";
    case "GetEdoc":
      return "GetEdoc";
    case "SentEdoc":
      return "SentEdoc";
    case "HTTTNCaMau":
      return "Hệ thống thông tin nguồn Cà Mau";
    case "DVC_CaMau":
      return "Phần mềm dịch vụ công Cà Mau";
    case "CaMauG":
      return "CaMauG";
    case "T3H":
      return "Trung tâm tin học (dùng để kiểm thử)";
    case "IOC_CaMau":
      return "Trung tâm điều hành Cà Mau";
    case "Viettel":
      return "Viettel";
    case "PM_SoCongThuong":
      return "Phần mềm sở công thương";
    case "CUSC_CanTho":
      return "Đại học Cần Thơ";
    case "PM_SoTaiChinh":
      return "Phần mềm sở tài chính";
    case "CaMau_SoTaiChinh":
      return "Sở tài chính";
    case "PMDuLieuGiaoThong":
      return "Phần mềm dữ liệu giao thông";
    case "EVN":
      return "Hệ thống dịch vụ, tiện ích của Tập đoàn Điện lực Việt Nam (EVN) - chưa tích hợp";
    case "SSO.VNeID":
      return "Hệ thống định danh và xác thực điện tử (Bộ Công an)";
    case "PMDuLieuGiaoThong":
      return "Phần mềm dữ liệu giao thông";
    case "vpostcode":
      return "Hệ thống mã bưu chính Vpostcode  (Tổng Công ty  Bưu điện Việt  Nam)";
    case "CSDL_ĐKPT":
      return "Cơ sở dữ liệu đăng kiểm phương tiện (Bộ Giao thông vận  tải) - chưa tích hợp";
    default:
      return id;
  }
}

export const decodeJWT = () => {
  try {
    const decoded = jwtDecode(token);
    return decoded;
  } catch (error) {
    console.error("Error decoding token:", error);
    return null;
  }
};

export async function fetchAllCorrelationIds() {
  const correlationIds = [];
  let afterKey = null;

  try {
    while (true) {
      const query = {
        index: "/apim-request-index/_search",
        body: {
          size: 0,
          query: {
            bool: {
              must: [
                { match: { full_request_path: "/vdxp-product/1.0/getEdoc" } },
              ],
            },
          },
          aggs: {
            correlation_ids: {
              composite: {
                size: 1000,
                sources: [
                  { correlation_id: { terms: { field: "correlation_id" } } },
                ],
                ...(afterKey ? { after: afterKey } : {}), // Thêm `afterKey` nếu có
              },
            },
          },
        },
      };

      const response = await axios({
        method: "post",
        url: "/api/service",
        headers: {
          "Content-Type": "application/json",
        },
        data: query,
      });

      const buckets = response.data.aggregations.correlation_ids.buckets;

      // Lưu correlation_id vào mảng
      buckets.forEach((bucket) => {
        correlationIds.push(bucket.key.correlation_id);
      });

      // Kiểm tra `after_key` để xác định nếu có trang tiếp theo
      afterKey = response.data.aggregations.correlation_ids.after_key;

      // Nếu không có `after_key`, thoát khỏi vòng lặp
      if (!afterKey) break;
    }

    return correlationIds;
  } catch (error) {
    console.error("Error fetching correlation IDs:", error);
    return [];
  }
}

export const checkResponses = async (correlationIds) => {
  try {
    const requestData = {
      index: "/apim-response-index/_search",
      body: {
        size: 0,
        query: {
          terms: {
            correlation_id: correlationIds,
          },
        },
        aggs: {
          unique_correlation_ids: {
            cardinality: {
              field: "correlation_id",
            },
          },
        },
      },
    };
    console.log("BODY", requestData);
    // Gọi API để kiểm tra correlation_id trong response
    const response = await axios({
      method: "post",
      url: "/api/service",
      headers: {
        "Content-Type": "application/json",
      },
      data: requestData,
    });

    // Trả về số lượng correlation_id có mặt trong response
    console.log("CUISCUNG", response);
    return response.data.aggregations.unique_correlation_ids.value;
  } catch (error) {
    console.error("Error fetching response documents:", error);
    throw error;
  }
};

// export const getStatusStyles = (statusCode) => {
//   switch (true) {
//     case statusCode >= 200 && statusCode < 300:
//       return "bg-green-500 text-white border-green-700"; // Thành công
//     case statusCode >= 300 && statusCode < 400:
//       return "bg-blue-500 text-white border-blue-700"; // Điều hướng
//     case statusCode >= 400 && statusCode < 500:
//       return "bg-yellow-500 text-white border-yellow-700"; // Lỗi client
//     case statusCode >= 500:
//       return "bg-red-500 text-white border-red-700"; // Lỗi server
//     default:
//       return "bg-gray-500 text-white border-gray-700"; // Không xác định
//   }
// };
