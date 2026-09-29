import React from 'react';
import { IssueDirectory } from './IssueDirectory';
import { Complaint, UserAccount } from '../types';

interface ResidentTrackingProps {
  complaint?: Complaint;
  currentUser: UserAccount;
  onBack: () => void;
  onRefreshComplaint?: () => void;
}

export const ResidentTracking: React.FC<ResidentTrackingProps> = ({ currentUser, onBack }) => {
  return <IssueDirectory currentUser={currentUser} onBack={onBack} />;
};
