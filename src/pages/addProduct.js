import React, { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { baseURL } from "../constants/baseUrl";
import toast from "react-hot-toast";
import { FaAngleLeft } from "react-icons/fa6";
import { Link } from 'react-router-dom';
import '../css/addProduct.css'

function AddProductPage() {
    const queryClient = useQueryClient();
    const [formData, setFormData] = useState({
        title: "",
        slug: "",
        category: "",
        price: "",
        stock: "",
        description: "",
        imageFile: null, // This will store the Base64 string
        imagePreview: "",
    });

    const categories = ["Masala", "Soap", "Snacks", "Juice", "Shampoo", "Cigarettes", "Chocolates", "Pulses", "Vegetables"];

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // ✅ CONVERT IMAGE TO BASE64
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData({
                    ...formData,
                    imageFile: reader.result, // Base64 string
                    imagePreview: reader.result,
                });
            };
            reader.readAsDataURL(file);
        }
    };

    const { mutate, isPending } = useMutation({
        mutationFn: async () => {
            // ✅ SEND AS JSON, NOT FORMDATA
            const res = await fetch(`${baseURL}/api/product`, {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    title: formData.title,
                    slug: formData.slug,
                    categories: formData.category, // Matches backend expectation
                    price: formData.price,
                    stock: formData.stock,
                    description: formData.description,
                    images: formData.imageFile, // The Base64 string
                }),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || data.message || "Failed to add product");
            return data;
        },
        onSuccess: () => {
            toast.success("Product added successfully!");
            queryClient.invalidateQueries({ queryKey: ["products"] });
            setFormData({
                title: "",
                slug: "",
                category: "",
                price: "",
                stock: "",
                description: "",
                imageFile: null,
                imagePreview: "",
            });
        },
        onError: (err) => {
            toast.error(err.message);
        },
    });

    const handleSubmit = (e) => {
        e.preventDefault();

        mutate();
    };

    return (
        <div className="add-product-wrapper">
        <div className="add-product-page">
                <div className='profile-top'>
                    <Link to='/' style={{ textDecoration: "none" }}>
                        <FaAngleLeft style={{ color: "black" }} />
                    </Link>
                    <p className='profile-p'>Add Product</p>
                    <div className='hidden'></div>
                </div>
            <form onSubmit={handleSubmit} className="add-product-form">
                <div className="form-top">
                <input type="text" name="title" placeholder="Add Title" value={formData.title} onChange={handleChange} required />
                <input type="text" name="slug" placeholder="Add-Slug (e.g., Milk-Aavin)" value={formData.slug} onChange={handleChange} required />

                <select name="category" value={formData.category} onChange={handleChange} required>
                    <option value="">Select Category</option>
                    {categories.map((cat) => (
                        <option key={cat} value={cat}>{cat}</option>
                    ))}
                </select>

                <input type="number" name="price" placeholder="Add Price" value={formData.price} onChange={handleChange} required />
                <input type="number" name="stock" placeholder="Stock Count" value={formData.stock} onChange={handleChange} required />



                <label htmlFor="imageUpload" className="custom-image-button">
                    + Add Image
                </label>
                <input
                    type="file"
                    id="imageUpload"
                    accept="image/*"
                    style={{ display: "none" }}
                    onChange={handleImageChange}
                />

                {formData.imagePreview && (
                    <img src={formData.imagePreview} alt="Preview" className="add-product-imgs-preview" />
                )}
                <textarea name="description" placeholder="Add Description" value={formData.description} onChange={handleChange}></textarea>
                    </div>
                <button type="submit" disabled={isPending}>
                    {isPending ? "Adding..." : "Add Product"}
                </button>
            </form>
        </div>
        </div>
    );
}

export default AddProductPage;