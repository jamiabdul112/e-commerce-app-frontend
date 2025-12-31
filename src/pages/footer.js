import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { IoHomeSharp, IoCart } from "react-icons/io5";
import { IoIosSearch } from "react-icons/io";
import { FaPlus, FaUser } from "react-icons/fa6";
import { Link, useLocation } from 'react-router-dom';
import '../css/footer.css'


function Footer() {
    const location = useLocation();
    const currentPath = location.pathname;

    const { data: authUser } = useQuery({
        queryKey: ["authUser"],
    });

    // Helper function to handle icon colors
    const activeColor = "#00b36b";
    const inactiveColor = "gray";

    return (
        <div className='footer-wrapper'>
            <div className='footer-page'>
                {/* Home */}
                <Link style={{ textDecoration: "none" }} to="/">
                    <IoHomeSharp color={currentPath === "/" ? activeColor : inactiveColor} />
                </Link>

                {/* Search */}
                <Link style={{ textDecoration: "none" }} to="/search">
                    <IoIosSearch color={currentPath === "/search" ? activeColor : inactiveColor} />
                </Link>

                {/* Admin Plus Button */}
                {authUser?.role === "admin" && (
                    <Link style={{ textDecoration: "none" }} to="/admin/add-product">
                        <div className='plus' >
                            <FaPlus color="white" />
                        </div>
                    </Link>
                )}

                {/* Cart */}
                <Link style={{ textDecoration: "none" }} to="/cart">
                    <IoCart color={currentPath === "/cart" ? activeColor : inactiveColor} />
                </Link>

                {/* Profile */}
                <Link style={{ textDecoration: "none" }} to="/profile">
                    <FaUser color={currentPath === "/profile" ? activeColor : inactiveColor} />
                </Link>
            </div>
        </div>
    );
}

export default Footer;