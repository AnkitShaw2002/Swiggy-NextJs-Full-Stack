import axios from "axios";
import { getCookie, setCookie, deleteCookie } from "cookies-next";
import { toast } from "sonner";

// Local: http://localhost:4000
// Deploy: <mention deploy link here>
export const BaseURL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export const AxiosInstance = axios.create({
  baseURL: BaseURL,
  withCredentials: true,
});

let signedOut = false;

export const markSignedOut = () => {
  signedOut = true;
};

export const markSignedIn = () => {
  signedOut = false;
};

const clearSessionCookies = () => {
  deleteCookie("token");
  deleteCookie("refreshtoken");
  deleteCookie("role");
};

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
      !originalRequest.url?.includes("/auth/login") &&
      !originalRequest.url?.includes("/refresh-token")
    ) {
      console.log("error in interceptor", error.response);
      originalRequest._retry = true;

      const refreshToken = getCookie("refreshtoken");

      if (signedOut || !refreshToken) {
        clearSessionCookies();
        return Promise.reject(error);
      }

      try {
        const response = await axios.post(`${BaseURL}/refresh-token`, {
          refreshToken,
        });
        console.log("refresh token response", response);

        if (signedOut) {
          clearSessionCookies();
          return Promise.reject(error);
        }

        const newaccessToken = response?.data?.accessToken;
        console.log("newwwww", newaccessToken);

        setCookie("token", newaccessToken, {
          maxAge: 60 * 15,
          path: "/",
          sameSite: "lax",
        });

        const rotatedRefreshToken = response?.data?.refreshToken;
        if (rotatedRefreshToken) {
          setCookie("refreshtoken", rotatedRefreshToken, {
            maxAge: 60 * 60 * 24 * 7,
            path: "/",
            sameSite: "lax",
          });
        }

        originalRequest.headers.Authorization = `Bearer ${newaccessToken}`;
        return AxiosInstance(originalRequest);
      } catch (error) {
        console.log("error", error);
        clearSessionCookies();
        if (!signedOut) {
          toast.error("Session expired. Please log in again.", {
            id: "session-expired",
          });
        }
        return Promise.reject(error);
      }
    }
    return Promise.reject(error);
  },
);

export const getImageUrl = (url?: string | null): string => {
  if (!url) return "";
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  return `${BaseURL}${url.startsWith("/") ? "" : "/"}${url}`;
};

export default AxiosInstance;
