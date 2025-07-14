# Baseball Stats App

Next.js + FastAPI + Docker を使用したフルスタックWebアプリケーション

## 技術スタック

- **Frontend**: Next.js 14.2.6 + TypeScript + Tailwind CSS
- **Backend**: FastAPI + Python 3.11
- **コンテナ化**: Docker + Docker Compose
- **開発環境**: ポート3001 (Frontend), 8000 (Backend)

## プロジェクト構成

```
baseball-stats-app/
├── frontend/          # Next.js フロントエンド
│   ├── src/
│   ├── package.json
│   └── Dockerfile
├── backend/           # FastAPI バックエンド
│   ├── main.py
│   ├── requirements.txt
│   └── Dockerfile
├── docker-compose.yml # Docker Compose設定
└── README.md
```

## セットアップ

### 前提条件

- Docker Desktop がインストールされていること
- Git がインストールされていること

### 環境構築

1. **リポジトリのクローン**
   ```bash
   git clone https://github.com/YOUR_USERNAME/baseball-stats-app.git
   cd baseball-stats-app
   ```

2. **Docker Composeで起動**
   ```bash
   docker-compose up --build
   ```

3. **アクセス確認**
   - Frontend: http://localhost:3001
   - Backend API: http://localhost:8000
   - API Documentation: http://localhost:8000/docs

## 開発

### フロントエンド開発

```bash
cd frontend
npm install
npm run dev
```

### バックエンド開発

```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

## API エンドポイント

- `GET /` - ヘルスチェック
- `GET /health` - サーバーステータス
- `GET /test` - テストエンドポイント

## 環境変数

フロントエンド：
- `NEXT_PUBLIC_API_URL`: バックエンドAPIのURL（デフォルト: http://localhost:8000）

## 貢献

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## ライセンス

This project is licensed under the MIT License.

## 作成者

作成日: 2025年7月14日