'use client';
import React, { ReactNode, useEffect, useState } from 'react'
import { useAuthStore } from '../store/authStore';
import Header from './header';
import SplashPage from './splash';

export function Validator({children,}: {children: ReactNode;}) {
     const { setUser, setProducts, setCartItem, setAllUsers, user, cart, toggleShowCart, showCart, products, admin,setOrder, setAdmin, setAdminData} = useAuthStore();
        async function checkUser() {
            try{
                const response = fetch(process.env.NEXT_PUBLIC_API_URL+"/api/auth/me", {
                    method: "GET",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
            });
            const data = await (await response).json();
            
            if (data.success) {
              if(data.admin){
                setAdmin(true)
                getAdminDashboardData()
                getAllOrder()
                getAllUsers()
              }else{
                setUser({
                    _id: data.data["_id"],
                    id: data.data["_id"],
                    email: data.data["email"],
                    name: data.data["name"],
                    savedAddresses: data.data["savedAddresses"],
                    payment: data.data["savedPaymentMethods"]
                });
                fetchCarts();
                getOrder()
              }
            } else {
                setUser(null);
            }
        }catch(error){
            console.log(error)
        }
        }
        async function getAdminDashboardData() {
            try {
    
                const response = fetch(process.env.NEXT_PUBLIC_API_URL+"/api/admin/dashboard", {
                    method: "GET",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json",
                    },
                });
                const data = await (await response).json();
                if (data.success) {
                  console.log("admin dashboard updated")
                    setAdminData(data.data);
                }
            } catch (error) {
                console.log(error)
            }
        }
        async function getOrder() {
            try {
    
                const response = fetch(process.env.NEXT_PUBLIC_API_URL+"/api/orders", {
                    method: "GET",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json",
                    },
                });
                const data = await (await response).json();
                if (data.success) {
                    console.log("orders laded")
                    setOrder(data.data);
                }
            } catch (error) {
                console.log(error)
            }
        }
        async function getAllOrder() {
            try {
    
                const response = fetch(process.env.NEXT_PUBLIC_API_URL+"/api/all-orders", {
                    method: "GET",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json",
                    },
                });
                const data = await (await response).json();
                if (data.success) {
                    setOrder(data.data);
                }
            } catch (error) {
                console.log(error)
            }
        }
        async function getAllUsers() {
            try {
    
                const response = fetch(process.env.NEXT_PUBLIC_API_URL+"/api/all-users", {
                    method: "GET",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json",
                    },
                });
                const data = await (await response).json();
                if (data.success) {
                    setAllUsers(data.data);
                }
            } catch (error) {
                console.log(error)
            }
        }
        async function fetchProducts() {
            try {
                const response = await fetch(process.env.NEXT_PUBLIC_API_URL+'/items');
                const data = await response.json();
                setProducts(data.data);
            } catch (error) {
                console.log(error)
            }
        }
        async function fetchCarts() {
            try {
                const response = await fetch(process.env.NEXT_PUBLIC_API_URL+'/api/cart', {
                    credentials: 'include',
                });
                const data = await response.json();
                console.log("cart data loaded")
                console.log(data.data)
                setCartItem(data.data);
            } catch (error) {
                console.log(error)
            }
        }
        const [splash,setSplash] = useState(true)
        useEffect(() => {
            setTimeout(() => {
                setSplash(false)
            }, 2000);
            checkUser(); 
            fetchProducts(); 
        }, []);
  return (
    <>
    <SplashPage show={splash} />
    {!splash && <>
        {!admin && <Header/>}
        {children}
    </>}
 
    </>
  )
} 

export default Validator
