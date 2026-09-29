import React, { useEffect } from 'react';
import { Activity, Bell, BookOpen, Building2, CheckCircle2, FilePlus2, Home, Languages, LogOut, Megaphone, MessageCircle, Search, UserRound, Clock3 } from 'lucide-react';
import { UserAccount, Language } from '../types';

interface Props { user:UserAccount; tab:string; onTab:(tab:string)=>void; unread:number; onLogout:()=>void; onSearch:()=>void; language?:Language; onLanguageChange?:(language:Language)=>void; }

const resident=[['home','Home',Home],['ongoing','Ongoing Issues',Activity],['solved','Solved Issues',CheckCircle2],['notifications','Notifications',Bell],['profile','Profile',UserRound]] as const;
const admin=[['dashboard','Dashboard',Home],['issues','Issues',FilePlus2],['notifications','Notifications',Bell],['reminders','Reminders',Clock3]] as const;

const translations:Record<string,Record<string,string>>={
 hindi:{Home:'होम','Ongoing Issues':'चल रही शिकायतें','Solved Issues':'सुलझी शिकायतें',Notifications:'सूचनाएं',Profile:'प्रोफ़ाइल',Dashboard:'डैशबोर्ड',Issues:'मुद्दे',Reminders:'रिमाइंडर'},
 marathi:{Home:'होम','Ongoing Issues':'प्रलंबित तक्रारी','Solved Issues':'सोडवलेल्या तक्रारी',Notifications:'सूचना',Profile:'प्रोफाइल',Dashboard:'डॅशबोर्ड',Issues:'तक्रारी',Reminders:'रिमाइंडर'},
 telugu:{Home:'హోమ్','Ongoing Issues':'కొనసాగుతున్న సమస్యలు','Solved Issues':'పరిష్కరించిన సమస్యలు',Notifications:'నోటిఫికేషన్లు',Profile:'ప్రొఫైల్',Dashboard:'డాష్‌బోర్డ్',Issues:'సమస్యలు',Reminders:'రిమైండర్లు'},
 gujarati:{Home:'હોમ','Ongoing Issues':'ચાલુ ફરિયાદો','Solved Issues':'ઉકેલાયેલી ફરિયાદો',Notifications:'સૂચનાઓ',Profile:'પ્રોફાઇલ',Dashboard:'ડેશબોર્ડ',Issues:'મુદ્દાઓ',Reminders:'રિમાઇન્ડર'},
 punjabi:{Home:'ਹੋਮ','Ongoing Issues':'ਚੱਲ ਰਹੀਆਂ ਸ਼ਿਕਾਇਤਾਂ','Solved Issues':'ਹੱਲ ਹੋਈਆਂ ਸ਼ਿਕਾਇਤਾਂ',Notifications:'ਸੂਚਨਾਵਾਂ',Profile:'ਪ੍ਰੋਫਾਈਲ',Dashboard:'ਡੈਸ਼ਬੋਰਡ',Issues:'ਮੁੱਦੇ',Reminders:'ਰਿਮਾਈਂਡਰ'},
 bengali:{Home:'হোম','Ongoing Issues':'চলমান অভিযোগ','Solved Issues':'সমাধান হওয়া অভিযোগ',Notifications:'বিজ্ঞপ্তি',Profile:'প্রোফাইল',Dashboard:'ড্যাশবোর্ড',Issues:'সমস্যা',Reminders:'রিমাইন্ডার'}
};
const languageOptions:[Language,string][]=[['english','English'],['hindi','हिन्दी'],['marathi','मराठी'],['telugu','తెలుగు'],['gujarati','ગુજરાતી'],['punjabi','ਪੰਜਾਬੀ'],['bengali','বাংলা'],['hinglish','Hinglish']];

