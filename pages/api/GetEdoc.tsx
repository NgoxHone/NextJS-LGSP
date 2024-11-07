import { Client } from '@elastic/elasticsearch';
import type { NextApiRequest, NextApiResponse } from "next";

// Tạo kết nối tới Elasticsearch
const client = new Client({
    node: 'http://172.17.17.122:9202',
    auth: {
        username: 'elastic',
        password: 'elastic'
    }
});

// Hàm chia nhỏ mảng
const chunkArray = (array, size) => {
    const result = [];
    for (let i = 0; i < array.length; i += size) {
        result.push(array.slice(i, i + size));
    }
    return result;
};

// Hàm lấy danh sách `correlation_id` từ Elasticsearch
const getCorrelationIds = async (from, to) => {
    let allCorrelationIds = [];
    let afterKey = null;

    try {
        do {
            const body = {
                query: {
                    bool: {
                        must: [
                            { match: { full_request_path: '/vdxp-product/1.0/getEdoc' } }
                        ]
                    }
                },
                size: 0,
                aggs: {
                    correlation_ids: {
                        composite: {
                            size: 10000, // Giảm kích thước để tối ưu hóa
                            sources: [
                                { correlation_id: { terms: { field: 'correlation_id' } } }
                            ]
                        }
                    }
                }
            };

            // Thêm điều kiện `range` nếu có tham số `from` hoặc `to`
            if (from || to) {
                body.query.bool.must.push({
                    range: {
                        request_start_time: {
                            ...(from && { gte: from }),
                            ...(to && { lte: to })
                        }
                    }
                });
            }

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

        return allCorrelationIds;
    } catch (error) {
        console.error('Error fetching correlation_ids:', error);
        return [];
    }
};

// Hàm lấy số lượng `correlation_id` thành công từ Elasticsearch
const getSuccessResponses = async (correlationIds) => {
    const chunkedIds = chunkArray(correlationIds, 1000);
    let uniqueCorrelationIdsCount = 0;

    try {
        const promises = chunkedIds.map(async (ids) => {
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
            return response.body.aggregations.unique_correlation_ids.value;
        });

        const results = await Promise.all(promises);
        uniqueCorrelationIdsCount = results.reduce((sum, count) => sum + count, 0);

        return uniqueCorrelationIdsCount;
    } catch (error) {
        console.error('Error fetching success responses:', error);
        return 0;
    }
};

// API Endpoint handler
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { from, to } = req.query;

    try {
        const correlationIds = await getCorrelationIds(from, to);

        if (correlationIds.length > 0) {
            const uniqueCount = await getSuccessResponses(correlationIds);
            res.status(200).json({
                message: 'Success',
                totalCorrelationIds: correlationIds.length,
                uniqueSuccessCorrelationIds: uniqueCount
            });
        } else {
            res.status(200).json({
                message: 'No correlation IDs found.',
                totalCorrelationIds: 0,
                uniqueSuccessCorrelationIds: 0
            });
        }
    } catch (error) {
        console.error('API error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}
