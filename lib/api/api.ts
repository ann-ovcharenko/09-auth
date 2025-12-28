import axios from "axios";

// Прописуємо адресу явно, щоб виключити помилку зі змінними оточення
const baseURL = "https://notehub-backend.onrender.com/api";

export const API = axios.create({
  baseURL,
  withCredentials: true,
});

// Додамо лог, щоб ви бачили в консолі браузера, куди йдуть запити
console.log("API baseURL is set to:", baseURL);