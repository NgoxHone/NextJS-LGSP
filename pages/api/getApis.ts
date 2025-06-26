import type { NextApiRequest, NextApiResponse } from 'next';
import mysql from 'mysql2/promise';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const connection = await mysql.createConnection({
      host: '172.17.17.124',
      port: 3306,
      user: 'sstuser',
      password: 's3cretPass',
      database: 'APIM_DB',
    });

    const { id } = req.query;
    let rows;
    if (id) {
      [rows] = await connection.execute(`
        SELECT 
          a.API_ID, 
          a.API_NAME,
          a.API_VERSION,
          a.CONTEXT,
          a.CREATED_TIME AS API_CREATED_TIME,
          b.APPLICATION_ID,
          c.NAME AS APPLICATION_NAME,
          c.APPLICATION_TIER,
          c.APPLICATION_STATUS,
          b.SUB_STATUS AS SUBSCRIPTION_STATUS,
          b.CREATED_TIME AS SUBSCRIPTION_CREATED_TIME
        FROM 
          AM_API a
        JOIN 
          AM_SUBSCRIPTION b ON a.API_ID = b.API_ID
        JOIN 
          AM_APPLICATION c ON b.APPLICATION_ID = c.APPLICATION_ID
        WHERE a.API_ID = ?
      `, [id]);
    } else {
      [rows] = await connection.execute(`
        SELECT 
          a.API_ID, 
          a.API_NAME,
          a.API_VERSION,
          a.CONTEXT,
          a.CREATED_TIME AS API_CREATED_TIME,
          b.APPLICATION_ID,
          c.NAME AS APPLICATION_NAME,
          c.APPLICATION_TIER,
          c.APPLICATION_STATUS,
          b.SUB_STATUS AS SUBSCRIPTION_STATUS,
          b.CREATED_TIME AS SUBSCRIPTION_CREATED_TIME
        FROM 
          AM_API a
        JOIN 
          AM_SUBSCRIPTION b ON a.API_ID = b.API_ID
        JOIN 
          AM_APPLICATION c ON b.APPLICATION_ID = c.APPLICATION_ID
      `);
    }
    await connection.end();

    // Group by API_ID
    const apiMap = new Map();
    for (const row of rows as any[]) {
      if (!apiMap.has(row.API_ID)) {
        apiMap.set(row.API_ID, {
          API_ID: row.API_ID,
          API_NAME: row.API_NAME,
          API_VERSION: row.API_VERSION,
          CONTEXT: row.CONTEXT,
          API_CREATED_TIME: row.API_CREATED_TIME,
          APPLICATION_NAMES: [row.APPLICATION_NAME],
        });
      } else {
        const api = apiMap.get(row.API_ID);
        if (!api.APPLICATION_NAMES.includes(row.APPLICATION_NAME)) {
          api.APPLICATION_NAMES.push(row.APPLICATION_NAME);
        }
      }
    }
    const result = Array.from(apiMap.values());

    if (id) {
      res.status(200).json(result[0] || null);
    } else {
      res.status(200).json(result);
    }
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
} 