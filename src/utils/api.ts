import axios from 'axios';

const url = '/api/v1';
export const api = axios.create({
  baseURL: url,
});
