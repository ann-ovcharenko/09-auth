import axios from "axios";

const baseURL = `${process.env.NEXT_PUBLIC_API_URL}/api`;

export const API = axios.create({
  baseURL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

if (!process.env.NEXT_PUBLIC_API_URL) {
  console.warn("Попередження: NEXT_PUBLIC_API_URL не визначено в .env файлі");
}
