import axios from 'axios';

export const axiosProxy = axios.create({
  baseURL: 'http://localhost:4000/',
});
