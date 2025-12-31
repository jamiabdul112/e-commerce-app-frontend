import React from "react";
import { useQuery } from "@tanstack/react-query";
import { baseURL } from "../constants/baseUrl";

import SvgSpinner from "../utils/svgSpinner";
import { Link } from "react-router-dom";

function Product({ feedType }) {
    const endpoint =
        feedType === "All"
            ? `${baseURL}/api/product`
            : `${baseURL}/api/product/category/${feedType}`;

    const { data: products, isLoading, isError, error } = useQuery({
        queryKey: ["products", feedType],
        queryFn: async () => {
            const res = await fetch(endpoint, {
                method: "GET",
                credentials: "include",
            });
            const data = await res.json();
            if (!res.ok) {
                throw new Error(data.error || data.message || "Failed to fetch products");
            }
            return data;
        },
        // cache for 5 minutes
    });

    if (isLoading) {
        return (
            <div style={{ display: "flex", justifyContent: "center", padding: "2rem", marginTop:"5rem" }}>
                <SvgSpinner size={36} color="#00d17e" stroke={4} />
            </div>
        );
    }

    if (isError) {
        return <p style={{ color: "red", textAlign: "center" }}>{error.message}</p>;
    }

    if (!products || products.length === 0) {
        return <p style={{ textAlign: "center", marginTop:"5rem" }}>No products found in {feedType}</p>;
    }

    return (
        <div className="product-grid">
            {products.map((product) => (
                <Link
                    to={`/product/${product.slug}`}
                    key={product._id}
                    style={{ textDecoration: "none", color: "inherit" }}
                >
                <div key={product._id} className="product-card">
                    {product.images && <img src={product.images} alt={product.title} className="product-image" /> }

                    <h3 className="product-title">{product.title}</h3>
                    <p className="product-price">
                        ₹{product.price} {product.currency || "INR"}
                    </p>
                </div>
                </Link> 
            ))}
        </div>
    );
}

export default Product;
