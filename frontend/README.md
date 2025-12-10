# ChatGPT UI - React App

A beautiful ChatGPT-like UI built with React and Vite.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Configure API URL:
   - Copy `.env.example` to `.env`
   - Set `VITE_API_URL` to your friend's API endpoint
   ```env
   VITE_API_URL=https://your-friend-api.com/api
   ```

3. Start the development server:
```bash
npm run dev
```

## API Integration

The app connects to an external API. Make sure the API endpoints match:

- **POST** `/messages` - Save a message
  ```json
  {
    "role": "user" | "bot",
    "text": "Message text",
    "conversationId": "default",
    "title": "Chat Title (optional)"
  }
  ```

- **GET** `/messages/:conversationId` - Get messages for a conversation
  - Returns array of messages with: `id`, `role`, `text`

- **GET** `/conversations` - Get all conversations (optional)

## Environment Variables

- `VITE_API_URL` - Your friend's API base URL
