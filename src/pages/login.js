import React, { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { baseURL } from "../constants/baseUrl";
import toast from "react-hot-toast";
import { FaUser } from "react-icons/fa";
import {  MdPassword } from "react-icons/md";

import { Link } from "react-router-dom";

function Login() {
    const [formData, setFormData] = useState({ username: "", password: "" });

    const queryClient = useQueryClient()
    const { mutate: login, isPending, isError, error } = useMutation({
        mutationFn: async ({ username, password }) => {
            const res = await fetch(`${baseURL}/api/auth/login`, {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                },
                body: JSON.stringify({ username, password }),
            });
            const data = await res.json();
            if (!res.ok) {
                throw new Error(data.error || data.message || "Login failed");
            }
            return data;
        },
        onSuccess: () => {
            toast.success("Logged in successfully");
            queryClient.invalidateQueries({
                queryKey:["authUser"]
            })
        },
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        login(formData);
    };


    return (
        <div className="signup-wrapper">
            <div className="signup-page">
                <div className="signup-top">
                    <h1 className="signup-h1">AbdulMart</h1>
                    <p className="signup-p">Fresh picks daily, Abdul's Maligai delivers.</p>
                </div>

                <div className="signup-middle">
                    <form className="signup-form" onSubmit={handleSubmit}>
                        <label>
                            <FaUser />
                            <input
                                type="text"
                                placeholder="Username"
                                name="username"
                                
                                value={formData.username}
                                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                            />
                        </label>
                        
                       
                        <label>
                            <MdPassword />
                            <input
                                type="password"
                                placeholder="Password"
                                name="password"
                                
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            />
                        </label>
                        

                        <button>{isPending ? "Loading..." : "Login"}</button>
                        {isError && <p style={{ color: "red" }}>{error.message}</p>}
                    </form>
                    <div>
                        <p className="already-p">
                            Did'nt have any account?
                            <span className="login-click">
                                <Link to="/signup">Sign Up</Link>
                            </span>
                        </p>
                    </div>
                </div>


            </div>
        </div>

    );
}

export default Login;
