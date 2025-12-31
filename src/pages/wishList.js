import React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { baseURL } from "../constants/baseUrl";
import SvgSpinner from "../utils/svgSpinner";
import { FaHeart } from "react-icons/fa";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import { FaAngleLeft } from "react-icons/fa6";
import '../css/wishlist.css'

function WishlistPage() {
    const queryClient = useQueryClient();

    // ✅ Fetch wishlist products
    const { data: wishlist, isLoading, isError, error } = useQuery({
        queryKey: ["wishlist"],
        queryFn: async () => {
            const res = await fetch(`${baseURL}/api/wishlist`, {
                method: "GET",
                credentials: "include",
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || data.message || "Failed to fetch wishlist");
            return data; // should be array of product objects
        },
    });

    // ✅ Mutation: remove product from wishlist
    const removeMutation = useMutation({
        mutationFn: async (productId) => {
            const res = await fetch(`${baseURL}/api/wishlist/remove`, {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ productId }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || data.message || "Failed to remove from wishlist");
            return data;
        },
        onSuccess: () => {
            toast.success("Removed from wishlist");
            queryClient.invalidateQueries({ queryKey: ["wishlist"] });
        },
    });

    if (isLoading) {
        return (
            <div style={{ display: "flex", justifyContent: "center", padding: "2rem" }}>
                <SvgSpinner size={36} color="#00d17e" stroke={4} />
            </div>
        );
    }

    if (isError) {
        return <p style={{ color: "red", textAlign: "center" }}>{error.message}</p>;
    }

    if (!wishlist || wishlist.length === 0) {
        return <p style={{ textAlign: "center", display: "flex", justifyContent: "center", alignContent: "center", marginTop: "18rem" }}>Your wishlist is empty, Go back to&nbsp;<Link to="/" style={{ color:"black"}}>Home</Link></p>;
    }

    return (
        <div className="wishlist-wrapper">
        <div className="wishlist-page">
            <div className='profile-top'>
                <Link to='/' style={{textDecoration:"none"}}>
                <FaAngleLeft style={{color:"black"}}/>
                </Link>
                <p className='profile-p'>Wishlist</p>
                <div className='hidden'></div>
            </div>
            <div className="product-grid">
                {wishlist.map((product) => (
                    <div key={product._id} className="wishlist-card">
                        <Link to={`/product/${product.slug}`} style={{ textDecoration: "none", color: "inherit" }}>
                            {product.images && (
                                <img src={product.images} alt={product.title} className="wishlist-image" />
                            )}
                            <div className="right-wish-info">
                            <h3>{product.title}</h3>
                            <p>₹{product.price} {product.currency}</p>
                            </div>
                        </Link>
                        <button
                            className="remove-btn"
                            onClick={() => removeMutation.mutate(product._id)}
                            style={{ background: "none", border: "none", cursor: "pointer" }}
                        >
                            <FaHeart color="red" size={20} /> Remove
                        </button>
                    </div>
                ))}
            </div>
        </div>
        </div>
    );
}

export default WishlistPage;
