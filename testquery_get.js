const { Client } = require('@elastic/elasticsearch');

const client = new Client({
    node: 'http://172.17.17.121:9202',
    auth: {
        username: 'elastic',
        password: 'elastic'
    }
});

const getCorrelationIds = async () => {
    let allCorrelationIds = [];
    let afterKey = null;

    try {
        do {
            // Cấu hình body cho aggregation
            const body = {
                query: {
                    bool: {
                        must: [
                            { match: { full_request_path: '/vdxp-product/1.0/getEdoc' } },
                            {
                                range: {
                                    request_start_time: {
                                        gte: 1728259200000
                                    }
                                }
                            }
                        ]
                    }
                },
                size: 0,
                aggs: {
                    correlation_ids: {
                        composite: {
                            size: 1000,
                            sources: [
                                { correlation_id: { terms: { field: 'correlation_id' } } }
                            ]
                        }
                    }
                }
            };

            // Chỉ thêm `after` khi `afterKey` không phải null
            if (afterKey) {
                body.aggs.correlation_ids.composite.after = afterKey;
            }

            const response = await client.search({
                index: 'apim-request-index',
                body: body
            });

            const buckets = response.body.aggregations.correlation_ids.buckets;
            allCorrelationIds.push(...buckets.map(bucket => bucket.key.correlation_id));
            afterKey = response.body.aggregations.correlation_ids.after_key;

        } while (afterKey);

        console.log(`Tổng apim-request-index: ${allCorrelationIds.length} `);
        return allCorrelationIds;
    } catch (error) {
        console.error('Error fetching correlation_ids:', error);
        return [];
    }
};
// Chia nhỏ danh sách correlationIds để xử lý trong các nhóm nhỏ hơn
const chunkArray = (array, size) => {
    const result = [];
    for (let i = 0; i < array.length; i += size) {
        result.push(array.slice(i, i + size));
    }
    return result;
};

const getSuccessResponses = async (correlationIds) => {
    const chunkedIds = chunkArray(correlationIds, 1000); // Chia thành nhóm 1000 ID
    let uniqueCorrelationIdsCount = 0;

    try {
        for (const ids of chunkedIds) {
            const response = await client.search({
                index: 'apim-response-index',
                body: {
                    query: {
                        bool: {
                            must: [
                                { term: { isSuccess: true } },
                                { terms: { correlation_id: ids } }
                            ]
                        }
                    },
                    size: 0,
                    aggs: {
                        unique_correlation_ids: {
                            cardinality: { field: 'correlation_id' }
                        }
                    }
                }
            });

            uniqueCorrelationIdsCount += response.body.aggregations.unique_correlation_ids.value;
        }

        console.log(`Tổng apim-response-index isSuccess: ${uniqueCorrelationIdsCount}`);
    } catch (error) {
        console.error('Error fetching success responses:', error);
    }
};

(async () => {
    const correlationIds = await getCorrelationIds();
    if (correlationIds.length > 0) {
        await getSuccessResponses(correlationIds);
    } else {
        console.log('No correlation IDs found.');
    }
})();
