import React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { baseURL } from "../constants/baseUrl";
import SvgSpinner from "../utils/svgSpinner";
import toast from "react-hot-toast";
import { FaAngleLeft } from "react-icons/fa6";
import { Link } from "react-router-dom";
import { FaTrashAlt } from "react-icons/fa";
import { QRCodeSVG } from "qrcode.react"; // 👈 for QR code
import "../css/cartPage.css";

function CartPage() {
    const queryClient = useQueryClient();

    const { data: cart, isLoading, isError, error } = useQuery({
        queryKey: ["cart"],
        queryFn: async () => {
            const res = await fetch(`${baseURL}/api/cart`, {
                method: "GET",
                credentials: "include",
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Failed to fetch cart");
            return data;
        },
    });

    const removeMutation = useMutation({
        mutationFn: async (productId) => {
            const res = await fetch(`${baseURL}/api/cart/remove`, {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ productId }),
            });
            return res.json();
        },
        onSuccess: () => {
            toast.success("Item removed");
            queryClient.invalidateQueries(["cart"]);
        },
    });

    const updateQuantityMutation = useMutation({
        mutationFn: async ({ productId, quantity }) => {
            const res = await fetch(`${baseURL}/api/cart/update`, {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ productId, quantity }),
            });
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries(["cart"]);
        },
    });

    const clearCartMutation = useMutation({
        mutationFn: async () => {
            const res = await fetch(`${baseURL}/api/cart/clear`, {
                method: "POST",
                credentials: "include",
            });
            return res.json();
        },
        onSuccess: () => {
            toast.success("Cart cleared");
            queryClient.invalidateQueries(["cart"]);
        },
    });

    const [showCheckoutDialog, setShowCheckoutDialog] = React.useState(false);

    // ✅ Loading / Error / Empty states
    if (isLoading)
        return (
            <div
                style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "80vh",
                }}
            >
                <SvgSpinner size={36} color="#00d17e" stroke={4} />
            </div>
        );

    if (isError)
        return (
            <p style={{ color: "red", textAlign: "center", marginTop: "5rem" }}>
                {error.message}
            </p>
        );

    if (!cart || !cart.items || cart.items.length === 0) {
        return (
            <p
                style={{
                    textAlign: "center",
                    marginTop: "18rem",
                }}
            >
                Your cart is empty, Go back to&nbsp;
                <Link to="/" style={{ color: "black", fontWeight: "bold" }}>
                    Home
                </Link>
            </p>
        );
    }

    // ✅ Calculate total price
    const totalPrice = cart.items
        .reduce((sum, item) => {
            if (!item.product) return sum;
            return sum + (item.product.price || 0) * (item.quantity || 0);
        }, 0)
        .toFixed(2);

    // ✅ Build UPI link
    const shopUpiId = "13610382@kvb"; // replace with your UPI ID
    const shopName = "Abdul Salam Store";
    const upiLink = `upi://pay?pa=${shopUpiId}&pn=${encodeURIComponent(
        shopName
    )}&am=${totalPrice}&cu=INR&tn=${encodeURIComponent("Cart Checkout")}`;

    // ✅ Detect mobile
    const isMobile = /Mobi|Android/i.test(navigator.userAgent);

    return (
        <div className="cart-page">
            <div className="profile-top">
                <Link to="/" style={{ textDecoration: "none" }}>
                    <FaAngleLeft style={{ color: "black" }} />
                </Link>
                <p className="profile-p">Cart</p>
                <button
                    onClick={() =>
                        window.confirm("Clear cart?") && clearCartMutation.mutate()
                    }
                    style={{
                        backgroundColor: "#ff4d4f",
                        color: "white",
                        border: "none",
                        padding: "0.6rem 1.2rem",
                        borderRadius: "6px",

                        cursor: "pointer",
                    }}
                    className="clear-cart-btn"
                >
                    Clear
                </button>
            </div>

            <div className="cart-grid">
                {cart.items.map((item) => {
                    if (!item.product) {
                        return (
                            <div key={item._id} className="cart-card" style={{ opacity: 0.6 }}>
                                <div className="cart-right-info">
                                    <h3>Product Unavailable</h3>
                                    <p>This item is no longer in stock.</p>
                                </div>
                                <button
                                    onClick={() => removeMutation.mutate(item._id)}
                                    className="remove-btn"
                                >
                                    <FaTrashAlt />
                                </button>
                            </div>
                        );
                    }

                    return (
                        <div key={item.product._id} className="cart-card">
                            {item.product.images && (
                                <img
                                    src={item.product.images}
                                    alt={item.product.title}
                                    className="cart-image"
                                />
                            )}
                            <div className="cart-right-info">
                                <h3>{item.product.title}</h3>
                                <p>
                                    ₹{item.product.price} × {item.quantity} = ₹
                                    {(item.product.price * item.quantity).toFixed(2)}
                                </p>

                                <input
                                    type="number"
                                    min="1"
                                    value={item.quantity}
                                    onChange={(e) =>
                                        updateQuantityMutation.mutate({
                                            productId: item.product._id,
                                            quantity: parseInt(e.target.value, 10),
                                        })
                                    }
                                    style={{ width: "65px", padding: "4px", textAlign: "center" }}
                                />
                            </div>

                            <button
                                onClick={() => removeMutation.mutate(item.product._id)}
                                className="remove-btn"
                            >
                                <FaTrashAlt />
                            </button>
                        </div>
                    );
                })}
            </div>

            <div className="cart-bottom">
                <div className="cart-bottom-info">
                    <p>Total {cart.items.length} Items</p>
                    <p className="bold-price-p">₹{totalPrice}</p>
                </div>
                <button
                    className="cart-buy-btn"
                    onClick={() => {
                        if (isMobile) {
                            window.location.href = upiLink; // 👈 mobile → open UPI app
                        } else {
                            setShowCheckoutDialog(true); // 👈 desktop → show QR
                        }
                    }}
                >
                    Proceed to Checkout
                </button>
            </div>

            {/* ✅ Checkout Dialog (Desktop) */}
            {showCheckoutDialog && (
                <div className="checkout-dialog">
                    <div className="checkout-dialog-content">
                        <h2>Scan to Pay</h2>
                        <p style={{marginTop:"1rem"}}>Total Amount: ₹{totalPrice}</p>

                        <div className="qr-container">
                            <QRCodeSVG value={upiLink} size={180} includeMargin={true} />
                            <p  className="qr-hint">Scan with GPay, PhonePe, or Paytm</p>
                        </div>

                        <button
                            style={{ marginTop: "1rem" }}
                            className="close-btn"
                            onClick={() => setShowCheckoutDialog(false)}
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default CartPage;
