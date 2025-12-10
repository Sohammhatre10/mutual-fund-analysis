/**
 * API service for communicating with the backend
 */

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

// Log API URL in development for debugging (remove in production if needed)
if (import.meta.env.DEV) {
  console.log("API URL:", API_URL);
}

export async function getUserHistory(user) {
  try {
    const response = await fetch(
      `${API_URL}/user_history/?user=${encodeURIComponent(user)}`
    );
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching user history:", error);
    return [];
  }
}

export async function searchStock(user, query) {
  try {
    const response = await fetch(
      `${API_URL}/search_stock/?user=${encodeURIComponent(
        user
      )}&query=${encodeURIComponent(query)}`
    );
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error searching stock:", error);
    throw error;
  }
}
