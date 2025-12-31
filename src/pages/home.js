
import React from 'react'
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { IoIosSearch } from "react-icons/io";
import { Link } from 'react-router-dom';
import Product from './product';
import '../css/home.css'

function Home() {
  

  const [feedType, setFeedType] = useState("All");
  /* const data = {
    name:"Andrea"
  } */
  const { data: authUser } = useQuery({
    queryKey: ["authUser"],
  });
  return (
    <div className='home-wrapper'>
    <div className='home-page'>
        <div className='home-top'>
            <h2 className='home-h2'>Abdul Mart</h2>
            <Link to="/profile" style={{textDecoration:"none"}}>
            <img src='https://media.istockphoto.com/vectors/profile-placeholder-image-gray-silhouette-no-photo-vector-id1016744034?k=20&m=1016744034&s=612x612&w=0&h=kjCAwH5GOC3n3YRTHBaLDsLIuF8P3kkAJc9RvfiYWBY=' alt='photo-img'></img>
          </Link>
        </div>
        <div className='home-content'>
            <p className='home-p'>Hi, {authUser.fullName}</p>
            <h1 className='home-h1'>What are you looking for today?</h1>
        </div>
        <Link to='/search' style={{textDecoration:"none"}}>
        <div className='search-navigate'>
            <label>
              <IoIosSearch style={{color:"black"}} />
              <input placeholder='Search Product'></input>
            </label>
        </div>
        </Link>
        <div className='product-bg'>
        <div className='home-category'>
          <div className={`tab-item ${feedType === "All" ? "active" : ""}`} onClick={() => setFeedType("All")}>
          All
            {feedType === "All" && <div className="tab-indicator"></div>}
          </div>
          <div className={`tab-item ${feedType === "Masala" ? "active" : ""}`} onClick={() => setFeedType("Masala")}>
          Masala
            {feedType === "Masala" && <div className="tab-indicator"></div>}
          </div>
          <div className={`tab-item ${feedType === "Soap" ? "active" : ""}`} onClick={() => setFeedType("Soap")}>
          Soap
            {feedType === "Soap" && <div className="tab-indicator"></div>}
          </div>
          <div className={`tab-item ${feedType === "Snacks" ? "active" : ""}`} onClick={() => setFeedType("Snacks")}>
          Snacks
            {feedType === "Snacks" && <div className="tab-indicator"></div>}
          </div>
          <div className={`tab-item ${feedType === "Juice" ? "active" : ""}`} onClick={() => setFeedType("Juice")}>
          Juice
            {feedType === "Juice" && <div className="tab-indicator"></div>}
          </div>
          <div className={`tab-item ${feedType === "Shampoo" ? "active" : ""}`} onClick={() => setFeedType("Shampoo")}>
          Shampoo
            {feedType === "Shampoo" && <div className="tab-indicator"></div>}
          </div>
          <div className={`tab-item ${feedType === "Cigarettes" ? "active" : ""}`} onClick={() => setFeedType("Cigarettes")}>
          Cigarettes
            {feedType === "Cigarettes" && <div className="tab-indicator"></div>}
          </div>
          <div className={`tab-item ${feedType === "Chocolates" ? "active" : ""}`} onClick={() => setFeedType("Chocolates")}>
          Chocolates
            {feedType === "Chocolates" && <div className="tab-indicator"></div>}
          </div>
          <div className={`tab-item ${feedType === "Pulses" ? "active" : ""}`} onClick={() => setFeedType("Pulses")}>
          Pulses
            {feedType === "Pulses" && <div className="tab-indicator"></div>}
          </div>
          <div className={`tab-item ${feedType === "Vegetables" ? "active" : ""}`} onClick={() => setFeedType("Vegetables")}>
          Vegetables
            {feedType === "Vegetables" && <div className="tab-indicator"></div>}
          </div>
        </div>
        <Product feedType={feedType} />
        </div>
    </div>
    </div>
  )
}

export default Home