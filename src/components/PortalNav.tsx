import React from 'react';
import { Bell, Building2, ClipboardList, FilePlus2, Orbit, Home, LayoutDashboard, LogOut, Megaphone, UserRound, AlarmClock, BarChart3, Search, MessageCircle, Languages } from 'lucide-react';
import { UserAccount, Language } from '../types';

interface Props { user:UserAccount; tab:string; onTab:(tab:string)=>void; unread:number; onLogout:()=>void; onSearch:()=>void; language?:Language; onLanguageChange?:(language:Language)=>void; }

const resident=[['home','Home',Home],['report','Report',FilePlus2],['issues','My Issues',ClipboardList],['chat','Chat',MessageCircle],['notifications','Notifications',Bell],['notices','Society Notices',Megaphone],['profile','Profile',UserRound]] as const;
const admin=[['dashboard','Dashboard',LayoutDashboard],['issues','Issues',ClipboardList],['insights','Insights',BarChart3],['galaxy','Issue Galaxy',Orbit],['notices','Society Notices',Megaphone],['notifications','Notifications',Bell],['reminders','Reminders',AlarmClock]] as const;

const translations:Record<string,Record<string,string>>={
 hindi:{Home:'होम',Report:'शिकायत','My Issues':'मेरी शिकायतें',Chat:'चैट',Notifications:'सूचनाएं','Society Notices':'सोसाइटी नोटिस',Profile:'प्रोफ़ाइल',Dashboard:'डैशबोर्ड',Issues:'मुद्दे',Insights:'विश्लेषण','Issue Galaxy':'इश्यू गैलेक्सी',Reminders:'रिमाइंडर'},
 marathi:{Home:'होम',Report:'तक्रार','My Issues':'माझ्या तक्रारी',Chat:'चॅट',Notifications:'सूचना','Society Notices':'सोसायटी नोटिस',Profile:'प्रोफाइल',Dashboard:'डॅशबोर्ड',Issues:'तक्रारी',Insights:'विश्लेषण','Issue Galaxy':'इश्यू गॅलेक्सी',Reminders:'रिमाइंडर'},
 telugu:{Home:'హోమ్',Report:'ఫిర్యాదు','My Issues':'నా ఫిర్యాదులు',Chat:'చాట్',Notifications:'నోటిఫికేషన్లు','Society Notices':'సొసైటీ నోటీసులు',Profile:'ప్రొఫైల్',Dashboard:'డాష్‌బోర్డ్',Issues:'సమస్యలు',Insights:'విశ్లేషణ','Issue Galaxy':'ఇష్యూ గెలాక్సీ',Reminders:'రిమైండర్లు'},
 gujarati:{Home:'હોમ',Report:'ફરિયાદ','My Issues':'મારી ફરિયાદો',Chat:'ચેટ',Notifications:'સૂચનાઓ','Society Notices':'સોસાયટી નોટિસ',Profile:'પ્રોફાઇલ',Dashboard:'ડેશબોર્ડ',Issues:'મુદ્દાઓ',Insights:'વિશ્લેષણ','Issue Galaxy':'ઇશ્યૂ ગેલેક્સી',Reminders:'રિમાઇન્ડર'},
 punjabi:{Home:'ਹੋਮ',Report:'ਸ਼ਿਕਾਇਤ','My Issues':'ਮੇਰੀਆਂ ਸ਼ਿਕਾਇਤਾਂ',Chat:'ਚੈਟ',Notifications:'ਸੂਚਨਾਵਾਂ','Society Notices':'ਸੋਸਾਇਟੀ ਨੋਟਿਸ',Profile:'ਪ੍ਰੋਫਾਈਲ',Dashboard:'ਡੈਸ਼ਬੋਰਡ',Issues:'ਮੁੱਦੇ',Insights:'ਵਿਸ਼ਲੇਸ਼ਣ','Issue Galaxy':'ਇਸ਼ੂ ਗਲੈਕਸੀ',Reminders:'ਰਿਮਾਈਂਡਰ'},
 bengali:{Home:'হোম',Report:'অভিযোগ','My Issues':'আমার অভিযোগ',Chat:'চ্যাট',Notifications:'বিজ্ঞপ্তি','Society Notices':'সোসাইটি নোটিস',Profile:'প্রোফাইল',Dashboard:'ড্যাশবোর্ড',Issues:'সমস্যা',Insights:'বিশ্লেষণ','Issue Galaxy':'ইস্যু গ্যালাক্সি',Reminders:'রিমাইন্ডার'}
};

