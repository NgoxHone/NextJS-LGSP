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
  took: 324,
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
          key: 1,
          doc_count: 0,
        },
        {
          key: 2,
          doc_count: 0,
        },
        {
          key: 3,
          doc_count: 0,
        },
        {
          key: 4,
          doc_count: 0,
        },
        {
          key: 5,
          doc_count: 0,
        },
        {
          key: 6,
          doc_count: 0,
        },
        {
          key: 7,
          doc_count: 0,
        },
        {
          key: 8,
          doc_count: 0,
        },
      ],
    },
  },
};
