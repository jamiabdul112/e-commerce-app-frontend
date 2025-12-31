import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { baseURL } from "../constants/baseUrl";
import SvgSpinner from "../utils/svgSpinner";
import { FaAngleLeft, FaHeart } from "react-icons/fa6";
import { IoCartOutline } from "react-icons/io5";
import toast from "react-hot-toast";
import { QRCodeSVG } from "qrcode.react";
import '../css/productPage.css';

function ProductDetail() {
    const { slug } = useParams();
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    // Local States
    const [showBuyDialog, setShowBuyDialog] = useState(false);
    const [buyQuantity, setBuyQuantity] = useState(1.0);
    const [upiUrl, setUpiUrl] = useState("");
    const [inWishlist, setInWishlist] = useState(false);

    // 1. DATA FETCHING
    const { data: authUser } = useQuery({ queryKey: ["authUser"] });

    const { data: product, isLoading: productLoading } = useQuery({
        queryKey: ["product", slug],
        queryFn: async () => {
            const res = await fetch(`${baseURL}/api/product/${slug}`, { credentials: "include" });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Product not found");
            return data;
        },
        enabled: !!slug,
    });

    const { data: wishlist } = useQuery({
        queryKey: ["wishlist"],
        queryFn: async () => {
            const res = await fetch(`${baseURL}/api/wishlist`, { credentials: "include" });
            return res.json();
        },
    });

    const { data: cart, isLoading: cartLoading } = useQuery({
        queryKey: ["cart"],
        queryFn: async () => {
            const res = await fetch(`${baseURL}/api/cart`, { credentials: "include" });
            return res.json();
        },
    });

    useEffect(() => {
        if (wishlist && product) {
            setInWishlist(wishlist.some((item) => item._id === product._id));
        }
    }, [wishlist, product]);

    // 2. MUTATIONS

    // ✅ ADD TO CART MUTATION (Restored)
    const addToCartMutation = useMutation({
        mutationFn: async () => {
            const res = await fetch(`${baseURL}/api/cart/add`, {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ productId: product?._id, quantity: 1 }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Failed to add to cart");
            return data;
        },
        onSuccess: () => {
            toast.success("Product added to cart");
            queryClient.invalidateQueries({ queryKey: ["cart"] });
        },
        onError: (err) => toast.error(err.message),
    });

    // ✅ DELETE PRODUCT MUTATION (Restored)
    const deleteMutation = useMutation({
        mutationFn: async () => {
            const res = await fetch(`${baseURL}/api/product/${slug}`, {
                method: "DELETE",
                credentials: "include",
            });
            if (!res.ok) throw new Error("Delete failed");
        },
        onSuccess: () => {
            toast.success("Product deleted");
            queryClient.invalidateQueries({ queryKey: ["products"] });
            navigate("/");
        },
    });

    // BUY NOW MUTATION (With Decimal & QR)
    const buyMutation = useMutation({
        mutationFn: async () => {
            const res = await fetch(`${baseURL}/api/payment/buy/${slug}`, {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ quantity: buyQuantity }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Payment failed");
            return data;
        },
        onSuccess: (data) => {
            setUpiUrl(data.upiLink);
            const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
            if (isMobile) {
                window.location.href = data.upiLink;
            }
        },
    });

    const toggleWishlist = () => {
        const endpoint = inWishlist ? "/api/wishlist/remove" : "/api/wishlist/add";
        fetch(`${baseURL}${endpoint}`, {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ productId: product._id }),
        }).then(() => {
            queryClient.invalidateQueries({ queryKey: ["wishlist"] });
            setInWishlist(!inWishlist);
            toast.success(inWishlist ? "Removed from Wishlist" : "Added to Wishlist");
        });
    };

    // Global Loading State
    if (productLoading || cartLoading) return <div className="center-spinner" style={{ display: "flex", justifyContent: "center", padding: "2rem", marginTop: "5rem" }}><SvgSpinner size={40} /></div>;
    if (!product) return <p className="center-text">Product not found</p>;

    // Check if in cart
    const inCart = cart?.items?.some((item) => item.product?._id === product._id);

    return (
        <div className="product-detail-wrapper">
            <div className="product-detail-page">
                <div className="detail-top">
                    <Link to="/"><FaAngleLeft style={{ color: "black" }} /></Link>
                    <Link to="/cart" className="cart-icon-wrapper">
                        <IoCartOutline style={{color:"black", fontSize:'1.5rem'}} />
                        
                    </Link>
                </div>

                <div className="detail-info">
                    <div>
                        <p className="detail-p-1">{product.slug}</p>
                        <h1 className="detail-p-h1">{product.title}</h1>
                    </div>
                    {authUser?.role === "admin" && (
                        <Link to={`/product/${product.slug}/edit`}><button className="edit-btn">Edit</button></Link>
                    )}
                </div>
                {product.images && (
                <div className="detail-img">
                    <img src={product.images} alt={product.title} className="product-detail-image" />
                </div>
                )}

                <div className="wishlist-div">
                    <p className="detail-category">{product.categories}</p>
                    <div onClick={toggleWishlist} style={{ cursor: "pointer" }}>
                        <FaHeart color={inWishlist ? "red" : "gray"} size={24} />
                    </div>
                </div>

                <p className="detail-price">Price: <span className="lite-big-price">{product.price} ₹</span></p>
                <p className="detail-price">Stock: <span className="lite-big-price">{product.stock || "Out of Stock"}</span></p>

                {product.description && (
                    <div className="desc-section">
                        <p className="detail-description">Description</p>
                        <p className="faded-descrition">{product.description}</p>
                    </div>
                )}

                <div className="detail-btn">
                    <button className="buy-btn" onClick={() => setShowBuyDialog(true)}>Buy Now</button>

                    {/* ✅ Restored Add to Cart Button Logic */}
                    <button
                        className="cart-btn"
                        onClick={() => addToCartMutation.mutate()}
                        disabled={inCart || addToCartMutation.isPending}
                    >
                        {inCart ? "In Cart" : addToCartMutation.isPending ? "Adding..." : "Add to Cart"}
                    </button>
                </div>

                {/* ✅ Restored Admin Delete Button */}
                {authUser?.role === "admin" && (
                    <button
                        className="delete-btn"
                        onClick={() => window.confirm("Delete product?") && deleteMutation.mutate()}
                    >
                        {deleteMutation.isPending ? "Deleting..." : "Delete Product"}
                    </button>
                )}
            </div>

            {/* Payment Modal */}
            {showBuyDialog && (
                <div className="buy-dialog">
                    <div className="buy-dialog-content">
                        <h2 style={{paddingBottom:"1rem"}}>{product.title}</h2>
                        {!upiUrl ? (
                            <div>
                                <p>Price : ₹{product.price}</p>
                                <div style={{ margin: "20px 0" }}>
                                    <label>Qty : </label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        min="0.01"
                                        value={buyQuantity}
                                        onChange={(e) => setBuyQuantity(parseFloat(e.target.value) || 0)}
                                        style={{ width: "50px", padding: "8px", borderRadius: "5px", border: "1px solid #ddd" , textAlign:"center"}}
                                    />
                                </div>
                                <p className="total-amt">Total : ₹{(product.price * buyQuantity).toFixed(2)}</p>
                                <div className="button-dialog">
                                <button className="proceed-btn" style={{marginBottom:"0"}} onClick={() => buyMutation.mutate()} disabled={buyMutation.isPending}>
                                    {buyMutation.isPending ? "Processing..." : "Pay with UPI"}
                                </button>
                                    <button className="close-btn" style={{ marginTop: "0" }} onClick={() => { setShowBuyDialog(false); setUpiUrl(""); }}>Cancel</button>
                                </div>
                            </div>
                        ) : (
                            <div className="qr-container">
                                <QRCodeSVG value={upiUrl} size={200} includeMargin={true} />
                                <p className="total-amt">Amount: ₹{(product.price * buyQuantity).toFixed(2)}</p>
                                <div className="button-dialog">
                                <button className="back-btn" onClick={() => setUpiUrl("")}>Change Quantity</button>
                                        <button className="close-btn" style={{ marginTop: "0" }} onClick={() => { setShowBuyDialog(false); setUpiUrl(""); }}>Cancel</button>
                                </div>
                            </div>
                        )}
                        
                    </div>
                </div>
            )}
        </div>
    );
}

export default ProductDetail;