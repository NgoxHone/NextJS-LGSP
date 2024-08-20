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
  "took" : 28,
  "timed_out" : false,
  "_shards" : {
    "total" : 5,
    "successful" : 5,
    "skipped" : 0,
    "failed" : 0
  },
  "hits" : {
    "total" : {
      "value" : 10000,
      "relation" : "gte"
    },
    "max_score" : null,
    "hits" : [ ]
  },
  "aggregations" : {
    "count_by_month" : {
      "doc_count_error_upper_bound" : 0,
      "sum_other_doc_count" : 0,
      "buckets" : [
        {
          "key" : "BHXH",
          "doc_count" : 8
        },
        {
          "key" : "CSDL_CCVC",
          "doc_count" : 6495
        },
        {
          "key" : "CSDL_DanCu",
          "doc_count" : 4151
        },
        {
          "key" : "DKKD",
          "doc_count" : 77
        },
        {
          "key" : "DMDC",
          "doc_count" : 61
        },
        {
          "key" : "DVC_BTXH",
          "doc_count" : 14931
        },
        {
          "key" : "HTTTNTW",
          "doc_count" : 1067574
        },
        {
          "key" : "IOFFICE",
          "doc_count" : 180
        },
        {
          "key" : "LLTP-VNeID",
          "doc_count" : 458
        },
        {
          "key" : "NongNghiepCaMau",
          "doc_count" : 2804
        },
        {
          "key" : "PHANANH_CAMAU",
          "doc_count" : 25759
        },
        {
          "key" : "QuanLyHoTich",
          "doc_count" : 14
        },
        {
          "key" : "VBQPPL",
          "doc_count" : 72
        }
      ]
    },
    "count_by_day" : {
      "doc_count_error_upper_bound" : 0,
      "sum_other_doc_count" : 0,
      "buckets" : [
        {
          "key" : 1,
          "doc_count" : 67651
        },
        {
          "key" : 2,
          "doc_count" : 60393
        },
        {
          "key" : 3,
          "doc_count" : 48410
        },
        {
          "key" : 4,
          "doc_count" : 49458
        },
        {
          "key" : 5,
          "doc_count" : 61981
        },
        {
          "key" : 6,
          "doc_count" : 61328
        },
        {
          "key" : 7,
          "doc_count" : 72639
        },
        {
          "key" : 8,
          "doc_count" : 67497
        },
        {
          "key" : 9,
          "doc_count" : 68310
        },
        {
          "key" : 10,
          "doc_count" : 59659
        },
        {
          "key" : 11,
          "doc_count" : 55650
        },
        {
          "key" : 12,
          "doc_count" : 64412
        },
        {
          "key" : 13,
          "doc_count" : 63742
        },
        {
          "key" : 14,
          "doc_count" : 62975
        },
        {
          "key" : 15,
          "doc_count" : 65881
        },
        {
          "key" : 16,
          "doc_count" : 66602
        },
        {
          "key" : 17,
          "doc_count" : 59630
        },
        {
          "key" : 18,
          "doc_count" : 60145
        },
        {
          "key" : 19,
          "doc_count" : 49896
        },
        {
          "key" : 20,
          "doc_count" : 0
        }
      ]
    }
  }
}
