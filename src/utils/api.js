import axios from "axios";

export const api = axios.create({
    baseURL: "http://localhost:5000", // adjust if different
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
    },
});
