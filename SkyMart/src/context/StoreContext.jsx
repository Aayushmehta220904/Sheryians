import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { toast } from 'react-toastify';
const StoreContext = createContext(null);
const read=(k,f)=>{try{return JSON.parse(localStorage.getItem(k)) ?? f}catch{return f}};
export function StoreProvider({children}){
  const [users,setUsers]=useState(()=>read('sm_users',[{name:'Demo User',email:'demo@skymart.in',password:'demo123'}]));
  const [user,setUser]=useState(()=>read('sm_session',null));
  const [cart,setCart]=useState(()=>read('sm_cart',[]));
  const [wishlist,setWishlist]=useState(()=>read('sm_wishlist',[]));
  useEffect(()=>localStorage.setItem('sm_users',JSON.stringify(users)),[users]);
  useEffect(()=>localStorage.setItem('sm_session',JSON.stringify(user)),[user]);
  useEffect(()=>localStorage.setItem('sm_cart',JSON.stringify(cart)),[cart]);
  useEffect(()=>localStorage.setItem('sm_wishlist',JSON.stringify(wishlist)),[wishlist]);
  const login=(email,password)=>{const found=users.find(u=>u.email.toLowerCase()===email.toLowerCase()&&u.password===password); if(!found)return false; setUser({name:found.name,email:found.email}); return true};
  const register=(payload)=>{if(users.some(u=>u.email.toLowerCase()===payload.email.toLowerCase()))return false; setUsers(p=>[...p,payload]); setUser({name:payload.name,email:payload.email}); return true};
  const logout=()=>setUser(null);
  const addToCart=(p)=>{setCart(c=>{const x=c.find(i=>i.id===p.id); return x?c.map(i=>i.id===p.id?{...i,qty:i.qty+1}:i):[...c,{...p,qty:1}]});toast.success('Added to cart')};
  const updateQty=(id,qty)=>setCart(c=>c.map(i=>i.id===id?{...i,qty:Math.max(1,qty)}:i));
  const removeFromCart=(id)=>setCart(c=>c.filter(i=>i.id!==id));
  const toggleWishlist=(p)=>{const exists=wishlist.some(i=>i.id===p.id);setWishlist(w=>exists?w.filter(i=>i.id!==p.id):[...w,p]);toast(exists?'Removed from wishlist':'Saved to wishlist')};
  const cartCount=cart.reduce((s,i)=>s+i.qty,0); const cartTotal=cart.reduce((s,i)=>s+i.price*i.qty,0);
  const value=useMemo(()=>({users,user,login,register,logout,cart,wishlist,addToCart,updateQty,removeFromCart,toggleWishlist,cartCount,cartTotal}),[users,user,cart,wishlist,cartCount,cartTotal]);
  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}
export const useStore=()=>useContext(StoreContext);
