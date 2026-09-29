import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { LandingPage } from './components/LandingPage';
import { ResidentReport } from './components/ResidentReport';
import { ResidentTracking } from './components/ResidentTracking';
import { CommandCenter } from './components/CommandCenter';
import { IssueIntelligenceModal } from './components/IssueIntelligenceModal';
import { ResolutionModal } from './components/ResolutionModal';
import { TwoMinuteTriage } from './components/TwoMinuteTriage';
import { MasterIssueModal } from './components/MasterIssueModal';
import { IssueGalaxy } from './components/IssueGalaxy';
import { SocietyHeatmap } from './components/SocietyHeatmap';
import { SocietyPulse } from './components/SocietyPulse';
import { SearchModal } from './components/SearchModal';
import { api } from './services/api';
import { DEMO_USERS } from './data/seedData';
import { Complaint, MasterIssue, NotificationItem, UserAccount } from './types';

export function App() {
  const [currentUser, setCurrentUser] = useState<UserAccount>(DEMO_USERS[0]); // default Mrs. Sharma
  const [currentTab, setCurrentTab] = useState<string>('landing');
  
  // Data states
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [masterIssues, setMasterIssues] = useState<MasterIssue[]>([]);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Active Selected Modals / Entities
  const [activeComplaint, setActiveComplaint] = useState<Complaint | null>(null);
  const [activeMaster, setActiveMaster] = useState<MasterIssue | null>(null);
  const [resolvingComplaint, setResolvingComplaint] = useState<Complaint | null>(null);
  const [isTwoMinuteOpen, setIsTwoMinuteOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [trackedCaseId, setTrackedCaseId] = useState<string>('WC-024');

  // Load data on mount
  const refreshAllData = async () => {
    try {
      const [cList, mList, nList] = await Promise.all([
        api.getComplaints(),
        api.getMasterIssues(),
        api.getNotifications()
      ]);
      setComplaints(cList);
      setMasterIssues(mList);
      setNotifications(nList);
    } catch (e) {
      console.warn('Data fetch error:', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshAllData();
  }, []);

  // Keyboard shortcut: '/' triggers search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '/' && !['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Handlers
  const handleUserChange = (newUser: UserAccount) => {
    setCurrentUser(newUser);
  };

  const handleResetDemo = async () => {
    await api.resetDemoData();
    await refreshAllData();
  };

  const handleOpenComplaint = (c: Complaint) => {
    setActiveComplaint(c);
  };

  const handleOpenTrackCase = (caseId: string) => {
    setTrackedCaseId(caseId);
    setCurrentTab('track');
  };

  const handleCreateMaintenanceTask = async (title: string) => {
    const task = await api.createComplaint({
      original_message: `Maintenance Task: ${title}`,
      resident_name: 'Managing Committee',
      resident_flat: 'Facility',
      wing: 'B Wing',
      location_detail: 'Pump / Infrastructure Shaft'
    });
    await refreshAllData();
  };

  // Find tracked complaint
  const currentTrackedComplaint = complaints.find(
    c => c.case_id.toLowerCase() === trackedCaseId.toLowerCase() || c.id === trackedCaseId
  ) || complaints[0];

  const defaultMaster = masterIssues[0] || {
    id: 'master-water-b',
    master_case_id: 'WC-M024',
    title: 'Water supply disruption — B Wing',
    category: 'Water' as any,
    urgency: 'HIGH' as any,
    impact_score: 78,
    affected_flats_count: 23,
    affected_locations: ['B Wing'],
    child_complaint_ids: ['c-001', 'c-002', 'c-003', 'c-004', 'c-005', 'c-006', 'c-007'],
    first_reported_at: new Date().toISOString(),
    latest_report_at: new Date().toISOString(),
    assigned_to: 'Rohan Sharma (Maintenance Lead)',
    status: 'IN_PROGRESS' as any,
    sla_deadline: new Date().toISOString(),
    created_at: new Date().toISOString(),
    recommended_action: 'Inspect B Wing riser line pressure, check booster motor breaker, and bleed air from upper floor manifolds.'
  };

  return (
    <div className="min-h-screen bg-background text-[#0F172A] flex flex-col">
      
      {/* Sticky Global Navbar */}
      <Navbar
        currentTab={currentTab}
        onTabChange={setCurrentTab}
        currentUser={currentUser}
        onUserChange={handleUserChange}
        notifications={notifications}
        onNotificationClick={(n) => {
          if (n.complaint_id) {
            const found = complaints.find(c => c.id === n.complaint_id || c.case_id === n.case_id);
            if (found) setActiveComplaint(found);
          }
        }}
        onMarkAllNotificationsRead={() => api.markAllNotificationsRead().then(refreshAllData)}
        onResetDemo={handleResetDemo}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenTwoMinuteTriage={() => setIsTwoMinuteOpen(true)}
      />

      {/* Main View Area */}
      <main className="flex-1">
        {currentTab === 'landing' && (
          <LandingPage
            onStartReport={() => setCurrentTab('report')}
            onOpenDashboard={() => {
              setCurrentUser(DEMO_USERS[1]); // switch to committee lead Rohan Sharma
              setCurrentTab('command');
            }}
          />
        )}

        {currentTab === 'report' && (
          <ResidentReport
            currentUser={currentUser}
            onSubmitSuccess={(caseId) => {
              setTrackedCaseId(caseId);
              refreshAllData();
            }}
            onViewCase={handleOpenTrackCase}
          />
        )}

        {currentTab === 'track' && currentTrackedComplaint && (
          <ResidentTracking
            complaint={currentTrackedComplaint}
            currentUser={currentUser}
            onBack={() => setCurrentTab('command')}
            onRefreshComplaint={refreshAllData}
          />
        )}

        {currentTab === 'command' && (
          <CommandCenter
            complaints={complaints}
            masterIssues={masterIssues}
            currentUser={currentUser}
            onOpenIssue={handleOpenComplaint}
            onOpenMaster={(m) => setActiveMaster(m)}
            onOpenTwoMinuteTriage={() => setIsTwoMinuteOpen(true)}
            onOpenResolution={(c) => setResolvingComplaint(c)}
            onRefresh={refreshAllData}
          />
        )}

        {currentTab === 'galaxy' && (
          <IssueGalaxy
            masterIssue={defaultMaster}
            allComplaints={complaints}
            onSelectComplaint={handleOpenComplaint}
            onSelectMaster={(m) => setActiveMaster(m)}
          />
        )}

        {currentTab === 'heatmap' && (
          <SocietyHeatmap
            complaints={complaints}
            onSelectComplaint={handleOpenComplaint}
          />
        )}

        {currentTab === 'pulse' && (
          <SocietyPulse
            complaints={complaints}
            onCreateMaintenanceTask={handleCreateMaintenanceTask}
          />
        )}
      </main>

      {/* GLOBAL MODALS */}

      {/* Issue Intelligence Modal (3-Panel Deep Dive) */}
      {activeComplaint && (
        <IssueIntelligenceModal
          complaint={activeComplaint}
          currentUser={currentUser}
          onClose={() => setActiveComplaint(null)}
          onOpenResolution={(c) => {
            setActiveComplaint(null);
            setResolvingComplaint(c);
          }}
          onRefresh={refreshAllData}
        />
      )}

      {/* 2-Minute Triage Fast Lane Modal */}
      {isTwoMinuteOpen && (
        <TwoMinuteTriage
          complaints={complaints}
          currentUser={currentUser}
          onClose={() => setIsTwoMinuteOpen(false)}
          onOpenIssue={handleOpenComplaint}
          onAssignQuick={async (c) => {
            await api.updateComplaint(c.id, {
              assigned_to: 'Rohan Sharma (Maintenance Lead)',
              status: 'IN_PROGRESS'
            });
            refreshAllData();
          }}
          onResolveQuick={(c) => {
            setIsTwoMinuteOpen(false);
            setResolvingComplaint(c);
          }}
          onMergeQuick={async (c) => {
            setIsTwoMinuteOpen(false);
            setActiveMaster(defaultMaster);
          }}
        />
      )}

      {/* Resolution & Evidence Modal */}
      {resolvingComplaint && (
        <ResolutionModal
          complaint={resolvingComplaint}
          currentUser={currentUser}
          onClose={() => setResolvingComplaint(null)}
          onSuccess={refreshAllData}
        />
      )}

      {/* Master Issue Consolidated Modal */}
      {activeMaster && (
        <MasterIssueModal
          masterIssue={activeMaster}
          allComplaints={complaints}
          onClose={() => setActiveMaster(null)}
          onOpenComplaint={handleOpenComplaint}
        />
      )}

      {/* Global Search Modal */}
      <SearchModal
        complaints={complaints}
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectComplaint={handleOpenComplaint}
      />

    </div>
  );
}

export default App;