const languageOptions:[Language,string,string][]=[['english','English','EN'],['hindi','हिन्दी','HI'],['marathi','मराठी','MR'],['telugu','తెలుగు','TE'],['gujarati','ગુજરાતી','GU'],['punjabi','ਪੰਜਾਬੀ','PA'],['bengali','বাংলা','BN'],['hinglish','Hinglish','HI']];

export const PortalNav:React.FC<Props>=({user,tab,onTab,unread,onLogout,onSearch,language='english',onLanguageChange})=>{
 const items=user.role==='resident'?resident:admin;
 const label=(x:string)=>translations[language]?.[x]||x;
 return <>
  <header className="sticky top-0 z-50 bg-white/92 backdrop-blur-xl border-b border-rose-100 shadow-[0_2px_18px_rgba(244,63,94,0.06)]">
   <div className="max-w-7xl mx-auto px-4 sm:px-6"><div className="h-[68px] flex items-center justify-between gap-3">
    <button onClick={()=>onTab(user.role==='resident'?'home':'dashboard')} className="flex items-center gap-2.5 shrink-0">
      <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-rose-500 to-pink-600 text-white flex items-center justify-center shadow-[0_7px_18px_rgba(244,63,94,.28)]"><Building2 className="w-5 h-5"/></div>
      <div className="hidden sm:block text-left"><div className="font-extrabold tracking-tight text-slate-900">SHIKAYAT <span className="text-rose-500">BOX</span></div><div className="text-[9px] uppercase tracking-wider font-bold text-slate-400">Ek page, aapki baat</div></div>
    </button>
    <nav className="hidden lg:flex items-center gap-1 overflow-x-auto">{items.map(([id,text,Icon])=><button key={id} onClick={()=>onTab(id)} className={`relative px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${tab===id?'bg-rose-50 text-rose-600':'text-slate-500 hover:bg-rose-50/70 hover:text-rose-600'}`}><Icon className="w-4 h-4"/>{label(text)}{id==='notifications'&&unread>0&&<span className="ml-0.5 min-w-4 h-4 px-1 rounded-full bg-rose-500 text-white text-[9px] flex items-center justify-center notification-pop">{unread}</span>}</button>)}</nav>
    <div className="flex items-center gap-1.5">
      {onLanguageChange&&<label className="hidden md:flex items-center gap-1.5 rounded-xl border border-rose-100 bg-rose-50/60 px-2.5 h-10 text-rose-600"><Languages className="w-4 h-4"/><select value={language} onChange={e=>onLanguageChange(e.target.value as Language)} className="bg-transparent outline-none text-xs font-bold text-rose-700 cursor-pointer" aria-label="Select language">{languageOptions.map(([id,native])=><option key={id} value={id}>{native}</option>)}</select></label>}
      <button onClick={onSearch} className="hidden sm:flex p-2.5 rounded-xl hover:bg-rose-50 text-slate-500" aria-label="Search"><Search className="w-4 h-4"/></button>
      <button onClick={()=>onTab('notifications')} className="lg:hidden relative p-2.5 rounded-xl hover:bg-rose-50 text-slate-600"><Bell className="w-5 h-5"/>{unread>0&&<span className="absolute top-1 right-1 w-3.5 h-3.5 rounded-full bg-rose-500 border-2 border-white notification-pop"/>}</button>
      <div className="hidden sm:flex items-center gap-2 pl-2 border-l border-rose-100"><div className="w-8 h-8 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center text-xs font-extrabold">{user.name.charAt(0)}</div><div className="hidden md:block text-left"><div className="text-xs font-bold text-slate-800 max-w-28 truncate">{user.name}</div><div className="text-[10px] text-slate-400 capitalize">{user.role}</div></div><button onClick={onLogout} title="Sign out" className="p-2 text-slate-400 hover:text-rose-600"><LogOut className="w-4 h-4"/></button></div>
    </div>
   </div></div>
  </header>
  <nav className="lg:hidden fixed bottom-0 inset-x-0 z-50 bg-white/96 backdrop-blur-xl border-t border-rose-100 shadow-[0_-5px_20px_rgba(244,63,94,.08)] px-1 pb-[env(safe-area-inset-bottom)]"><div className={`grid grid-cols-${Math.min(items.length,7)} gap-0.5`}>{items.slice(0,7).map(([id,text,Icon])=><button key={id} onClick={()=>onTab(id)} className={`relative py-2.5 flex flex-col items-center gap-0.5 text-[9px] font-bold ${tab===id?'text-rose-600':'text-slate-400'}`}><Icon className="w-5 h-5"/><span>{label(text)}</span>{id==='notifications'&&unread>0&&<span className="absolute top-1.5 right-[calc(50%-12px)] w-2 h-2 rounded-full bg-rose-500 notification-pop"/>}</button>)}</div></nav>
 </>;
};