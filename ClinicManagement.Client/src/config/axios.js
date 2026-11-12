import axios from "axios";

const instance = axios.create({
    baseURL: "https://localhost:7032",
    withCredentials: true,
});

instance.interceptors.request.use((config) => {
    const token = sessionStorage.getItem("accessToken");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

const clearSessionAndRedirect = () => {
    sessionStorage.clear();
    if (window.location.pathname !== "/login") {
        window.location.assign("/login");
    }
};

let refreshPromise = null;

const refreshAccessToken = async () => {
    if (!refreshPromise) {
        refreshPromise = axios
            .post(`${instance.defaults.baseURL}/authentication/refresh-token`, null, {
                withCredentials: true,
            })
            .then((response) => {
                const data = response?.data?.data ?? response?.data?.Data;
                const newToken = data?.token ?? data?.Token;
                if (!newToken) throw new Error("No access token in refresh response.");
                sessionStorage.setItem("accessToken", newToken);
                return newToken;
            })
            .finally(() => {
                refreshPromise = null;
            });
    }
    return refreshPromise;
};

instance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error?.config;
        const status = error?.response?.status;
        const isRefreshEndpoint = originalRequest?.url?.includes("/authentication/refresh-token");

        if (status === 401 && originalRequest && !originalRequest._retry && !isRefreshEndpoint) {
            originalRequest._retry = true;
            try {
                const newToken = await refreshAccessToken();
                originalRequest.headers.Authorization = `Bearer ${newToken}`;
                return instance(originalRequest);
            } catch {
                clearSessionAndRedirect();
                return Promise.reject(error);
            }
        }

        if (status === 401 && isRefreshEndpoint) {
            clearSessionAndRedirect();
        }

        return Promise.reject(error);
    },
);

export default instance;