export const PortalNav:React.FC<Props>=({user,tab,onTab,unread,onLogout,onSearch,language='english',onLanguageChange})=>{
 const items=user.role==='resident'?resident:admin;
 const label=(x:string)=>translations[language]?.[x]||x;
 useEffect(()=>{document.body.dataset.page=tab==='home'?'home':tab},[tab]);
 useEffect(()=>{
   const handler=(event:Event)=>{
     const detail=(event as CustomEvent<string>).detail;
     if(detail){
       document.body.dataset.page=detail==='home'?'home':detail;
       if(user.role==='admin' && (detail==='dashboard' || detail==='issues')) window.location.hash=`admin-${detail}`;
       onTab(detail);
     }
   };
   window.addEventListener('sb-admin-nav',handler);
   return()=>window.removeEventListener('sb-admin-nav',handler);
 },[onTab,user.role]);
 const go=(id:string)=>{
   const target=(id==='ongoing'||id==='solved')?'issues':id;
   if(id==='ongoing'||id==='solved')localStorage.setItem('sb_issue_view',id);
   document.body.dataset.page=target==='home'?'home':target;
   if(user.role==='admin' && (target==='dashboard' || target==='issues')) window.location.hash=`admin-${target}`;
   onTab(target);
 };
 const quick=(id:string)=>{document.body.dataset.page=id==='home'?'home':id;onTab(id)};
 return <>
 <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-xl border-b border-rose-100 shadow-[0_2px_18px_rgba(244,63,94,.06)]"><div className="max-w-7xl mx-auto px-4 sm:px-6"><div className="h-[68px] flex items-center justify-between gap-3"><button onClick={()=>go(user.role==='resident'?'home':'dashboard')} className="flex items-center gap-2.5 shrink-0"><div className="w-9 h-9 rounded-xl bg-gradient-to-br from-rose-500 to-pink-600 text-white flex items-center justify-center shadow-[0_7px_18px_rgba(244,63,94,.28)]"><Building2 className="w-5 h-5"/></div><div className="hidden sm:block text-left"><div className="font-extrabold tracking-tight text-slate-900">SHIKAYAT <span className="text-rose-500">BOX</span></div><div className="text-[9px] uppercase tracking-wider font-bold text-slate-400">Ek page, aapki baat</div></div></button><nav className="hidden lg:flex items-center gap-1 overflow-x-auto">{items.map(([id,text,Icon])=><button key={id} onClick={()=>go(id)} className={`relative px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${tab===id?'bg-rose-50 text-rose-600':'text-slate-500 hover:bg-rose-50/70 hover:text-rose-600'}`}><Icon className="w-4 h-4"/>{label(text)}{id==='notifications'&&unread>0&&<span className="ml-0.5 min-w-4 h-4 px-1 rounded-full bg-rose-500 text-white text-[9px] flex items-center justify-center notification-pop">{unread}</span>}</button>)}</nav><div className="flex items-center gap-1.5">{onLanguageChange&&<label className="hidden md:flex items-center gap-1.5 rounded-xl border border-rose-100 bg-rose-50/60 px-2.5 h-10 text-rose-600"><Languages className="w-4 h-4"/><select value={language} onChange={e=>onLanguageChange(e.target.value as Language)} className="bg-transparent outline-none text-xs font-bold text-rose-700 cursor-pointer" aria-label="Select language">{languageOptions.map(([id,native])=><option key={id} value={id}>{native}</option>)}</select></label>}<button onClick={onSearch} className="hidden sm:flex p-2.5 rounded-xl hover:bg-rose-50 text-slate-500" aria-label="Search"><Search className="w-4 h-4"/></button><button onClick={()=>go('notifications')} className="lg:hidden relative p-2.5 rounded-xl hover:bg-rose-50 text-slate-600"><Bell className="w-5 h-5"/>{unread>0&&<span className="absolute top-1 right-1 w-3.5 h-3.5 rounded-full bg-rose-500 border-2 border-white notification-pop"/>}</button><div className="hidden sm:flex items-center gap-2 pl-2 border-l border-rose-100"><div className="w-8 h-8 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center text-xs font-extrabold">{user.name.charAt(0)}</div><div className="hidden md:block text-left"><div className="text-xs font-bold text-slate-800 max-w-28 truncate">{user.name}</div><div className="text-[10px] text-slate-400 capitalize">{user.role}</div></div><button onClick={onLogout} title="Sign out" className="p-2 text-slate-400 hover:text-rose-600"><LogOut className="w-4 h-4"/></button></div></div></div></div></header>
 {user.role==='resident'&&tab==='home'&&<div className="max-w-6xl mx-auto px-4 sm:px-6 pt-4"><div className="grid grid-cols-2 md:grid-cols-5 gap-3">
  <button onClick={()=>quick('report')} className="group text-left rounded-[24px] p-4 bg-white border border-rose-100 shadow-sm hover:-translate-y-1 hover:shadow-md transition-all"><div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center"><FilePlus2 className="w-5 h-5"/></div><div className="mt-3 font-black text-sm text-slate-900">Report an issue</div><div className="text-[11px] text-slate-500 mt-1">Tell us what happened</div></button>
  <button onClick={()=>quick('issues')} className="group text-left rounded-[24px] p-4 bg-white border border-rose-100 shadow-sm hover:-translate-y-1 hover:shadow-md transition-all"><div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center"><Activity className="w-5 h-5"/></div><div className="mt-3 font-black text-sm text-slate-900">My Issues</div><div className="text-[11px] text-slate-500 mt-1">See ongoing and solved issues</div></button>
  <button onClick={()=>quick('manual')} className="group text-left rounded-[24px] p-4 bg-white border border-rose-100 shadow-sm hover:-translate-y-1 hover:shadow-md transition-all"><div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center"><BookOpen className="w-5 h-5"/></div><div className="mt-3 font-black text-sm text-slate-900">App Manual</div><div className="text-[11px] text-slate-500 mt-1">Learn the app step by step</div></button>
  <button onClick={()=>quick('notices')} className="group text-left rounded-[24px] p-4 bg-white border border-rose-100 shadow-sm hover:-translate-y-1 hover:shadow-md transition-all"><div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center"><Megaphone className="w-5 h-5"/></div><div className="mt-3 font-black text-sm text-slate-900">Society Notices</div><div className="text-[11px] text-slate-500 mt-1">Announcements for residents</div></button>
  <button onClick={()=>quick('chat')} className="group text-left rounded-[24px] p-4 bg-white border border-rose-100 shadow-sm hover:-translate-y-1 hover:shadow-md transition-all"><div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center"><MessageCircle className="w-5 h-5"/></div><div className="mt-3 font-black text-sm text-slate-900">Society Chat</div><div className="text-[11px] text-slate-500 mt-1">Chat with your neighbours</div></button>
 </div></div>}
 <nav className="lg:hidden fixed bottom-0 inset-x-0 z-50 bg-white/96 backdrop-blur-xl border-t border-rose-100 shadow-[0_-5px_20px_rgba(244,63,95,.08)] px-1 pb-[env(safe-area-inset-bottom)]"><div className={`grid gap-0.5 ${items.length===4?'grid-cols-4':'grid-cols-5'}`}>{items.map(([id,text,Icon])=><button key={id} onClick={()=>go(id)} className={`relative py-2.5 flex flex-col items-center gap-0.5 text-[9px] font-bold ${tab===id?'text-rose-600':'text-slate-400'}`}><Icon className="w-5 h-5"/><span>{label(text)}</span>{id==='notifications'&&unread>0&&<span className="absolute top-1.5 right-[calc(50%-12px)] w-2 h-2 rounded-full bg-rose-500 notification-pop"/>}</button>)}</div></nav>
 </>;
};