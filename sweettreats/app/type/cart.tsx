import { IdCard } from "lucide-react";
import { Product } from "./product";

export type cartItemType = {
    productId : number;
    quantity : number;
}
export type cartFullType = {
    productId : Product;
    quantity : number;
}

// export type cartSendItemType = {
//     productId : number;
//     quantity : number;
// }

export async function cartAddBackend(product: cartItemType) { 
  const response = await fetch(process.env.NEXT_PUBLIC_API_URL+'/api/cart', {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(product),
  });
  const data= await response.json();
  return data;
}

export async function cartUpdateBackend(id:number, newQuantity:number) {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/cart/${id}`, {
    method: 'PATCH',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ 
        quantity: newQuantity,
    }),
  });
  const data= await response.json();
  return data;
}

export async function cartItemRemove(id:number) {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/cart/${id}`, {
    method: 'DELETE',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: null,
  });
  const data= await response.json();
  return data;
}