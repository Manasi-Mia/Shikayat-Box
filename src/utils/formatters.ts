import { Urgency, Status, Category } from '../types';

export function formatTimeAgo(isoString: string): string {
  const date = new Date(isoString);
  const now = new Date();
  const diffSec = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffSec < 60) return 'Just now';
  if (diffSec < 3600) return `${Math.floor(diffSec / 60)}m ago`;
  if (diffSec < 86400) return `${Math.floor(diffSec / 3600)}h ago`;
  return `${Math.floor(diffSec / 86400)}d ago`;
}

export function formatDateTime(isoString: string): string {
  const date = new Date(isoString);
  return date.toLocaleString('en-IN', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });
}

export function formatSlaCountdown(deadlineIso: string): { text: string; isBreached: boolean; isWarning: boolean } {
  const deadline = new Date(deadlineIso).getTime();
  const now = Date.now();
  const diffMs = deadline - now;

  if (diffMs <= 0) {
    const overdueMins = Math.abs(Math.floor(diffMs / 60000));
    const h = Math.floor(overdueMins / 60);
    const m = overdueMins % 60;
    return {
      text: `BREACHED (${h > 0 ? `${h}h ` : ''}${m}m overdue)`,
      isBreached: true,
      isWarning: false
    };
  }

  const totalSec = Math.floor(diffMs / 1000);
  const hours = Math.floor(totalSec / 3600);
  const minutes = Math.floor((totalSec % 3600) / 60);
  const seconds = totalSec % 60;

  const paddedH = String(hours).padStart(2, '0');
  const paddedM = String(minutes).padStart(2, '0');
  const paddedS = String(seconds).padStart(2, '0');

  const text = `${paddedH}:${paddedM}:${paddedS} remaining`;
  const isWarning = totalSec < 3600; // Less than 1 hour left

  return { text, isBreached: false, isWarning };
}

export function getUrgencyBadgeClasses(urgency: Urgency): { bg: string; text: string; border: string; dot: string } {
  switch (urgency) {
    case 'CRITICAL':
      return { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200', dot: 'bg-red-500' };
    case 'HIGH':
      return { bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-200', dot: 'bg-orange-500' };
    case 'MEDIUM':
      return { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', dot: 'bg-amber-500' };
    case 'LOW':
      return { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', dot: 'bg-emerald-500' };
  }
}

export function getCategoryIconName(category: Category): string {
  switch (category) {
    case 'Water': return 'Droplets';
    case 'Lift': return 'ArrowUpDown';
    case 'Parking': return 'Car';
    case 'Cleaning': return 'Sparkles';
    case 'Security': return 'ShieldAlert';
    case 'Electricity': return 'Zap';
    case 'Noise': return 'Volume2';
    default: return 'HelpCircle';
  }
}

export function getStatusBadgeClasses(status: Status): { bg: string; text: string; border: string } {
  switch (status) {
    case 'NEW':
      return { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' };
    case 'ASSIGNED':
      return { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200' };
    case 'IN_PROGRESS':
      return { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' };
    case 'RESOLVED':
      return { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' };
  }
}
