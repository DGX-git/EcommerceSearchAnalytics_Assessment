import apiClient from "./apiClient";

export const fetchFromAPI = async <T,>(endpoint: string): Promise<T> => {
  try {
    const { data } = await apiClient.get<T>(endpoint);
    return data;
  } catch (error) {
    console.error(`Error fetching from ${endpoint}:`, error);
    throw error;
  }
};