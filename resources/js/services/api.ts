import axios from "axios";

const api = axios.create({
    baseURL: "/api",
    headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
    },
});

const TOKEN_KEY = "tech-blog-token";

export const tokenService = {
    get: () => localStorage.getItem(TOKEN_KEY),
    set: (token: string) => localStorage.setItem(TOKEN_KEY, token),
    remove: () => localStorage.removeItem(TOKEN_KEY),
};

api.interceptors.request.use(
    config => {
        const token = tokenService.get();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    error => {
        return Promise.reject(error);
    },
);

api.interceptors.response.use(
    response => response,
    error => {
        if (error.response?.status === 401) {
            tokenService.remove();
            window.location.href = "/login";
        }
        return Promise.reject(error);
    },
);

export default api;
