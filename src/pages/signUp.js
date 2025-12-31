import React, { useState } from "react";
import { FaUser } from "react-icons/fa";
import { MdDriveFileRenameOutline, MdEmail, MdPassword } from "react-icons/md";
import { FaAddressBook } from "react-icons/fa6";
import { Link } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import '../css/signup.css'
import { baseURL } from "../constants/baseUrl";
import toast from "react-hot-toast";

function SignUp() {
    const [formData, setFormData] = useState({
        username: "",
        fullName: "",
        email: "",
        password: "",
        address: "",
    });

    const queryClient = useQueryClient()
    /* const { mutate: signup, isPending, isError, error } = useSignup(); */
    const {mutate : signup, isPending, isError, error}= useMutation({
        mutationFn: async({ username, fullName, email, password, address })=>{
            try {
                const res = await fetch(`${baseURL}/api/auth/signup`, {
                    method:"POST", 
                    credentials : "include",
                    headers : {
                        "Content-Type":"application/json", 
                        "Accept":"application/json"
                    },
                    body: JSON.stringify({ username, fullName, email, password, address })
                })
                const data = await res.json()
                if(!res.ok){
                    throw new Error( data.error || "Something went wrong")
                }
            } catch (error) {
                console.log(error)
                throw error
            }
        }, 
        onSuccess : ()=>{
            toast.success("User Created Successfully")
            queryClient.invalidateQueries({
                queryKey: ["authUser"],
            });
        }
    })

    const handleSubmit = (e) => {
        e.preventDefault();
        signup(formData);
    };

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
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
                            onChange={handleInputChange}
                            value={formData.username}
                        />
                    </label>
                    <label>
                        <MdDriveFileRenameOutline />
                        <input
                            type="text"
                            placeholder="Full Name"
                            name="fullName"
                            onChange={handleInputChange}
                            value={formData.fullName}
                        />
                    </label>
                    <label>
                        <MdEmail />
                        <input
                            type="email"
                            placeholder="Email"
                            name="email"
                            onChange={handleInputChange}
                            value={formData.email}
                        />
                    </label>
                    <label>
                        <MdPassword />
                        <input
                            type="password"
                            placeholder="Password"
                            name="password"
                            onChange={handleInputChange}
                            value={formData.password}
                        />
                    </label>
                    <label>
                        <FaAddressBook />
                        <textarea
                            placeholder="Address"
                            name="address"
                            onChange={handleInputChange}
                            value={formData.address}
                        />
                    </label>

                    <button>{isPending ? "Loading..." : "Sign Up"}</button>
                    {isError && <p style={{ color: "red" }}>{error.message}</p>}
                </form>
                <div>
                    <p className="already-p">
                        Already have an account?
                        <span className="login-click">
                            <Link to="/login">Login in</Link>
                        </span>
                    </p>
                </div>
            </div>

            
        </div>
        </div>
    );
}

export default SignUp;
