# frontend/Dockerfile
FROM node:18-alpine

WORKDIR /app

# package.json と package-lock.json をコピー
COPY package*.json ./

# 依存関係をインストール（npm ci ではなく npm install を使用）
RUN npm install

# ソースコードをコピー
COPY . .

# 開発サーバーを起動
EXPOSE 3001
CMD ["npm", "run", "dev", "--", "-p", "3001"]