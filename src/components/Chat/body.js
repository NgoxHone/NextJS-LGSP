export const dataOption = {
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
      group_by_api: {
        terms: {
          field: "api",
          size: 50,
        },
      },
    },
  },
};
export function bodyLog(name) {
  return {
    index: "apim-request-index/_search",
    body: {
      size: 30,
      query: {
        bool: {
          filter: [
            {
              term: {
                am_key_type: "PRODUCTION",
              },
            },
            {
              term: {
                api: name,
              },
            },
          ],
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
