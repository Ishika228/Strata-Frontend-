import React, { createContext, useContext, useState, useEffect } from 'react';
import { Tenant } from '../types/common';
import { Scheme } from '../types/strata';
import { mockStrataTenant, mockSchemes } from '../lib/strataMockData';

interface TenantContextType {
  tenant: Tenant;
  setTenant: (tenant: Tenant) => void;
  activeScheme: Scheme | null;
  setActiveScheme: (scheme: Scheme | null) => void;
  schemes: Scheme[];
}

const TenantContext = createContext<TenantContextType | undefined>(undefined);

export const TenantProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tenant, setTenant] = useState<Tenant>(mockStrataTenant);
  const [activeScheme, setActiveScheme] = useState<Scheme | null>(mockSchemes[0] || null);

  // Apply tenant brand token to CSS root variable
  useEffect(() => {
    document.documentElement.style.setProperty('--brand', tenant.brandColor);
  }, [tenant.brandColor]);

  return (
    <TenantContext.Provider
      value={{
        tenant,
        setTenant,
        activeScheme,
        setActiveScheme,
        schemes: mockSchemes,
      }}
    >
      {children}
    </TenantContext.Provider>
  );
};

export const useTenant = () => {
  const context = useContext(TenantContext);
  if (!context) throw new Error('useTenant must be used within TenantProvider');
  return context;
};
