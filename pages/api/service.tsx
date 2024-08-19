import axios from 'axios';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { index, body } = req.body;

  // Xác định URL động từ `index`
  const url = `http://172.17.17.121:9202/${index}`;

  try {
    const response = await axios({
      method: 'get',  // Thường là POST khi bạn gửi dữ liệu trong body
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
    // Gửi phản hồi lỗi
    if (error.response) {
      res.status(error.response.status).json(error.response.data);
    } else if (error.request) {
      res.status(500).json({ message: "No response received from Elasticsearch" });
    } else {
      res.status(500).json({ message: "Error setting up Elasticsearch request" });
    }
  }
}
