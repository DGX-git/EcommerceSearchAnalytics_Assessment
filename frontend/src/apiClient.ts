import axios from 'axios';

const API_BASE_URL =
  process.env.REACT_APP_API_URL ||
  'https://ecommercesearchanalytics-assessment.onrender.com';

// Central axios instance so base URL is configured once
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default apiClient;
