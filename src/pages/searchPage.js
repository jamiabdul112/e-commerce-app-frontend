import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { baseURL } from "../constants/baseUrl";
import SvgSpinner from "../utils/svgSpinner";
import { FaAngleLeft } from "react-icons/fa6";
import { IoCartOutline } from "react-icons/io5";
import { Link } from "react-router-dom";
import '../css/search.css'
import { IoIosSearch } from "react-icons/io";


function SearchPage() {
    const [searchTerm, setSearchTerm] = useState("");

    // ✅ Fetch all products
    const { data: products, isLoading, isError, error } = useQuery({
        queryKey: ["products"],
        queryFn: async () => {
            const res = await fetch(`${baseURL}/api/product`, {
                method: "GET",
                credentials: "include",
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Failed to fetch products");
            return data;
        },
    });

    // ✅ Filter logic
    const filteredProducts = products?.filter((p) => {
        const term = searchTerm.toLowerCase();
        return (
            p.title.toLowerCase().includes(term) ||
            p.slug.toLowerCase().includes(term) ||
            (p.categories && p.categories.toLowerCase().includes(term)) ||
            (p.description && p.description.toLowerCase().includes(term))
        );
    });

    if (isLoading) return <div style={{ display: "flex", justifyContent: "center", padding: "2rem", marginTop: "5rem" }}><SvgSpinner size={36} color="#00d17e" stroke={4} />;</div>
    if (isError) return <p style={{ color: "red" }}>{error.message}</p>;

    return (
        <div className="search-wrapper">
        <div className="search-page">
            <div className="detail-top">
                <Link to="/"><FaAngleLeft style={{ color: "black" }} /></Link>
                <p className='profile-p'>Search Product</p>
                <Link to="/cart" className="cart-icon-wrapper">
                        <IoCartOutline style={{ color: "black", fontSize: '1.5rem' }} />

                </Link>
            </div>
                <div className='search-navigate' style={{ marginTop: "1rem" }}>
            <label>
                        <IoIosSearch style={{ color: "black" }} />
            <input
                type="text"
                placeholder="Search Product"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
               
            />
            </label>
            </div>

            <div className="search-results">
                {filteredProducts && filteredProducts.length > 0 ? (
                    filteredProducts.map((product) => (
                        <Link
                            key={product._id}
                            to={`/product/${product.slug}`}
                            style={{ textDecoration: "none", color: "inherit" }}
                        >
                        <div key={product._id} className="search-card">
                            
                            {product.images && (
                                <img
                                    src={product.images}
                                    alt={product.title}
                                    className="search-image"
                                />
                            )}
                            <div className="product-right-info">
                            <h3>{product.title}</h3>
                            <div className="product-right-info-row">
                            <p style={{ color: "#00b36b" }}>{product.categories}</p>
                            <p>₹ {product.price}</p>
                            </div>
                            </div>
                        </div>
                        </Link>
                    ))
                ) : (
                    <p>No products found</p>
                )}
            </div>
        </div>
        </div>
    );

}

export default SearchPage;
