import axios from 'axios';
import { cookies } from 'next/headers';

export const serverApi = axios.create({
  baseURL: 'https://notehub-api.goit.study',
  withCredentials: true,
});

serverApi.interceptors.request.use(async (config) => {
  const cookieStore = await cookies();
  config.headers.Cookie = cookieStore.toString();
  return config;
});