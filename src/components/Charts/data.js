export const dataEx = {
  took: 19,
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
    count_by_day: {
      doc_count_error_upper_bound: 0,
      sum_other_doc_count: 0,
      buckets: [
        {
          key: 12,
          doc_count: 0,
        },
        {
          key: 13,
          doc_count: 0,
        },
        {
          key: 14,
          doc_count: 0,
        },
        {
          key: 15,
          doc_count: 0,
        },
        {
          key: 18,
          doc_count: 0,
        },
      ],
    },
  },
};

export const data2 = {
  aggregations: {
    by_api: {
      doc_count_error_upper_bound: 0,
      sum_other_doc_count: 0,
      buckets: [
        {
          key: "PHANANH_CAMAU",
          doc_count: 139308,
          count_by_month: {
            doc_count_error_upper_bound: 0,
            sum_other_doc_count: 0,
            buckets: [
              {
                key: 1,
                doc_count: 9694,
                by_application_name: {
                  doc_count_error_upper_bound: 0,
                  sum_other_doc_count: 0,
                  buckets: [
                    {
                      key: "IOC_VNPT",
                      doc_count: 9500,
                    },
                    {
                      key: "T3H",
                      doc_count: 194,
                    },
                  ],
                },
              },
              {
                key: 4,
                doc_count: 19997,
                by_application_name: {
                  doc_count_error_upper_bound: 0,
                  sum_other_doc_count: 0,
                  buckets: [
                    {
                      key: "IOC_VNPT",
                      doc_count: 19987,
                    },
                    {
                      key: "T3H",
                      doc_count: 10,
                    },
                  ],
                },
              },
              {
                key: 5,
                doc_count: 9705,
                by_application_name: {
                  doc_count_error_upper_bound: 0,
                  sum_other_doc_count: 0,
                  buckets: [
                    {
                      key: "IOC_VNPT",
                      doc_count: 9699,
                    },
                    {
                      key: "T3H",
                      doc_count: 6,
                    },
                  ],
                },
              },
              {
                key: 6,
                doc_count: 26633,
                by_application_name: {
                  doc_count_error_upper_bound: 0,
                  sum_other_doc_count: 0,
                  buckets: [
                    {
                      key: "IOC_VNPT",
                      doc_count: 26633,
                    },
                  ],
                },
              },
              {
                key: 7,
                doc_count: 36522,
                by_application_name: {
                  doc_count_error_upper_bound: 0,
                  sum_other_doc_count: 0,
                  buckets: [
                    {
                      key: "IOC_VNPT",
                      doc_count: 36522,
                    },
                  ],
                },
              },
              {
                key: 8,
                doc_count: 36757,
                by_application_name: {
                  doc_count_error_upper_bound: 0,
                  sum_other_doc_count: 0,
                  buckets: [
                    {
                      key: "IOC_VNPT",
                      doc_count: 36510,
                    },
                    {
                      key: "T3H",
                      doc_count: 247,
                    },
                  ],
                },
              },
            ],
          },
        },
      ],
    },
  },
};

export const dataExTungNgay = {
  aggregations: {
    count_by_month: {
      buckets: [
        { key: "HTTTNTW", doc_count: 0 },
        { key: "PHANANH_CAMAU", doc_count: 0 },
        { key: "DVC_BTXH", doc_count: 0 },
        { key: "CSDL_CCVC", doc_count: 0 },
        { key: "CSDL_DanCu", doc_count: 0 },
        { key: "NongNghiepCaMau", doc_count: 0 },
        { key: "DKKD", doc_count: 0 },
      ],
    },
  },
};
