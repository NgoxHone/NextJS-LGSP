const data = {
  took: 26,
  timed_out: false,
  _shards: {
    total: 5,
    successful: 5,
    skipped: 0,
    failed: 0,
  },
  hits: {
    total: {
      value: 10000,
      relation: "gte",
    },
    max_score: null,
    hits: [],
  },
  init: true,
  aggregations: {
    group_by_api: {
      doc_count_error_upper_bound: 0,
      sum_other_doc_count: 0,
      buckets: [
        // {
        //   key: "PHANANH_CAMAU",
        //   doc_count: 0,
        // },
        // {
        //   key: "DVC_BTXH",
        //   doc_count: 0,
        // },
        // {
        //   key: "CSDL_CCVC",
        //   doc_count: 0,
        // },
        // {
        //   key: "VBQPPL",
        //   doc_count: 0,
        // },
        // {
        //   key: "CSDL_DanCu",
        //   doc_count: 0,
        // },
        // {
        //   key: "NongNghiepCaMau",
        //   doc_count: 0,
        // },
        // {
        //   key: "DMDC",
        //   doc_count: 0,
        // },
        // {
        //   key: "BHXH",
        //   doc_count: 0,
        // },
        // {
        //   key: "IOFFICE",
        //   doc_count: 0,
        // },
        // {
        //   key: "LLTP-VNeID",
        //   doc_count: 0,
        // },
      ],
    },
  },
};

export default data;

export const dataByNgayTrongThang = {
  took: 28,
  timed_out: false,
  _shards: {
    total: 5,
    successful: 5,
    skipped: 0,
    failed: 0,
  },
  hits: {
    total: {
      value: 10000,
      relation: "gte",
    },
    max_score: null,
    hits: [],
  },
  aggregations: {
    count_by_month: {
      doc_count_error_upper_bound: 0,
      sum_other_doc_count: 0,
      buckets: [
        {
          key: "BHXH",
          doc_count: 8,
        },
        {
          key: "CSDL_CCVC",
          doc_count: 6495,
        },
        {
          key: "CSDL_DanCu",
          doc_count: 4151,
        },
        {
          key: "DKKD",
          doc_count: 77,
        },
        {
          key: "DMDC",
          doc_count: 61,
        },
        {
          key: "DVC_BTXH",
          doc_count: 14931,
        },
        {
          key: "HTTTNTW",
          doc_count: 1067574,
        },
        {
          key: "IOFFICE",
          doc_count: 180,
        },
        {
          key: "LLTP-VNeID",
          doc_count: 458,
        },
        {
          key: "NongNghiepCaMau",
          doc_count: 2804,
        },
        {
          key: "PHANANH_CAMAU",
          doc_count: 25759,
        },
        {
          key: "QuanLyHoTich",
          doc_count: 14,
        },
        {
          key: "VBQPPL",
          doc_count: 72,
        },
      ],
    },
    count_by_day: {
      doc_count_error_upper_bound: 0,
      sum_other_doc_count: 0,
      buckets: [],
    },
  },
};

export const dataApp = {
  took: 184,
  timed_out: false,
  _shards: {
    total: 5,
    successful: 5,
    skipped: 0,
    failed: 0,
  },
  hits: {
    total: {
      value: 10000,
      relation: "gte",
    },
    max_score: null,
    hits: [],
  },
  aggregations: {
    group_by_api: {
      doc_count_error_upper_bound: 0,
      sum_other_doc_count: 0,
      buckets: [
        {
          key: "HTTTNCaMau",
          doc_count: 16887144,
        },
        {
          key: "Misa",
          doc_count: 620423,
        },
        {
          key: "DVC_CaMau",
          doc_count: 205534,
        },
        {
          key: "IOC_VNPT",
          doc_count: 151561,
        },
        {
          key: "CaMauG",
          doc_count: 94818,
        },
        {
          key: "T3H",
          doc_count: 34395,
        },
        {
          key: "iOffice",
          doc_count: 22049,
        },
        {
          key: "IOC_CaMau",
          doc_count: 12512,
        },
        {
          key: "Viettel",
          doc_count: 212,
        },
        {
          key: "PM_SoCongThuong",
          doc_count: 81,
        },
        {
          key: "CUSC_CanTho",
          doc_count: 39,
        },
        {
          key: "PM_SoTaiChinh",
          doc_count: 34,
        },
        {
          key: "CaMau_SoTaiChinh",
          doc_count: 20,
        },
        {
          key: "PMDuLieuGiaoThong",
          doc_count: 1,
        },
      ],
    },
  },
};
