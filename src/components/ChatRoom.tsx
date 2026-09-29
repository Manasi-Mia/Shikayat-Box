import React, { useEffect, useState } from 'react';
import { MessageCircle, Send, Users, RefreshCw } from 'lucide-react';
import { UserAccount, Language, ChatMessage } from '../types';

const copy:Record<string,{title:string;subtitle:string;placeholder:string;empty:string;send:string}> = {
 english:{title:'Society Chat',subtitle:'Connect with your neighbours',placeholder:'Write a message...',empty:'No messages yet. Start the conversation.',send:'Send'},
 hindi:{title:'सोसाइटी चैट',subtitle:'अपने पड़ोसियों से जुड़ें',placeholder:'संदेश लिखें...',empty:'अभी कोई संदेश नहीं। बातचीत शुरू करें।',send:'भेजें'},
 marathi:{title:'सोसायटी चॅट',subtitle:'तुमच्या शेजाऱ्यांशी जोडा',placeholder:'संदेश लिहा...',empty:'अजून संदेश नाहीत. संभाषण सुरू करा.',send:'पाठवा'},
 telugu:{title:'సొసైటీ చాట్',subtitle:'మీ పొరుగువారితో కలవండి',placeholder:'సందేశం రాయండి...',empty:'ఇంకా సందేశాలు లేవు. సంభాషణ ప్రారంభించండి.',send:'పంపండి'},
 gujarati:{title:'સોસાયટી ચેટ',subtitle:'તમારા પડોશીઓ સાથે જોડાઓ',placeholder:'સંદેશ લખો...',empty:'હજુ સંદેશા નથી. વાતચીત શરૂ કરો.',send:'મોકલો'},
 punjabi:{title:'ਸੋਸਾਇਟੀ ਚੈਟ',subtitle:'ਆਪਣੇ ਗੁਆਂਢੀਆਂ ਨਾਲ ਜੁੜੋ',placeholder:'ਸੁਨੇਹਾ ਲਿਖੋ...',empty:'ਅਜੇ ਕੋਈ ਸੁਨੇਹਾ ਨਹੀਂ। ਗੱਲਬਾਤ ਸ਼ੁਰੂ ਕਰੋ।',send:'ਭੇਜੋ'},
 bengali:{title:'সোসাইটি চ্যাট',subtitle:'প্রতিবেশীদের সঙ্গে যুক্ত হন',placeholder:'বার্তা লিখুন...',empty:'এখনও কোনো বার্তা নেই। কথোপকথন শুরু করুন।',send:'পাঠান'},
 hinglish:{title:'Society Chat',subtitle:'Apne neighbours se connect karein',placeholder:'Message likhiye...',empty:'Abhi koi message nahi. Baat shuru karein.',send:'Bhejein'}
};

export const ChatRoom:React.FC<{currentUser:UserAccount;language:Language}>=({currentUser,language})=>{
 const t=copy[language]||copy.english;
 const [messages,setMessages]=useState<ChatMessage[]>([]); const [text,setText]=useState(''); const [loading,setLoading]=useState(true);
 const load=async()=>{try{const r=await fetch('/api/chat',{headers:{Authorization:`Bearer ${localStorage.getItem('sb_token')||''}`}});if(r.ok)setMessages(await r.json());}finally{setLoading(false)}};
 useEffect(()=>{load();const id=window.setInterval(load,10000);return()=>window.clearInterval(id)},[]);
 const send=async(e:React.FormEvent)=>{e.preventDefault();const value=text.trim();if(!value)return;const r=await fetch('/api/chat',{method:'POST',headers:{'Content-Type':'application/json',Authorization:`Bearer ${localStorage.getItem('sb_token')||''}`},body:JSON.stringify({text:value})});if(r.ok){setText('');await load();}};
 return <div className="motion-page max-w-5xl mx-auto px-4 sm:px-6 py-7 sm:py-10">
  <div className="flex items-center justify-between mb-5"><div><div className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-rose-600"><MessageCircle className="w-4 h-4"/>{t.title}</div><h1 className="text-2xl sm:text-3xl font-extrabold mt-2">{t.title}</h1><p className="text-sm text-slate-500 mt-1">{t.subtitle}</p></div><button onClick={load} className="p-2.5 rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-100" aria-label="Refresh"><RefreshCw className="w-4 h-4"/></button></div>
  <div className="rounded-[28px] border border-rose-100 bg-white shadow-[0_18px_60px_rgba(244,63,94,.08)] overflow-hidden"><div className="px-5 py-4 bg-gradient-to-r from-rose-50 via-pink-50 to-orange-50 border-b border-rose-100 flex items-center gap-3"><div className="w-10 h-10 rounded-2xl bg-rose-500 text-white flex items-center justify-center"><Users className="w-5 h-5"/></div><div><div className="font-extrabold text-sm">Greenwood Heights</div><div className="text-[11px] text-slate-500">Community conversation</div></div></div>
   <div className="h-[52vh] min-h-[360px] overflow-y-auto p-4 sm:p-6 space-y-3 bg-[#FFFDFC]">{loading?<div className="h-full flex items-center justify-center text-sm text-slate-400">Loading chat...</div>:messages.length===0?<div className="h-full flex items-center justify-center text-sm text-slate-400 text-center">{t.empty}</div>:messages.map(m=><div key={m.id} className={`flex ${m.sender_id===currentUser.id?'justify-end':''}`}><div className={`max-w-[82%] sm:max-w-[65%] rounded-2xl px-4 py-3 ${m.sender_id===currentUser.id?'bg-rose-500 text-white rounded-br-md':'bg-white border border-rose-100 text-slate-800 rounded-bl-md'}`}><div className={`text-[10px] font-extrabold mb-1 ${m.sender_id===currentUser.id?'text-white/75':'text-rose-600'}`}>{m.sender_name}</div><div className="text-sm leading-relaxed break-words">{m.text}</div><div className={`text-[9px] mt-2 ${m.sender_id===currentUser.id?'text-white/60':'text-slate-400'}`}>{new Date(m.created_at).toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'})}</div></div></div>)}</div>
   <form onSubmit={send} className="p-3 sm:p-4 border-t border-rose-100 flex gap-2"><input value={text} onChange={e=>setText(e.target.value)} placeholder={t.placeholder} className="flex-1 h-11 rounded-xl border border-rose-100 bg-rose-50/30 px-4 text-sm outline-none focus:border-rose-400"/><button className="h-11 px-4 rounded-xl bg-rose-500 text-white font-bold text-sm flex items-center gap-2 hover:bg-rose-600"><Send className="w-4 h-4"/><span className="hidden sm:inline">{t.send}</span></button></form>
  </div></div>;
};