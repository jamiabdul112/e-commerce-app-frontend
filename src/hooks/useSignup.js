import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { api } from "../utils/api";

export const useSignup = () => {
    return useMutation({
        mutationFn: async (formData) => {
            const { data } = await api.post("/api/auth/signup", formData);
            return data;
        },
        onSuccess: () => {
            toast.success("User created successfully!");
        },
        onError: (err) => {
            toast.error(err.response?.data?.error || "Signup failed");
        },
    });
};
