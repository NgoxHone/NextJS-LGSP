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
          doc_count: 1778116,
        },
        {
          key: "PHANANH_CAMAU",
          doc_count: 39008,
        },
        {
          key: "DVC_BTXH",
          doc_count: 20350,
        },
        {
          key: "CSDL_CCVC",
          doc_count: 10755,
        },
        {
          key: "VBQPPL",
          doc_count: 10441,
        },
        {
          key: "CSDL_DanCu",
          doc_count: 7777,
        },
        {
          key: "NongNghiepCaMau",
          doc_count: 4678,
        },
        {
          key: "DMDC",
          doc_count: 1182,
        },
        {
          key: "BHXH",
          doc_count: 607,
        },
        {
          key: "IOFFICE",
          doc_count: 203,
        },
        {
          key: "LLTP-VNeID",
          doc_count: 109,
        },
      ],
    },
  },
};

export default data;
