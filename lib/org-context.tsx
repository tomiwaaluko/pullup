import React, { createContext, useContext, useState } from 'react';
import { Organization } from '@/lib/types';

interface OrgContextType {
  currentOrg: Organization | null;
  setCurrentOrg: (org: Organization | null) => void;
}

const OrgContext = createContext<OrgContextType | undefined>(undefined);

export function OrgProvider({ children }: { children: React.ReactNode }) {
  const [currentOrg, setCurrentOrg] = useState<Organization | null>(null);

  return (
    <OrgContext.Provider value={{ currentOrg, setCurrentOrg }}>
      {children}
    </OrgContext.Provider>
  );
}

export function useCurrentOrg() {
  const context = useContext(OrgContext);
  if (context === undefined) {
    throw new Error('useCurrentOrg must be used within an OrgProvider');
  }
  return context;
}
