import axios from "axios";

const options = {
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  withCredentials: true,
  timeout: 10000,
};

const API = axios.create(options);

export const APIRefresh = axios.create(options);
APIRefresh.interceptors.response.use((response) => response);

// Interceptor: hanya jalankan logic refresh untuk 401 jika
// request TIDAK memiliki header 'x-skip-refresh'
API.interceptors.response.use(
  (response) => response,

  async (error) => {
    if (!error.response) {
      return Promise.reject(error);
    }

    const { data, status } = error.response;

    // Jika request punya header x-skip-refresh, jangan lakukan retry/refresh
    const skipRefresh =
      error.config && error.config.headers && error.config.headers["x-skip-refresh"];

    if (status === 401 && !skipRefresh) {
      try {
        await APIRefresh.get("/auth/refresh");
        // ulangi request awal (perhatikan: APIRefresh tidak memiliki interceptor retry)
        return APIRefresh(error.config);
      } catch (err) {
        // jika gagal refresh, arahkan ke root (atau halaman login)
        window.location.href = "/";
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);

export default API;
