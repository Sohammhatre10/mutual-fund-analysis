/**
 * API service for communicating with the backend
 */

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

export async function getUserHistory(userName) {
  try {
    const response = await fetch(
      `${API_URL}/user_history/?user_name=${userName}`
    );
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data.history;
  } catch (error) {
    console.error("Error fetching user history:", error);
    return [];
  }
}

export async function searchStock(userName, query) {
  try {
    const response = await fetch(
      `${API_URL}/search_stock/?user_name=${userName}&query=${query}`
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
