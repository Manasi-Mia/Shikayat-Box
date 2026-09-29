import React, { useEffect, useMemo, useState } from 'react';
import { MessageCircle, Search, Send, Users, MoreVertical } from 'lucide-react';
import { UserAccount } from '../types';

interface Props { user: UserAccount; }

type ChatMessage = { id:string; sender:string; text:string; time:string; mine:boolean };

const initialMessages:ChatMessage[]=[
 {id:'1',sender:'Priya Nair',text:'Good morning everyone! Please report water issues through Shikayat Box.',time:'9:12 AM',mine:false},
 {id:'2',sender:'Rahul Mehta',text:'Thanks! Lift B is working now.',time:'9:28 AM',mine:false},
 {id:'3',sender:'Asha Kulkarni',text:'Is there a maintenance update for the parking area?',time:'9:41 AM',mine:false},
];

export const MemberChat:React.FC<Props>=({user})=>{
 const [messages,setMessages]=useState<ChatMessage[]>(()=>{try{return JSON.parse(localStorage.getItem('sb_chat_messages')||'null')||initialMessages}catch{return initialMessages}});
 const [text,setText]=useState(''); const [query,setQuery]=useState('');
 useEffect(()=>{localStorage.setItem('sb_chat_messages',JSON.stringify(messages))},[messages]);
 const members=useMemo(()=>['Priya Nair','Rahul Mehta','Asha Kulkarni','Neha Shah','Rohan Sharma'].filter(n=>n.toLowerCase().includes(query.toLowerCase())),[query]);
 const send=()=>{const value=text.trim();if(!value)return;setMessages(m=>[...m,{id:crypto.randomUUID(),sender:user.name,text:value,time:new Date().toLocaleTimeString([], {hour:'numeric',minute:'2-digit'}),mine:true}]);setText('');};
 return <div className="max-w-6xl mx-auto px-4 sm:px-6 py-7 sm:py-10 motion-page">
  <div className="mb-6 scroll-reveal"><div className="inline-flex items-center gap-2 text-[11px] font-extrabold uppercase tracking-wider text-rose-600"><MessageCircle className="w-4 h-4"/> Community chat</div><h1 className="text-2xl sm:text-3xl font-extrabold mt-2">Talk to your society</h1><p className="text-sm text-slate-500 mt-1">Share updates, ask neighbours and keep everyday conversations in one place.</p></div>
  <div className="grid lg:grid-cols-[260px_1fr] gap-4">
   <aside className="bg-white rounded-[26px] border border-rose-100 p-4 h-fit card-lift scroll-reveal"><div className="flex items-center justify-between mb-3"><div className="font-extrabold text-sm flex items-center gap-2"><Users className="w-4 h-4 text-rose-500"/> Members</div><span className="text-[10px] px-2 py-1 rounded-full bg-rose-50 text-rose-600 font-bold">{members.length}</span></div><div className="relative mb-3"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400"/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Find a member" className="w-full h-10 rounded-xl bg-slate-50 pl-9 pr-3 text-xs outline-none focus:ring-2 focus:ring-rose-100"/></div><div className="space-y-1">{members.map((name,i)=><div key={name} className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-rose-50/60"><div className="w-8 h-8 rounded-full bg-gradient-to-br from-rose-100 to-pink-100 text-rose-600 flex items-center justify-center text-[11px] font-extrabold">{name.split(' ').map(x=>x[0]).join('')}</div><div className="min-w-0"><div className="text-xs font-bold truncate">{name}</div><div className="text-[10px] text-emerald-500">{i%3===0?'Online':'Member'}</div></div></div>)}</div></aside>
   <section className="bg-white rounded-[26px] border border-rose-100 overflow-hidden flex flex-col min-h-[560px] shadow-[0_10px_40px_rgba(244,63,94,.06)] scroll-reveal">
    <div className="px-5 py-4 border-b border-rose-50 flex items-center justify-between bg-gradient-to-r from-rose-50/80 to-white"><div className="flex items-center gap-3"><div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-rose-500 to-pink-500 text-white flex items-center justify-center"><MessageCircle className="w-5 h-5"/></div><div><div className="font-extrabold text-sm">Society Members</div><div className="text-[10px] text-slate-400">Community conversation</div></div></div><button className="p-2 rounded-xl hover:bg-white text-slate-400"><MoreVertical className="w-4 h-4"/></button></div>
    <div className="flex-1 p-4 sm:p-6 space-y-3 overflow-y-auto bg-[#FFFDFD]">{messages.map(m=><div key={m.id} className={`flex ${m.mine?'justify-end':'justify-start'}`}><div className={`max-w-[82%] sm:max-w-[70%] ${m.mine?'items-end':'items-start'} flex flex-col`}><span className="text-[10px] font-bold text-slate-400 mb-1 px-1">{m.mine?'You':m.sender}</span><div className={`${m.mine?'bg-gradient-to-br from-rose-500 to-pink-500 text-white rounded-br-md':'bg-rose-50 text-slate-700 rounded-bl-md'} px-4 py-3 rounded-2xl text-sm leading-relaxed`}>{m.text}</div><span className="text-[9px] text-slate-400 mt-1 px-1">{m.time}</span></div></div>)}</div>
    <div className="p-3 sm:p-4 border-t border-rose-50 bg-white"><div className="flex gap-2"><input value={text} onChange={e=>setText(e.target.value)} onKeyDown={e=>{if(e.key==='Enter')send()}} placeholder="Write a message to your society..." className="flex-1 h-12 rounded-2xl bg-slate-50 px-4 text-sm outline-none focus:ring-2 focus:ring-rose-100"/><button onClick={send} className="w-12 h-12 rounded-2xl bg-gradient-to-br from-rose-500 to-pink-500 text-white flex items-center justify-center shadow-[0_7px_18px_rgba(244,63,94,.25)]"><Send className="w-4 h-4"/></button></div><div className="text-[9px] text-slate-400 mt-2 px-1">Be respectful. For official complaints, use Report so the issue can be tracked.</div></div>
   </section>
  </div>
 </div>;
