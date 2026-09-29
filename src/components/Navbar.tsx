import React, { useState } from 'react';
import { 
  Building2, 
  Bell, 
  Search, 
  RotateCcw, 
  UserCheck, 
  ChevronDown, 
  Check, 
  Sparkles, 
  Zap, 
  Layers, 
  MapPin, 
  BarChart3,
  Compass,
  AlertTriangle
} from 'lucide-react';
import { UserAccount, NotificationItem } from '../types';
import { DEMO_USERS } from '../data/seedData';

interface NavbarProps {
  currentTab: string;
  onTabChange: (tab: string) => void;
  currentUser: UserAccount;
  onUserChange: (user: UserAccount) => void;
  notifications: NotificationItem[];
  onNotificationClick: (n: NotificationItem) => void;
  onMarkAllNotificationsRead: () => void;
  onResetDemo: () => Promise<void>;
  onOpenSearch: () => void;
  onOpenTwoMinuteTriage: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onTabChange,
  currentUser,
  onUserChange,
  notifications,
  onNotificationClick,
  onMarkAllNotificationsRead,
  onResetDemo,
  onOpenSearch,
  onOpenTwoMinuteTriage
}) => {
  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [showNotifMenu, setShowNotifMenu] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleReset = async () => {
    if (confirm('Reset database to pristine demo state? (Re-seeds 35+ realistic complaints, clusters, SLA states)')) {
      setIsResetting(true);
      await onResetDemo();
      setIsResetting(false);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-surface/90 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Brand Wordmark */}
          <div className="flex items-center gap-6">
            <button 
              onClick={() => onTabChange('landing')}
              className="flex items-center gap-2.5 text-left group"
            >
              <div className="w-9 h-9 rounded-xl bg-violet-600 flex items-center justify-center text-white shadow-md shadow-violet-200 group-hover:scale-105 transition-transform">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center tracking-tight leading-none text-xl">
                  <span className="font-extrabold text-slate-900">SHIKAYAT</span>
                  <span className="font-extrabold text-violet-600 ml-1">BOX</span>
                </div>
                <div className="text-[10px] uppercase font-semibold text-slate-500 tracking-wider">
                  Society Issue Intelligence
                </div>
              </div>
            </button>

            {/* Navigation tabs */}
            <nav className="hidden md:flex items-center space-x-1 pl-4 border-l border-slate-200">
              <button
                onClick={() => onTabChange('report')}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  currentTab === 'report' 
                    ? 'bg-violet-50 text-violet-700 font-semibold' 
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                Report Issue
              </button>

              <button
                onClick={() => onTabChange('command')}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                  currentTab === 'command' 
                    ? 'bg-violet-50 text-violet-700 font-semibold' 
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <span>Command Center</span>
                <span className="px-1.5 py-0.5 text-[10px] font-bold bg-violet-100 text-violet-700 rounded-full">
                  14
                </span>
              </button>

              <button
                onClick={onOpenTwoMinuteTriage}
                className="px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200/80 hover:bg-amber-100 transition-colors flex items-center gap-1 shadow-xs"
                title="2-Minute Triage for busy volunteer committee members"
              >
                <Zap className="w-3.5 h-3.5 text-amber-600 fill-amber-500" />
                <span>2-Min Triage</span>
              </button>

              <button
                onClick={() => onTabChange('galaxy')}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-1 ${
                  currentTab === 'galaxy' 
                    ? 'bg-violet-50 text-violet-700 font-semibold' 
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Compass className="w-3.5 h-3.5" />
                <span>Issue Galaxy</span>
              </button>

              <button
                onClick={() => onTabChange('heatmap')}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-1 ${
                  currentTab === 'heatmap' 
                    ? 'bg-violet-50 text-violet-700 font-semibold' 
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <MapPin className="w-3.5 h-3.5" />
                <span>Heatmap</span>
              </button>

              <button
                onClick={() => onTabChange('pulse')}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-1 ${
                  currentTab === 'pulse' 
                    ? 'bg-violet-50 text-violet-700 font-semibold' 
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <BarChart3 className="w-3.5 h-3.5" />
                <span>Pulse</span>
              </button>
            </nav>
          </div>

          {/* Right Action Tools: Search, Notifs, Role Switcher, Reset Demo */}
          <div className="flex items-center gap-2">
            
            {/* Quick search shortcut */}
            <button
              onClick={onOpenSearch}
              className="hidden lg:flex items-center gap-2 px-3 py-1.5 text-xs text-slate-500 bg-slate-100 hover:bg-slate-200/80 rounded-lg border border-slate-200 transition-colors"
              title="Search complaints (Press /)"
            >
              <Search className="w-3.5 h-3.5 text-slate-400" />
              <span>Search issues...</span>
              <kbd className="px-1.5 py-0.5 text-[10px] font-mono bg-white rounded border border-slate-200 text-slate-600">
                /
              </kbd>
            </button>

            {/* Notification Bell */}
            <div className="relative">
              <button
                onClick={() => setShowNotifMenu(!showNotifMenu)}
                className="relative p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
                aria-label="Notifications"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-subtle-pulse">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Notification Dropdown */}
              {showNotifMenu && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-xl shadow-elevated border border-slate-200 p-3 z-50 animate-in fade-in slide-in-from-top-2">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100 mb-2">
                    <div className="flex items-center gap-1.5">
                      <Bell className="w-4 h-4 text-violet-600" />
                      <span className="text-sm font-bold text-slate-900">Notifications</span>
                      {unreadCount > 0 && (
                        <span className="text-xs px-2 py-0.5 bg-violet-100 text-violet-700 rounded-full font-semibold">
                          {unreadCount} new
                        </span>
                      )}
                    </div>
                    {unreadCount > 0 && (
                      <button 
                        onClick={() => {
                          onMarkAllNotificationsRead();
                        }}
                        className="text-xs text-violet-600 hover:text-violet-800 font-medium"
                      >
                        Mark all read
                      </button>
                    )}
                  </div>

                  <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
                    {notifications.length === 0 ? (
                      <div className="text-center py-6 text-xs text-slate-400">
                        No notifications yet 🎉
                      </div>
                    ) : (
                      notifications.map(n => (
                        <div
                          key={n.id}
                          onClick={() => {
                            onNotificationClick(n);
                            setShowNotifMenu(false);
                          }}
                          className={`p-2.5 rounded-lg text-xs cursor-pointer transition-colors border ${
                            n.read 
                              ? 'bg-slate-50/60 border-slate-100 text-slate-600' 
                              : 'bg-violet-50/40 border-violet-100 text-slate-800 font-medium'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-1 mb-1">
                            <span className="font-semibold text-slate-900 flex items-center gap-1">
                              {n.urgency === 'CRITICAL' && <span className="w-2 h-2 rounded-full bg-red-500 inline-block" />}
                              {n.title}
                            </span>
                            <span className="text-[10px] text-slate-400 whitespace-nowrap">
                              {new Date(n.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                          <p className="text-slate-600 line-clamp-2 leading-relaxed">
                            {n.message}
                          </p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Role Switcher (Section 46) */}
            <div className="relative">
              <button
                onClick={() => setShowRoleMenu(!showRoleMenu)}
                className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200/70 border border-slate-200/80 transition-colors text-xs"
              >
                <div className={`w-5 h-5 rounded-full flex items-center justify-center font-bold text-[10px] text-white ${
                  currentUser.role === 'resident' 
                    ? 'bg-blue-600' 
                    : currentUser.role === 'committee' 
                    ? 'bg-violet-600' 
                    : 'bg-emerald-600'
                }`}>
                  {currentUser.name.charAt(0)}
                </div>
                <div className="text-left hidden sm:block">
                  <div className="font-semibold text-slate-800 leading-tight">
                    {currentUser.name.split(' ')[0]}
                  </div>
                  <div className="text-[10px] text-slate-500 capitalize">
                    {currentUser.role} {currentUser.flat ? `(${currentUser.flat})` : ''}
                  </div>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {showRoleMenu && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-elevated border border-slate-200 p-2 z-50">
                  <div className="px-2 py-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    Switch Demo Persona
                  </div>
                  <div className="space-y-1">
                    {DEMO_USERS.map(user => (
                      <button
                        key={user.id}
                        onClick={() => {
                          onUserChange(user);
                          setShowRoleMenu(false);
                          if (user.role === 'resident') {
                            onTabChange('report');
                          } else {
                            onTabChange('command');
                          }
                        }}
                        className={`w-full flex items-center justify-between p-2 rounded-lg text-xs text-left transition-colors ${
                          currentUser.id === user.id ? 'bg-violet-50 text-violet-900 font-semibold' : 'hover:bg-slate-100 text-slate-700'
                        }`}
                      >
                        <div>
                          <div className="font-semibold text-slate-900">{user.name}</div>
                          <div className="text-[10px] text-slate-500">{user.title}</div>
                        </div>
                        {currentUser.id === user.id && (
                          <Check className="w-4 h-4 text-violet-600" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Reset Demo Button */}
            <button
              onClick={handleReset}
              disabled={isResetting}
              className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
              title="Reset Demo Data (Re-seed 35+ complaints)"
            >
              <RotateCcw className={`w-4 h-4 ${isResetting ? 'animate-spin text-violet-600' : ''}`} />
            </button>
          </div>

        </div>
      </div>
    </header>
  );
};
