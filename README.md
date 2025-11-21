# AppNavi - Transform Excel Data into Web Apps

A tool to instantly create web applications from your Excel-managed data.

🔗 **Live Demo**: [View on GitHub Pages](https://tsubasagit.github.io/appnavi/)

## Features

- 📊 **Instant App Creation from Excel/CSV**: Upload a file and automatically generate a data management app
- 🔄 **Google Spreadsheets Integration**: Real-time synchronization with Google Sheets
- 📈 **Data Visualization**: Automatic graph generation
- 🎨 **UI Builder**: Intuitive form design
- 💾 **Data Persistence**: Secure data storage with Firebase Firestore

## Setup

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

To use Google Sheets API:

1. Create a project in [Google Cloud Console](https://console.cloud.google.com/)
2. Enable Google Sheets API
3. Create OAuth 2.0 credentials (Web application)
4. Replace `YOUR_CLIENT_ID` in `google-sheets-api.js`

**Note**: Google API Client Library is required:
```html
<script src="https://apis.google.com/js/api.js"></script>
<script src="https://apis.google.com/js/platform.js"></script>
```

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

## Future Implementation

- [ ] Authentication feature (user management)
- [ ] Complete Google Sheets API implementation
- [ ] Real-time synchronization
- [ ] Export functionality
- [ ] Sharing feature

## License

MIT License
