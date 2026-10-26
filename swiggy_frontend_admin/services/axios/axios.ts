import axios from "axios";
import { getCookie, setCookie } from "cookies-next";

export const BaseURL = "/api";

export const AxiosInstance = axios.create({
  baseURL: BaseURL,

  withCredentials: true,
});

AxiosInstance.interceptors.request.use(
  function (config) {
    const token = getCookie("token");
    console.log(token, "token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  function (error) {
    return Promise.reject(error);
  },
);

AxiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    console.log(error, "error");
    const originalRequest = error.config;

    if (
      (error.response?.status === 401 || error.response?.status === 403) &&
      !originalRequest._retry &&
      !originalRequest.url.includes("/auth/login")
    ) {
      console.log("error in interceptor", error.response);
      originalRequest._retry = true;

      const refreshToken = getCookie("refresh-token");


      try {
        const response = await axios.post(`${BaseURL}/refresh-token`, {
          refreshToken,
        });
        console.log("refresh token response", response);
        const newaccessToken = response?.data?.accessToken;

        console.log("newwwww", newaccessToken);
        setCookie("token", newaccessToken, {
          maxAge: 60 * 15,
          path: "/",
        });
        originalRequest.headers.Authorization = `Bearer ${newaccessToken}`;
        return AxiosInstance(originalRequest);
      } catch (error) {
        console.log("error", error);
        return Promise.reject(error);
      }
    }
    return Promise.reject(error);
  },
);
export default AxiosInstance;














