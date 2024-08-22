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
  aggregations: {
    group_by_api: {
      doc_count_error_upper_bound: 0,
      sum_other_doc_count: 0,
      buckets: [
        {
          key: "HTTTNTW",
          doc_count: 0,
        },
        {
          key: "PHANANH_CAMAU",
          doc_count: 0,
        },
        {
          key: "DVC_BTXH",
          doc_count: 0,
        },
        {
          key: "CSDL_CCVC",
          doc_count: 0,
        },
        {
          key: "VBQPPL",
          doc_count: 0,
        },
        {
          key: "CSDL_DanCu",
          doc_count: 0,
        },
        {
          key: "NongNghiepCaMau",
          doc_count: 0,
        },
        {
          key: "DMDC",
          doc_count: 0,
        },
        {
          key: "BHXH",
          doc_count: 0,
        },
        {
          key: "IOFFICE",
          doc_count: 0,
        },
        {
          key: "LLTP-VNeID",
          doc_count: 0,
        },
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
