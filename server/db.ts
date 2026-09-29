import fs from 'fs';
import path from 'path';
import { Complaint, MasterIssue, NotificationItem, UserAccount } from '../src/types';
import { INITIAL_COMPLAINTS, INITIAL_MASTER_ISSUES, INITIAL_NOTIFICATIONS, DEMO_USERS } from '../src/data/seedData';

const DATA_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'db.json');

export interface DatabaseSchema {
  users: UserAccount[];
  complaints: Complaint[];
  master_issues: MasterIssue[];
  notifications: NotificationItem[];
  metadata: {
    last_reset: string;
    version: string;
    society_name: string;
    total_flats: number;
  };
}

class RelationalDatabase {
  private data: DatabaseSchema;

  constructor() {
    this.data = this.loadOrSeed();
  }

  private loadOrSeed(): DatabaseSchema {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        const parsed = JSON.parse(raw);
        if (parsed.complaints && Array.isArray(parsed.complaints) && parsed.complaints.length > 0) {
          return parsed;
        }
      }
    } catch (err) {
      console.warn('[DB] Failed reading db.json, re-seeding...', err);
    }

    const seeded: DatabaseSchema = {
      users: DEMO_USERS,
      complaints: INITIAL_COMPLAINTS,
      master_issues: INITIAL_MASTER_ISSUES,
      notifications: INITIAL_NOTIFICATIONS,
      metadata: {
        last_reset: new Date().toISOString(),
        version: '1.0.0',
        society_name: 'Greenwood Heights Society',
        total_flats: 104
      }
    };

    this.persist(seeded);
    return seeded;
  }

  private persist(schema?: DatabaseSchema): void {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      const toSave = schema || this.data;
      fs.writeFileSync(DB_FILE, JSON.stringify(toSave, null, 2), 'utf-8');
    } catch (err) {
      console.error('[DB] Persist error:', err);
    }
  }

  public resetToSeed(): DatabaseSchema {
    this.data = {
      users: DEMO_USERS,
      complaints: INITIAL_COMPLAINTS,
      master_issues: INITIAL_MASTER_ISSUES,
      notifications: INITIAL_NOTIFICATIONS,
      metadata: {
        last_reset: new Date().toISOString(),
        version: '1.0.0',
        society_name: 'Greenwood Heights Society',
        total_flats: 104
      }
    };
    this.persist();
    return this.data;
  }

  public getComplaints(): Complaint[] {
    return this.data.complaints;
  }

  public getComplaintById(id: string): Complaint | undefined {
    return this.data.complaints.find(c => c.id === id || c.case_id.toLowerCase() === id.toLowerCase());
  }

  public createComplaint(complaint: Complaint): Complaint {
    this.data.complaints.unshift(complaint);
    
    // Add notification
    const notification: NotificationItem = {
      id: `n-${Date.now()}`,
      type: complaint.urgency === 'CRITICAL' ? 'CRITICAL' : 'ASSIGNED',
      title: `${complaint.urgency} Issue Reported`,
      message: `${complaint.case_id} (${complaint.resident_flat}): ${complaint.normalized_summary.slice(0, 60)}...`,
      complaint_id: complaint.id,
      case_id: complaint.case_id,
      timestamp: new Date().toISOString(),
      read: false,
      urgency: complaint.urgency
    };
    this.data.notifications.unshift(notification);

    this.persist();
    return complaint;
  }

  public updateComplaint(id: string, updates: Partial<Complaint>): Complaint | null {
    const index = this.data.complaints.findIndex(c => c.id === id || c.case_id.toLowerCase() === id.toLowerCase());
    if (index === -1) return null;

    const current = this.data.complaints[index];
    const updated = {
      ...current,
      ...updates,
      updated_at: new Date().toISOString()
    };
    this.data.complaints[index] = updated;
    this.persist();
    return updated;
  }

  public getMasterIssues(): MasterIssue[] {
    return this.data.master_issues;
  }

  public createMasterIssue(master: MasterIssue): MasterIssue {
    this.data.master_issues.unshift(master);
    
    // Update linked child complaints
    for (const childId of master.child_complaint_ids) {
      const idx = this.data.complaints.findIndex(c => c.id === childId);
      if (idx !== -1) {
        this.data.complaints[idx].master_issue_id = master.id;
        this.data.complaints[idx].status = 'IN_PROGRESS';
        this.data.complaints[idx].timeline.push({
          id: `t-merged-${Date.now()}-${childId}`,
          timestamp: new Date().toISOString(),
          type: 'MERGED',
          title: `Merged into Master Issue ${master.master_case_id}`,
          description: `Consolidated under: ${master.title}`,
          actor: 'Committee Triage'
        });
      }
    }

    this.persist();
    return master;
  }

  public getNotifications(): NotificationItem[] {
    return this.data.notifications;
  }

  public markNotificationRead(id: string): void {
    const n = this.data.notifications.find(item => item.id === id);
    if (n) {
      n.read = true;
      this.persist();
    }
  }

  public markAllNotificationsRead(): void {
    this.data.notifications.forEach(n => { n.read = true; });
    this.persist();
  }
}

export const db = new RelationalDatabase();
