import axios from 'axios';

// TODO: вынести в .env
const baseURL = 'http://localhost:5000';

export const httpClient = axios.create({
  baseURL,
  timeout: 10000, // 10 seconds
  headers: { 'Content-Type': 'application/json' },
});

