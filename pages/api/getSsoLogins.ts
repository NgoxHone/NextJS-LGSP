import type { NextApiRequest, NextApiResponse } from 'next';
import mysql from 'mysql2/promise';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        const connection = await mysql.createConnection({
            host: '172.17.17.124',
            port: 3306,
            user: 'sstuser',
            password: 's3cretPass',
            database: 'WSO2IS_IDENTITY_DB',
        });

        const [rows] = await connection.execute(`
      SELECT 
        store.SESSION_ID, 
        store.TIME_CREATED AS SESSION_START_TIME,
        store.OPERATION,
        store.EXPIRY_TIME,
        app.SUBJECT, 
        app.APP_ID, 
        sp.APP_NAME,
        meta.PROPERTY_TYPE,
        meta.VALUE AS PROPERTY_VALUE
      FROM 
        IDN_AUTH_SESSION_STORE store
      JOIN 
        IDN_AUTH_SESSION_APP_INFO app ON store.SESSION_ID = app.SESSION_ID
      JOIN 
        SP_APP sp ON app.APP_ID = sp.ID
      LEFT JOIN 
        IDN_AUTH_SESSION_META_DATA meta ON store.SESSION_ID = meta.SESSION_ID
      ORDER BY 
        store.TIME_CREATED DESC
    `);
        await connection.end();

        // Chuyển đổi dữ liệu thành dạng JSON yêu cầu và loại bỏ các bản ghi trùng lặp trong 'detail'
        const sessionMap: { [key: string]: any } = {};

        rows.forEach((row: any) => {
            // Nếu SESSION_ID chưa có trong sessionMap, khởi tạo nó
            if (!sessionMap[row.SESSION_ID]) {
                sessionMap[row.SESSION_ID] = {
                    SESSION_ID: row.SESSION_ID,
                    SESSION_START_TIME: row.SESSION_START_TIME,
                    OPERATION: row.OPERATION,
                    EXPIRY_TIME: row.EXPIRY_TIME,
                    SUBJECT: row.SUBJECT,
                    APP_ID: row.APP_ID,
                    APP_NAME: row.APP_NAME,
                    detail: [],  // Thêm một mảng 'detail' để chứa thông tin về các property
                };
            }

            // Thêm thông tin về PROPERTY_TYPE và PROPERTY_VALUE vào 'detail' của SESSION_ID
            if (row.PROPERTY_TYPE && row.PROPERTY_VALUE) {
                // Loại bỏ các bản ghi trùng lặp dựa trên PROPERTY_TYPE và PROPERTY_VALUE
                const existing = sessionMap[row.SESSION_ID].detail.find(
                    (item: any) => item.PROPERTY_TYPE === row.PROPERTY_TYPE && item.PROPERTY_VALUE === row.PROPERTY_VALUE
                );

                if (!existing) {
                    sessionMap[row.SESSION_ID].detail.push({
                        PROPERTY_TYPE: row.PROPERTY_TYPE,
                        PROPERTY_VALUE: row.PROPERTY_VALUE,
                    });
                }
            }
        });

        // Chuyển đối tượng sessionMap thành một mảng
        const result = Object.values(sessionMap);

        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ error: (error as Error).message });
    }
}
