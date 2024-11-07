import axios, { AxiosError } from "axios";
import type { NextApiRequest, NextApiResponse } from "next";

import { Client } from '@elastic/elasticsearch';

const client = new Client({
  node: 'http://172.17.17.121:9202',
  auth: {
    username: 'elastic',
    password: 'elastic'
  }
});
interface ElasticsearchErrorResponse {
  message: string;
  status?: number;
}
export const config = {
  api: {
    bodyParser: {
      sizeLimit: "10mb", // Tăng kích thước giới hạn lên 10MB hoặc tùy chỉnh theo nhu cầu
    },
  },
};
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { index, body } = req.body;

  const url = `http://172.17.17.121:9202/${index}`;

  try {
    const response = await axios({
      method: "post",
      url: url,
      headers: {
        "Content-Type": "application/json",
      },
      data: body,
    });

    res.status(200).json(response.data);
  } catch (error) {
    console.error("Elasticsearch Axios Error:", error);

    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError;

      if (axiosError.response) {
        res.status(axiosError.response.status).json(axiosError.response.data);
      } else if (axiosError.request) {
        res
          .status(500)
          .json({ message: "No response received from Elasticsearch" });
      } else {
        res
          .status(500)
          .json({ message: "Error setting up Elasticsearch request" });
      }
    } else {
      res.status(500).json({ message: "Unexpected error occurred" });
    }
  }
}

