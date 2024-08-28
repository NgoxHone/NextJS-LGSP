export function data1(start, end) {
  return {
    index: "apim-request-index/_search",
    body: {
      query: {
        bool: {
          filter: [
            {
              range: {
                date_created: {
                  gt: start,
                  lt: end,
                },
              },
            },
            {
              term: {
                am_key_type: "PRODUCTION",
              },
            },
          ],
        },
      },
      aggs: {
        group_by_api: {
          terms: {
            field: "api",
            size: 50,
          },
        },
      },
    },
  };
}
export const TotalRequest = {
  index: "apim-request-index/_count",
  body: {
    query: {
      bool: {
        filter: [
          {
            term: {
              am_key_type: "PRODUCTION",
            },
          },
        ],
      },
    },
  },
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
export const TotalDV = {
  index: "apim-request-index/_search",
  body: {
    size: 0,
    aggs: {
      application_name_count: {
        cardinality: {
          field: "api",
        },
      },
    },
  },
};

export function TotalToday(today, yesterday) {
  return {
    index: "apim-request-index/_search",
    body: {
      size: 0,
      query: {
        bool: {
          filter: [
            {
              term: {
                am_key_type: "PRODUCTION",
              },
            },
          ],
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
