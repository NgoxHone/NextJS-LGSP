export function bodyByYear(y = 2024) {
  return {
    index: "apim-request-index/_search",
    body: {
      size: 0,
      query: {
        bool: {
          filter: [
            {
              term: {
                nam: y,
              },
            },
          ],
        },
      },
      aggs: {
        count_by_month: {
          terms: {
            field: "thang",
            order: {
              _key: "asc", // Sắp xếp theo key (tháng) tăng dần
            },
            size: 12, // Đảm bảo lấy tất cả 12 tháng
          },
        },
      },
    },
  };
}
export function bodyByWeek(ngay = [11, 12, 13, 15, 16, 17, 18], thang = [7]) {
  return {
    index: "apim-request-index/_search",
    body: {
      size: 0,
      query: {
        bool: {
          filter: [
            {
              term: {
                nam: "2024",
              },
            },
            {
              terms: {
                ngay: ngay,
              },
            },
            {
              terms: {
                thang: thang,
              },
            },
          ],
        },
      },
      aggs: {
        count_by_day: {
          terms: {
            field: "ngay",
            order: {
              _key: "asc",
            },
          },
        },
      },
    },
  };
}

export function bodyByDay(thang = [8], nam = 2024) {
  return {
    index: "apim-request-index/_search",
    body: {
      size: 0,
      query: {
        bool: {
          must: [
            {
              terms: {
                thang: thang,
              },
            },
            {
              term: {
                nam: nam,
              },
            },
          ],
        },
      },
      aggs: {
        count_by_day: {
          terms: {
            field: "ngay",
            size: 50,
            order: {
              _key: "asc",
            },
          },
        },
      },
    },
  };
}

export function bodyByTungNgay(ngay = [1], thang = [8], nam = 2024) {
  return {
    index: "apim-request-index/_search",
    body: {
      size: 0,
      query: {
        bool: {
          must: [
            {
              terms: {
                ngay: ngay,
              },
            },
            {
              terms: {
                thang: thang,
              },
            },
            {
              term: {
                nam: nam,
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
        count_by_month: {
          terms: {
            field: "api",
            size: 40,
            order: {
              _count: "desc",
            },
          },
        },
        count_by_day: {
          terms: {
            field: "ngay",
            size: 50,
            order: {
              _key: "asc",
            },
          },
        },
      },
    },
  };
}
