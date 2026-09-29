import React from 'react';
import { IssueDirectory } from './IssueDirectory';
import { UserAccount } from '../types';

export const ResidentTracking: React.FC<{ currentUser: UserAccount; onBack: () => void }> = ({ currentUser, onBack }) => {
  return <IssueDirectory currentUser={currentUser} onBack={onBack} />;
};
