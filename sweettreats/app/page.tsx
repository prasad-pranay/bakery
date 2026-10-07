"use client";
import HomePage from "@/app/home/page";
import { useAuthStore } from "./store/authStore";
import ProductsPage from "./items/page";
import DashboardPage from "./admin/page";
import { useEffect, useState } from "react";

export default function Home() {
  const { user, admin } = useAuthStore();

  const [whichPage,setWhichPage] = useState(0);
  // 0: landing, 1: admin, 2: user
  useEffect(() => {
    if(user){
      setWhichPage(2)
    }else if(admin){
      setWhichPage(1)
    }else{
      setWhichPage(0)
    }
  }, [user,admin])
  
  
  if (whichPage==2) {
    return <ProductsPage />;
  }
  
  if (whichPage==1) {
    return <DashboardPage />;
  }
  
  return <HomePage />;
}
