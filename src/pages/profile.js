import React from 'react'
import { FaAngleLeft } from "react-icons/fa6";
import { Link } from 'react-router-dom';
import { useQueryClient, useQuery } from '@tanstack/react-query';
import { useMutation } from '@tanstack/react-query';
import { baseURL } from '../constants/baseUrl';
import toast from 'react-hot-toast';
import '../css/profile.css'

function Profile() {
   

    const queryClient = useQueryClient()
    const { mutate: logout } = useMutation({
        mutationFn: async () => {
            try {
                const res = await fetch(`${baseURL}/api/auth/logout`, {
                    method: "POST",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json",
                    },
                });
                const data = await res.json();
                if (!res.ok) {
                    throw new Error(data.error || "Something went wrong");
                }
            } catch (error) {
                throw error;
            }
        },
        onSuccess: () => {
            toast.success("Logged Out Successfully");
            queryClient.invalidateQueries({
                queryKey: ["authUser"],
            });
        },
        onError: () => {
            toast.error("LogOut Unsuccessful");
        },
      });
     const { data: authUser } = useQuery({
        queryKey: ["authUser"],
      });
  return (
    <div className='profile-wrapper'>
    <div className='profile-page'>  
        <div className='profile-top'>
            <Link to='/' style={{textDecoration:"none"}}>
            <FaAngleLeft style={{color:"black"}}/>
            </Link>
            <p className='profile-p'>Profile</p>
            <div className='hidden'></div>
        </div>
        <div className='user-info'>
            <img src='https://media.istockphoto.com/vectors/profile-placeholder-image-gray-silhouette-no-photo-vector-id1016744034?k=20&m=1016744034&s=612x612&w=0&h=kjCAwH5GOC3n3YRTHBaLDsLIuF8P3kkAJc9RvfiYWBY=' alt='photo-img'></img>
            <div className='user-info-right'>
                <p className='profile-p-2'>{authUser.fullName}</p>
                <p className='faded-p-profile'>{authUser.email}</p>
            </div>
        </div>
        <div className='user-address'>
            <p className='profile-p-3'>Address</p>
            <p className='profile-p-address'>{authUser.address}</p>
        </div>
        <div className='user-general'>
            <p className='profile-p-3'>General</p>
            <Link to='/wishlist' style={{textDecoration:"none"}}>
            <p className='profile-p-address'>Wishlist</p>
            </Link>
        </div>
        <div className='user-legal'>
            <p className='profile-p-3'>Legal</p>
            <p className='profile-p-address'>Terms of Use</p>
            <p className='profile-p-address'>Privacy Policy</p>
        </div>
        <div className='user-personal'>
            <p className='profile-p-3'>Personal</p>
            <p className='profile-p-address'>Report a Bug</p>
            <p className='profile-p-address' onClick={(e)=>{
                e.preventDefault()
                logout()}}>Logout</p>
        </div>
    </div>
    </div>
  )
}

export default Profile