export const dataOption = (selectedEnv) => {
  const query = {
    size: 0,
    query: {
      bool: {
        filter: [],
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
  };
  if (selectedEnv !== "ALL") {
    query.query.bool.filter.push({
      term: {
        am_key_type: selectedEnv,
      },
    });
  }

  return {
    index: "apim-request-index/_search",
    body: query,
  };
};

export const dataOptionApp = (selectedEnv) => {
  const query = {
    size: 0,
    query: {
      bool: {
        filter: [],
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
  };
  if (selectedEnv !== "ALL") {
    query.query.bool.filter.push({
      term: {
        am_key_type: selectedEnv,
      },
    });
  }

  return {
    index: "apim-request-index/_search",
    body: query,
  };
};
export function bodyLog(selectedEnv, name, app) {
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

  return {
    index: "apim-request-index/_search",
    body: {
      size: 30,
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
