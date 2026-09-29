import { Notice, Reminder } from '../types';

const BASE=(import.meta.env.VITE_API_URL || '/api').replace(/\/$/,'');
const authHeaders=()=>{const token=localStorage.getItem('sb_token');return token?{Authorization:`Bearer ${token}`}:{}};
async function request(path:string,options:RequestInit={}){const res=await fetch(`${BASE}${path}`,{...options,headers:{'Content-Type':'application/json',...authHeaders(),...(options.headers||{})}});if(!res.ok){const body=await res.json().catch(()=>({}));throw new Error(body.error||'Request failed');}return res.json();}
export const extraApi={
 getNotices:()=>request('/notices') as Promise<Notice[]>,
 createNotice:(notice:Omit<Notice,'id'|'created_at'>)=>request('/notices',{method:'POST',body:JSON.stringify(notice)}) as Promise<Notice>,
 getReminders:()=>request('/reminders') as Promise<Reminder[]>,
 createReminder:(reminder:Omit<Reminder,'id'|'created_at'>)=>request('/reminders',{method:'POST',body:JSON.stringify(reminder)}) as Promise<Reminder>,
 updateReminder:(id:string,status:Reminder['status'])=>request(`/reminders/${id}`,{method:'PATCH',body:JSON.stringify({status})}) as Promise<Reminder>
};