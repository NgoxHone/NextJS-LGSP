import axios, { AxiosError } from 'axios';
import type { NextApiRequest, NextApiResponse } from 'next';

interface ElasticsearchErrorResponse {
  message: string;
  status?: number;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { index, body } = req.body;

  // Xác định URL động từ `index`
  const url = `http://172.17.17.121:9202/${index}`;

  try {
    const response = await axios({
      method: 'post',  // Sử dụng POST khi bạn gửi dữ liệu trong body
      url: url,
      headers: {
        'Content-Type': 'application/json'
      },
      data: body  // Sử dụng toàn bộ `body` từ yêu cầu client
    });

    // Gửi phản hồi JSON thành công
    res.status(200).json(response.data);
  } catch (error) {
    console.error("Elasticsearch Axios Error:", error);

    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError;

      // Gửi phản hồi lỗi với thông tin chi tiết từ axios
      if (axiosError.response) {
        res.status(axiosError.response.status).json(axiosError.response.data);
      } else if (axiosError.request) {
        res.status(500).json({ message: "No response received from Elasticsearch" });
      } else {
        res.status(500).json({ message: "Error setting up Elasticsearch request" });
      }
    } else {
      // Xử lý các loại lỗi khác không phải do axios
      res.status(500).json({ message: "Unexpected error occurred" });
    }
  }
}
