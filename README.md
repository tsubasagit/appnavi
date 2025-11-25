# AppNavi - Transform Excel Data into Web Apps

<div align="center">

**Excelから、5分でWebアプリへ。コードなし、コストなし、サーバーなし。**

[![GitHub Pages](https://img.shields.io/badge/GitHub%20Pages-Live-blue?style=for-the-badge)](https://tsubasagit.github.io/appnavi/)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)
[![Open Source](https://img.shields.io/badge/Open%20Source-Yes-orange?style=for-the-badge)](https://github.com/tsubasagit/appnavi)

[English](./README.md) | [日本語](./README_JP.md)

</div>

---

## 🎯 Mission & Vision

**Mission:** "Make data-driven decisions accessible to everyone."

**Vision:** "誰もがテクノロジーを使いこなし、自らの手でアイデアを形にできる社会を実現する"

Transform Excel-managed data into powerful web applications in 5 minutes. No code, no cost, no server management required.

**Target Users:**
- 🏢 Small and medium-sized business owners (IT beginners)
- 🏛️ Local government officials (DX promoters)
- 📊 Non-profit organizations (data managers)

🔗 **Live Demo**: [View on GitHub Pages](https://tsubasagit.github.io/appnavi/)

## Architecture Philosophy

**Serverless Architecture - Zero Infrastructure Management**

AppNavi is built on a completely serverless architecture, where all infrastructure is managed by external services:

- **Hosting**: GitHub Pages (Free)
- **Database**: Firebase Firestore (Free tier available) / localStorage (Fallback)
- **Authentication**: AppNaviID (Required) + Firebase Authentication (Optional)
- **Storage**: Firebase Storage (Free tier available)
- **Integration**: Google Sheets API (Free)

### AppNaviID System

AppNavi uses a unique ID system called **AppNaviID** for user identification:

- **Required**: AppNaviID is mandatory for all features
- **Format**: UUID v4 format (`xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx`)
- **Storage**: Stored in browser's localStorage
- **Purpose**: User data isolation and security
- **Public Code Compatible**: Works even when code is downloaded and run locally

This design allows the code to be fully open source while maintaining user data separation.

**Benefits for Small Business Owners:**
- 💰 **Zero monthly cost** (free tier sufficient for small businesses)
- 🚀 **Zero server management** (fully managed by Google/GitHub)
- 🔒 **Enterprise-grade security** (automatic updates and monitoring)
- 📈 **Automatic scaling** (grows with your business)
- ⏰ **Zero maintenance time** (focus on your business, not IT)

This approach allows small business owners to focus on their core business without worrying about IT infrastructure management.

See `ARCHITECTURE_STRATEGY.md` for detailed architecture and cost comparison.

## 📚 Documentation

- **[DEVELOPMENT_GUIDE.md](./DEVELOPMENT_GUIDE.md)**: Development guidelines, architecture, and technical details
- **[SPECIFICATION.md](./SPECIFICATION.md)**: Complete specification document
- **[VISION.md](./VISION.md)**: Vision and mission statement
- **[CONTRIBUTING.md](./CONTRIBUTING.md)**: Contribution guide for developers
- **[FIREBASE_SETUP.md](./FIREBASE_SETUP.md)**: Firebase setup guide (optional)
- **[QUICK_START.md](./QUICK_START.md)**: Quick start guide for users

## ✨ Features

- 📊 **Instant App Creation from Excel/CSV**: Upload a file and automatically generate a data management app in 5 minutes
- 🔄 **Google Spreadsheets Integration**: Real-time synchronization with Google Sheets (familiar Excel-like interface)
- 📈 **Data Visualization**: Automatic graph generation and analytics
- 🎨 **UI Builder**: Intuitive form design, no coding required
- 💾 **Data Persistence**: Secure data storage with Firebase Firestore (free tier available)
- 🔓 **100% Open Source**: MIT License, fully transparent, community-driven
- 💰 **Completely Free**: Zero monthly cost for small businesses
- 🚀 **Zero Server Management**: Fully managed by Firebase/GitHub Pages

## 🌟 Why AppNavi?

### For Small Business Owners

- **💰 Cost Savings**: $0/month (vs $700+/month for self-hosted servers)
- **⏰ Time Savings**: Zero IT management time (vs 40-80 hours/month)
- **🚀 Instant Setup**: 5 minutes to create your first app
- **🔒 Data Ownership**: Your data stays yours, no vendor lock-in

### For Local Governments

- **💰 Budget Friendly**: Completely free, no additional budget required
- **🔓 Open Source**: Transparent, auditable, secure
- **📊 Data Utilization**: Transform Excel assets into web apps instantly
- **🌐 Community**: Share knowledge with other municipalities

## 📊 Social Impact

**Supporting Digital Transformation for:**
- 3 million small businesses in Japan
- 1,700 local governments
- Reducing digital divide
- Promoting regional revitalization

## Setup

### 0. ローカルサーバーの起動（開発時）

**重要**: `file://`プロトコルで直接開くと、Google Sheets APIやFirebaseなどの外部リソースにアクセスできません。必ずローカルサーバーを起動してください。

**方法1: バッチファイルを使用（推奨）**
```bash
# Windowsの場合
start-local-server.bat
```

**方法2: Python 3を使用**
```bash
python -m http.server 8000
```
ブラウザで `http://localhost:8000` を開く

**方法3: Node.jsを使用**
```bash
npx serve -p 8000
```
ブラウザで表示されたURLを開く

**方法4: VS CodeのLive Server拡張機能**
1. VS Codeでプロジェクトを開く
2. `index.html`を右クリック
3. "Open with Live Server"を選択

### 1. Create a Firebase Project

1. Access [Firebase Console](https://console.firebase.google.com/)
2. Create a new project
3. Enable Firestore Database (start in production mode)
4. Enable Authentication (if needed)

### 2. Add Firebase Configuration

Open `firebase-config.js` and replace the values with your actual Firebase project settings:

```javascript
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT_ID.appspot.com",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
};
```

**How to get these values:**
1. Select your project in Firebase Console
2. Open Project Settings (gear icon)
3. Click "Add web app" in the "Your apps" section
4. Copy the displayed configuration values

### 3. Firestore Security Rules (Development)

Use these rules during development (restrict appropriately for production):

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /apps/{appId} {
      allow read, write: if request.auth != null || request.auth == null;
    }
  }
}
```

### 4. Google Sheets API (Optional)

To use Google Sheets API and enable write operations:

**Default Client ID**: A demo Client ID is pre-configured. You can use it immediately, but for production use, we recommend setting your own Client ID.

**To use your own Client ID**:

1. Create a project in [Google Cloud Console](https://console.cloud.google.com/)
2. Enable Google Sheets API
3. Create OAuth 2.0 credentials (Web application)
   - Set **Authorized JavaScript origins** to your domain (e.g., `https://tsubasagit.github.io` for GitHub Pages)
   - **Security Note**: Do not add `localhost` to production Client ID (create a separate Client ID for local development if needed)
4. Set the Client ID in AppNavi:
   - Open the app settings (API & Integration Settings)
   - Enter your OAuth 2.0 Client ID
   - Save

**Security Note for Open Source Projects**:
- ✅ **Client ID is safe to expose**: OAuth 2.0 Client IDs are designed to be public (they're visible in browser code)
- ❌ **Client Secret must never be exposed**: Only used in server-side applications (not needed for browser-based apps)
- The default Client ID is configured with restricted authorized origins for security
- Users should set their own Client ID for production use

See `GOOGLE_AUTH_SETUP.md` for detailed setup instructions.

**Note**: Google API Client Library is required:
```html
<script src="https://apis.google.com/js/api.js"></script>
<script src="https://apis.google.com/js/platform.js"></script>
```

See `GOOGLE_AUTH_SETUP.md` for detailed setup instructions.

## Usage

### Basic Flow

1. **Create an app from Dashboard**
   - Upload Excel/CSV file
   - Review and adjust data structure
   - Create app

2. **Edit your app**
   - Data tab: View and add data
   - UI tab: Customize forms
   - Graph tab: Visualize data
   - Settings tab: App settings and integrations

3. **Google Sheets Integration (Optional)**
   - Open "API & Integration Settings" in Settings tab
   - Enter Google Spreadsheet URL
   - Start integration

## Database Structure

### Firestore Collection: `apps`

```javascript
{
  id: string (auto-generated),
  name: string,
  description: string,
  icon: string,
  color: string,
  createdAt: Timestamp,
  updatedAt: Timestamp,
  columns: Array<{
    name: string,
    type: 'text' | 'number' | 'date' | 'datetime' | 'select',
    required: boolean,
    options?: Array<string> // if type === 'select'
  }>,
  data: Array<Record<string, any>>,
  userId: string // authenticated user ID (future implementation)
}
```

## GitHub Pages Deployment

The app is configured for GitHub Pages deployment. To enable:

1. Go to repository **Settings** > **Pages**
2. Under **Source**, select:
   - Branch: `main`
   - Folder: `/ (root)`
3. Click **Save**
4. Wait a few minutes for deployment
5. Access your app at: `https://tsubasagit.github.io/appnavi/`

**Note**: The `.nojekyll` file is included to disable Jekyll processing, and GitHub Actions workflow is configured for automatic deployment on every push.

See `GITHUB_PAGES_SETUP.md` for detailed instructions.

## Development

### Local Development

1. Download files locally
2. Configure `firebase-config.js`
3. Run local server (e.g., `python -m http.server`)
4. Access in browser

### Firebase Fallback

If Firebase is unavailable, the app automatically falls back to `localStorage`.
This is convenient for development and demos, but Firebase is strongly recommended for production.

## Troubleshooting

### Firebase Connection Error

- Verify Firebase configuration is correct
- Check browser console for errors
- Ensure Firestore is enabled

### Google Sheets API Error

- OAuth authentication is required
- Verify API is enabled
- Ensure correct credentials are used

## FAQ（よくある質問）

よくある質問とトラブルシューティングについては、[FAQ.md](./FAQ.md) をご覧ください。

主な内容：
- Googleスプレッドシート連携のエラー対処法
- サンプルスプレッドシートのURL
- 認証について
- データ保存先について

## Future Implementation

- [ ] Authentication feature (user management)
- [ ] Complete Google Sheets API implementation
- [ ] Real-time synchronization
- [ ] Export functionality
- [ ] Sharing feature

## License

MIT License
