# Sử dụng một hình ảnh Node.js làm base image
FROM node:18.20-alpine

# Tạo thư mục làm việc
WORKDIR /app

# Sao chép package.json và package-lock.json để tận dụng Docker layer cache
COPY package*.json ./

# Cài đặt các dependencies
# RUN npm install --force


# Sao chép các file trong dự án vào container
COPY . .
RUN npm run build
# Expose cổng mặc định của ứng dụng
EXPOSE 3000

# Khởi chạy ứng dụng Next.js
CMD ["npm", "start"]
