export function data1(start, end, selectedEnv, app) {
  const filters = [];

  // Check if start and end are not null and add range condition to filters
  if (start) {
    filters.push({
      range: {
        date_created: {
          gt: start,
          lt: end,
        },
      },
    });
  }

  // If the selected environment is not "ALL", add condition to filters
  if (selectedEnv && selectedEnv !== "ALL") {
    filters.push({
      term: {
        am_key_type: selectedEnv,
      },
    });
  }

  // If the app is provided, add condition to filters
  if (app && app != "Tất cả") {
    filters.push({
      term: {
        application_name: app, // Assuming the field name in the index is "application"
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
            field: "api",
            size: 50,
            exclude: ["null"],
          },
          aggs: {
            unique_correlation_count: {
              cardinality: {
                field: "correlation_id", // Count unique correlation_id for each API
              },
            },
            by_failure: {
              filter: {
                term: {
                  isSuccess: false, // Filter documents where isSuccess is false
                },
              },
              aggs: {
                unique_failure_count: {
                  cardinality: {
                    field: "correlation_id", // Count unique correlation_id for failed documents
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
export function dataMM(start, end, selectedEnv, app) {
  const filters = [];

  // Check if start and end are not null and add range condition to filters
  if (start) {
    filters.push({
      range: {
        date_created: {
          gt: start,
          lt: end,
        },
      },
    });
  }

  // If the selected environment is not "ALL", add condition to filters
  if (selectedEnv && selectedEnv !== "ALL") {
    filters.push({
      term: {
        am_key_type: selectedEnv,
      },
    });
  }

  // If the app is provided, add condition to filters
  if (app && app != "Tất cả") {
    filters.push({
      term: {
        application_name: app, // Assuming the field name in the index is "application"
      },
    });
  }

  return {
    index: "apim-response-index/_search",
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
            field: "api",
            size: 50,
            exclude: ["null"],
          },
          aggs: {
            unique_correlation_count: {
              cardinality: {
                field: "correlation_id", // Count unique correlation_id for each API
              },
            },
            by_failure: {
              filter: {
                term: {
                  isSuccess: false, // Filter documents where isSuccess is false
                },
              },
              aggs: {
                unique_failure_count: {
                  cardinality: {
                    field: "correlation_id", // Count unique correlation_id for failed documents
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

export function dataCombined(start, end, selectedEnv, app) {
  const filters = [];

  // Kiểm tra start và end và thêm điều kiện range vào filters
  if (start) {
    filters.push({
      range: {
        date_created: {
          gt: start,
          lt: end,
        },
      },
    });
  }

  // Nếu selectedEnv không phải "ALL", thêm điều kiện vào filters
  if (selectedEnv && selectedEnv !== "ALL") {
    filters.push({
      term: {
        am_key_type: selectedEnv,
      },
    });
  }

  // Nếu app được cung cấp, thêm điều kiện vào filters
  if (app && app !== "Tất cả") {
    filters.push({
      term: {
        application_name: app,
      },
    });
  }

  return {
    index: "apim-request-index,apim-response-index", // Sử dụng mảng để truy vấn trên cả hai chỉ mục
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
            field: "api",
            size: 50,
            exclude: ["null"],
          },
          aggs: {
            unique_correlation_count: {
              cardinality: {
                field: "correlation_id",
              },
            },
            by_failure: {
              filter: {
                term: {
                  isSuccess: false,
                },
              },
              aggs: {
                unique_failure_count: {
                  cardinality: {
                    field: "correlation_id",
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

export const TotalPN2 = (start, end, selectedEnv,api) => {
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
  if (api && api != "Tất cả") {
    filters.push({
      term: {
        api: api, // Assuming the field name in the index is "application"
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
    index: "apim-request-index/_search",
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
