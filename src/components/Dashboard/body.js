export function data1(start, end, selectedEnv) {
  const filters = [
    {
      range: {
        date_created: {
          gt: start,
          lt: end,
        },
      },
    },
  ];

  // Nếu môi trường đã chọn không phải là "ALL", thêm điều kiện vào bộ lọc
  if (selectedEnv && selectedEnv !== "ALL") {
    filters.push({
      term: {
        am_key_type: selectedEnv,
      },
    });
  }

  return {
    index: "apim-response-index/_search",
    body: {
      query: {
        bool: {
          filter: filters,
        },
      },
      aggs: {
        group_by_api: {
          terms: {
            field: "api",
            size: 50,
            exclude: ["null"],  
          },
          aggs: {
            unique_correlation_count: {
              cardinality: {
                field: "correlation_id",  // Đếm số lượng correlation_id duy nhất cho từng api
              },
            },
            by_failure: {
              filter: {
                term: {
                  isSuccess: false,  // Chỉ lọc các tài liệu có isSuccess là false
                },
              },
              aggs: {
                unique_failure_count: {
                  cardinality: {
                    field: "correlation_id",  // Đếm số lượng correlation_id duy nhất cho các tài liệu thất bại
                  },
                },
              },
            },
          },
        },
      },
    },
  };
}

export const TotalRequest = (selectedEnv) => {
  const filter = [];
  if (selectedEnv && selectedEnv !== "ALL") {
    filter.push({
      term: {
        am_key_type: selectedEnv,
      },
    });
  }

  return {
    index: "apim-request-index/_count",
    body: {
      query: {
        bool: {
          filter: filter,
        },
      },
    },
  };
};

export const TotalPN = {
  index: "apim-request-index/_search",
  body: {
    size: 0,
    aggs: {
      application_name_count: {
        cardinality: {
          field: "application_name",
        },
      },
    },
  },
};

export const TotalPN2 = (start, end, selectedEnv) => {
  const filters = [
    {
      range: {
        date_created: {
          gt: start,
          lt: end,
        },
      },
    },
  ];

  if (selectedEnv && selectedEnv !== "ALL") {
    filters.push({
      term: {
        am_key_type: selectedEnv,
      },
    });
  }

  return {
    index: "apim-request-index/_search",
    body: {
      size: 0,
      query: {
        bool: {
          filter: filters,
        },
      },
      aggs: {
        group_by_api: {
          terms: {
            field: "application_name",
            size: 50,
          },
        },
      },
    },
  };
};

export const TotalDV = (selectedEnv) => {
  const filter = {};
  if (selectedEnv && selectedEnv !== "ALL") {
    filter.term = {
      am_key_type: selectedEnv,
    };
  }

  return {
    index: "apim-response-index/_search",
    body: {
      size: 0,
      query: {
        bool: {
          filter: [filter],
        },
      },
      aggs: {
        application_name_count: {
          cardinality: {
            field: "api",
          },
        },
      },
    },
  };
};

export function TotalToday(today, yesterday, selectedEnv) {
  const filter = [];
  if (selectedEnv && selectedEnv !== "ALL") {
    filter.push({
      term: {
        am_key_type: selectedEnv,
      },
    });
  }

  return {
    index: "apim-request-index/_search",
    body: {
      size: 0,
      query: {
        bool: {
          filter: filter,
        },
      },
      aggs: {
        counts_by_date: {
          filters: {
            filters: {
              today: {
                range: {
                  date_created: today,
                },
              },
              yesterday: {
                range: {
                  date_created: yesterday,
                },
              },
            },
          },
        },
      },
    },
  };
}

export const bodySendEdoc = (start, end) => {
  return {
    index: "apim-request-index/_count",
    body: {
      query: {
        bool: {
          must: [
            {
              range: {
                date_created: {
                  gt: start,
                  lt: end,
                },
              },
            },
            { match: { full_request_path: "/vdxp-product/1.0/sendEdoc" } },
            { wildcard: { headers: "*=edoc*" } },
          ],
        },
      },
    },
  };
};

export const bodyGetEdoc = (start, end) => {
  return {
    index: "apim-request-index/_count",
    body: {
      query: {
        bool: {
          must: [
            {
              range: {
                date_created: {
                  gt: start,
                  lt: end,
                },
              },
            },
            { match: { full_request_path: "/vdxp-product/1.0/getEdoc" } },
          ],
        },
      },
    },
  };
};
