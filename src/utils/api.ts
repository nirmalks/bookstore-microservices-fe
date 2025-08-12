import axios from 'axios';

const url = '/api';
export const api = axios.create({
  baseURL: url,
});
