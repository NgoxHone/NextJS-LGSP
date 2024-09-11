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
