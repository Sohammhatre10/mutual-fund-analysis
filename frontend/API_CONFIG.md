# API Configuration Guide

## Setting Up Your Friend's API

1. Create a `.env` file in the root directory of this project

2. Add your friend's API URL:
   ```
   VITE_API_URL=https://your-friend-api.com/api
   ```

   Examples:
   - `VITE_API_URL=https://api.example.com/api`
   - `VITE_API_URL=https://your-api.herokuapp.com/api`
   - `VITE_API_URL=http://localhost:3001/api`

3. Restart your development server after creating/updating the `.env` file

## Expected API Endpoints

The frontend expects these endpoints:

### POST /messages
Save a new message
- **Body:**
  ```json
  {
    "role": "user" | "bot",
    "text": "Message text",
    "conversationId": "default",
    "title": "Chat Title (optional)"
  }
  ```
- **Response:** Should return the saved message with `id`, `role`, `text`

### GET /messages/:conversationId
Get all messages for a conversation
- **Response:** Array of messages, each with `id` (or `_id`), `role`, `text`

### GET /conversations (Optional)
Get all conversations
- **Response:** Array of conversation objects

## Notes

- The API service is flexible and handles different response formats
- If your friend's API uses different field names, we can adjust the mapping in `src/services/api.js`

