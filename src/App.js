import { Toaster } from "react-hot-toast";
import Home from "./pages/home";
import Login from "./pages/login";
import SignUp from "./pages/signUp";
import { Navigate, Route, Routes } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { baseURL } from "./constants/baseUrl";
import SvgSpinner from "./utils/svgSpinner";
import Profile from "./pages/profile";
import ProductDetail from "./pages/productPage";
import WishlistPage from "./pages/wishList";
import AddProductPage from "./pages/addProduct";
import EditProductPage from "./pages/editProduct";
import CartPage from "./pages/cartPage";
import SearchPage from "./pages/searchPage";
import Footer from "./pages/footer";
import React, { useEffect, useState } from "react";


function App() {
  const {data: authUser, isLoading} = useQuery({
    queryKey : ["authUser"],
    queryFn : async()=>{
      try {
        const res = await fetch(`${baseURL}/api/auth/me`, {
          method:"GET",
          credentials : "include",
          headers : {
            "Content-Type":"application/json"
          }
        })
        const data = await res.json()
        if(data.error){
          return null
        }
        if(!res.ok){
          throw new Error (data.error || "Something went wrong")
        }
        console.log("authUser", data)
        return data
      } catch (error) {
        throw error
      }
    },
    retry : false
  })

  


  if(isLoading){
    return(
      <div style={{display:"flex", justifyContent:"center", alignItems:"center", width:"100%", height:"100vh"}}>
      <SvgSpinner size={48} color="#00d17e" stroke={5} />
      </div>
    )
  }


  return (
    <div className="App">
      <Routes>
        <Route path="/signup" element={!authUser ? <SignUp /> : <Navigate to="/" />} />
        <Route path="/login" element={!authUser ? <Login /> : <Navigate to="/" />} />
        <Route path="/" element={authUser ? <Home /> : <Navigate to="/signup" />} />
        <Route path="/profile" element={authUser ? <Profile /> : <Navigate to="/signup" /> } />
        <Route path="/product/:slug" element={<ProductDetail />} /> 
        <Route path="/wishlist" element={authUser ? <WishlistPage /> : <Navigate to="/signup" />} />
        <Route path="/cart" element={authUser ? <CartPage /> : <Navigate to="/signup" />} />
        <Route path="/search" element={authUser ? <SearchPage /> : <Navigate to="/signup" />} />
        <Route path="/admin/add-product" element={authUser?.role === "admin" ? <AddProductPage /> : <Navigate to="/" />} />
        <Route path="/product/:slug/edit" element={authUser?.role === "admin" ? <EditProductPage /> : <Navigate to="/" />}/>
      </Routes>
      {authUser && <Footer /> }
      <Toaster />
    </div>
  );
}

export default App;
