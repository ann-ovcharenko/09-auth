import axios from 'axios';
import { cookies } from 'next/headers';

export const serverApi = axios.create({
  baseURL: 'https://notehub-api.goit.study',
  withCredentials: true,
});

serverApi.interceptors.request.use(async (config) => {
  try {
    const cookieStore = await cookies();
    const allCookies = cookieStore.toString();
    
    if (allCookies) {
      config.headers.Cookie = allCookies;
    }
  } catch (error) {
    console.warn("Cookies are not available in this context");
  }
  return config;
});