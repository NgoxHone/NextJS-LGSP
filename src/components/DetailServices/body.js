export function bodyLog(selectedEnv, name, app, tu, den, from = 0, size = 30) {
  const filters = [];

  // Thêm bộ lọc cho api
  if (name && name !== "Tất cả") {
    filters.push({
      term: {
        api: name,
      },
    });
  }

  // Thêm bộ lọc cho application_name nếu không phải là "Tất cả"
  if (app && app !== "Tất cả") {
    filters.push({
      term: {
        application_name: app,
      },
    });
  }

  // Thêm bộ lọc cho am_key_type nếu không phải là "ALL"
  if (selectedEnv && selectedEnv !== "ALL") {
    filters.push({
      term: {
        am_key_type: selectedEnv,
      },
    });
  }
  if (tu && den) {
    filters.push({
      range: {
        date_created: {
          gte: tu,
          lte: den,
        },
      },
    });
  }

  return {
    index: "apim-request-index/_search",
    body: {
      from,   // Vị trí bắt đầu
      size,   // Số lượng bản ghi mỗi trang
      query: {
        bool: {
          filter: filters,
        },
      },
      sort: [
        {
          date_created: {
            order: "desc",
          },
        },
      ],
    },
  };
}
