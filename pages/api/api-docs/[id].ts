import type { NextApiRequest, NextApiResponse } from 'next';
import { promises as fs } from 'fs';
import path from 'path';

const DOCS_DIR = path.join(process.cwd(), 'src', 'api-docs');

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;
  if (!id || typeof id !== 'string') {
    return res.status(400).json({ error: 'Missing or invalid id' });
  }
  const filePath = path.join(DOCS_DIR, `${id}.json`);

  if (req.method === 'GET') {
    try {
      const data = await fs.readFile(filePath, 'utf-8');
      res.status(200).json(JSON.parse(data));
    } catch (err) {
      res.status(404).json({ error: 'API doc not found' });
    }
  } else if (req.method === 'PUT') {
    try {
      const body = req.body;
      await fs.writeFile(filePath, JSON.stringify(body, null, 2), 'utf-8');
      res.status(200).json({ success: true });
    } catch (err) {
      res.status(500).json({ error: 'Failed to save API doc' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'PUT']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
} 