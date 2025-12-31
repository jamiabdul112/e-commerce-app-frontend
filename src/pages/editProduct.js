import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { baseURL } from "../constants/baseUrl";
import SvgSpinner from "../utils/svgSpinner";
import toast from "react-hot-toast";
import { FaAngleLeft } from "react-icons/fa6";
import { Link } from "react-router-dom";

function EditProductPage() {
    const { slug: urlSlug } = useParams();
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const [formData, setFormData] = useState({
        title: "",
        slug: "",
        category: "",
        price: "",
        stock: "",
        description: "",
        imageFile: null, // Only filled if a NEW image is picked
        imagePreview: "",
    });

    const { data: product, isLoading } = useQuery({
        queryKey: ["product", urlSlug],
        queryFn: async () => {
            const res = await fetch(`${baseURL}/api/product/${urlSlug}`, {
                method: "GET",
                credentials: "include",
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Failed to fetch product");
            return data;
        },
    });

    useEffect(() => {
        if (product) {
            setFormData({
                title: product.title || "",
                slug: product.slug || "",
                category: product.categories || "",
                price: product.price || "",
                stock: product.stock || "",
                description: product.description || "",
                imageFile: null, // Reset to null so we don't re-upload old image
                imagePreview: product.images || "",
            });
        }
    }, [product]);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData({
                    ...formData,
                    imageFile: reader.result,
                    imagePreview: reader.result,
                });
            };
            reader.readAsDataURL(file);
        }
    };

    const updateMutation = useMutation({
        mutationFn: async () => {
            // ✅ Build payload dynamically
            const payload = {
                title: formData.title,
                slug: formData.slug,
                categories: formData.category,
                price: formData.price,
                stock: formData.stock,
                description: formData.description,
            };

            // ✅ Only send 'images' if a new one was actually chosen
            if (formData.imageFile) {
                payload.images = formData.imageFile;
            }

            const res = await fetch(`${baseURL}/api/product/${urlSlug}`, {
                method: "PUT",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Update failed");
            return data;
        },
        onSuccess: (data) => {
            toast.success("Product updated!");
            queryClient.invalidateQueries({ queryKey: ["product", urlSlug] });
            queryClient.invalidateQueries({ queryKey: ["products"] });
            navigate(`/product/${data.product?.slug || urlSlug}`);
        },
        onError: (err) => toast.error(err.message),
    });

    if (isLoading) return <div style={{ textAlign: "center", padding: "50px" }}><SvgSpinner size={36} /></div>;

    return (
        <div className="add-product-wrapper">
        <div className="add-product-page">
                <div className='profile-top'>
                    <Link to='/' style={{ textDecoration: "none" }}>
                        <FaAngleLeft style={{ color: "black" }} />
                    </Link>
                    <p className='profile-p'>Edit Product</p>
                    <div className='hidden'></div>
                </div>
                <form className="add-product-form" onSubmit={(e) => { e.preventDefault(); updateMutation.mutate(); }}>
                <input type="text" name="title" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} placeholder="Title" required />
                <input type="text" name="slug" value={formData.slug} onChange={(e) => setFormData({ ...formData, slug: e.target.value })} placeholder="Slug" required />

                <select value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} required>
                    <option value="">Select Category</option>
                    {["Masala", "Soap", "Snacks", "Juice", "Shampoo", "Cigarettes", "Chocolates", "Pulses", "Vegetables"].map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                    ))}
                </select>

                <input type="number" name="price" value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} placeholder="Price" required />
                <input type="number" name="stock" value={formData.stock} onChange={(e) => setFormData({ ...formData, stock: e.target.value })} placeholder="Stock" required />
                

                    <label htmlFor="imageUpload" className="custom-image-button">+ Change Image</label>
                <input type="file" id="imageUpload" accept="image/*" style={{ display: "none" }} onChange={handleImageChange} />

                {formData.imagePreview && (
                        <img src={formData.imagePreview} alt="Preview" className="add-product-imgs-preview" />
                )}

                    <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} placeholder="Description"></textarea>

                <button type="submit" disabled={updateMutation.isPending}>
                    {updateMutation.isPending ? "Saving..." : "Save Changes"}
                </button>
                <button type="button" onClick={() => navigate(-1)} style={{ background: "gray" }}>Cancel</button>
            </form>
        </div>
        </div>
    );
}

export default EditProductPage;