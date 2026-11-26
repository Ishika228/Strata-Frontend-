import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { TenantProvider } from './context/TenantContext';
import { AuthProvider } from './context/AuthContext';
import { AIAssistantProvider } from './context/AIAssistantContext';

// Layouts
import { AppShell } from './components/layout/AppShell';

// Strata Core Modules
import { StrataDashboard } from './features/strata/StrataDashboard';
import { PropertyManagement } from './features/strata/PropertyManagement';
import { FinancialManagement } from './features/strata/FinancialManagement';
import { OperationsManagement } from './features/strata/OperationsManagement';
import { CommunicationEngagement } from './features/strata/CommunicationEngagement';
import { ReportsAdministration } from './features/strata/ReportsAdministration';
import { OwnerPortal } from './features/strata/OwnerPortal';

export const App: React.FC = () => {
  return (
    <TenantProvider>
      <AuthProvider>
        <AIAssistantProvider>
          <BrowserRouter>
            <Routes>
              {/* Root redirect to Dashboard */}
              <Route path="/" element={<Navigate to="/app/fm/dashboard" replace />} />

              {/* Main App Layout */}
              <Route path="/app" element={<AppShell />}>
                <Route index element={<Navigate to="/app/fm/dashboard" replace />} />

                {/* 1. Dashboard (DO NOT TOUCH) */}
                <Route path="fm/dashboard" element={<StrataDashboard />} />
                <Route path="strata/dashboard" element={<StrataDashboard />} />

                {/* 2. Property Management */}
                <Route path="property" element={<Navigate to="/app/property/schemes" replace />} />
                <Route path="property/schemes" element={<PropertyManagement key="property-schemes" initialTab="schemes" />} />
                <Route path="property/roll" element={<PropertyManagement key="property-roll" initialTab="roll" />} />
                <Route path="property/compliance" element={<PropertyManagement key="property-compliance" initialTab="compliance" />} />
                {/* Backward compatibility aliases */}
                <Route path="fm/properties" element={<Navigate to="/app/property/schemes" replace />} />
                <Route path="fm/assets" element={<Navigate to="/app/property/roll" replace />} />
                <Route path="fm/compliance" element={<Navigate to="/app/property/compliance" replace />} />
                <Route path="fm/lifecycle" element={<Navigate to="/app/property/roll" replace />} />

                {/* 3. Financial Management */}
                <Route path="finance" element={<Navigate to="/app/finance/budgets" replace />} />
                <Route path="finance/budgets" element={<FinancialManagement key="fin-budgets" initialTab="budgets" />} />
                <Route path="finance/levies" element={<FinancialManagement key="fin-levies" initialTab="levies" />} />
                <Route path="finance/receipts" element={<FinancialManagement key="fin-receipts" initialTab="receipts" />} />
                <Route path="finance/bank-rec" element={<FinancialManagement key="fin-bank-rec" initialTab="bank-rec" />} />
                <Route path="finance/arrears" element={<FinancialManagement key="fin-arrears" initialTab="arrears" />} />
                <Route path="finance/invoices" element={<FinancialManagement key="fin-invoices" initialTab="invoices" />} />
                <Route path="finance/gl" element={<FinancialManagement key="fin-gl" initialTab="gl" />} />
                {/* Backward compatibility aliases */}
                <Route path="fm/planner" element={<Navigate to="/app/finance/budgets" replace />} />
                <Route path="fm/ppm" element={<Navigate to="/app/finance/budgets" replace />} />
                <Route path="fm/work-orders" element={<Navigate to="/app/finance/levies" replace />} />
                <Route path="fm/requests" element={<Navigate to="/app/finance/receipts" replace />} />
                <Route path="fm/ops-centre" element={<Navigate to="/app/finance/bank-rec" replace />} />
                <Route path="fm/inspections" element={<Navigate to="/app/finance/arrears" replace />} />
                <Route path="common/approvals" element={<Navigate to="/app/finance/invoices" replace />} />

                {/* 4. Operations & Management */}
                <Route path="operations" element={<Navigate to="/app/operations/works" replace />} />
                <Route path="operations/works" element={<OperationsManagement key="ops-works" initialTab="works" />} />
                <Route path="operations/suppliers" element={<OperationsManagement key="ops-suppliers" initialTab="suppliers" />} />
                <Route path="operations/meetings" element={<OperationsManagement key="ops-meetings" initialTab="meetings" />} />
                {/* Backward compatibility aliases */}
                <Route path="fm/dispatch" element={<Navigate to="/app/operations/works" replace />} />
                <Route path="common/suppliers" element={<Navigate to="/app/operations/suppliers" replace />} />
                <Route path="fm/contacts" element={<Navigate to="/app/operations/meetings" replace />} />

                {/* 5. Communication & Engagement */}
                <Route path="communication" element={<Navigate to="/app/communication/comms" replace />} />
                <Route path="communication/comms" element={<CommunicationEngagement key="comm-comms" initialTab="comms" />} />
                <Route path="communication/portal" element={<CommunicationEngagement key="comm-portal" initialTab="portal" />} />
                <Route path="communication/notifications" element={<Navigate to="/app/communication/comms" replace />} />

                {/* 6. Reports & Statements */}
                <Route path="reports" element={<Navigate to="/app/reports/statements" replace />} />
                <Route path="reports/statements" element={<ReportsAdministration initialTab="statements" />} />
                <Route path="fm/sla" element={<ReportsAdministration initialTab="statements" />} />

                {/* Administration: Users & Roles and Settings as separate options */}
                <Route path="users" element={<ReportsAdministration initialTab="users" />} />
                <Route path="settings" element={<Navigate to="/app/settings/rules" replace />} />
                <Route path="settings/rules" element={<ReportsAdministration initialTab="system" initialSubTab="rules" />} />
                <Route path="settings/jurisdictions" element={<ReportsAdministration initialTab="system" initialSubTab="jurisdictions" />} />
                <Route path="settings/banking" element={<ReportsAdministration initialTab="system" initialSubTab="banking" />} />
                <Route path="settings/gst" element={<ReportsAdministration initialTab="system" initialSubTab="gst" />} />
                <Route path="settings/system" element={<Navigate to="/app/settings/rules" replace />} />
                <Route path="settings/users" element={<Navigate to="/app/users" replace />} />
                <Route path="settings/*" element={<Navigate to="/app/settings/rules" replace />} />
              </Route>

              {/* Portals & Standalone Routes */}
              <Route path="/field" element={<CommunicationEngagement initialTab="comms" />} />
              <Route path="/owner-portal" element={<OwnerPortal initialRole="owner" />} />
              <Route path="/fm-portal" element={<OwnerPortal initialRole="owner" />} />
              <Route path="/portal" element={<OwnerPortal initialRole="owner" />} />

              {/* Fallback 404 */}
              <Route
                path="*"
                element={
                  <div className="flex flex-col items-center justify-center h-screen bg-slate-50 text-center p-6">
                    <h1 className="text-4xl font-bold text-slate-800 font-sans">404</h1>
                    <p className="text-sm text-slate-500 mt-2">
                      Page not found or you do not have permission to view this scope.
                    </p>
                    <a
                      href="/app/fm/dashboard"
                      className="mt-4 px-4 py-2 bg-[#00B5A4] text-white rounded text-xs font-semibold"
                    >
                      Return to Strata Dashboard
                    </a>
                  </div>
                }
              />
            </Routes>
          </BrowserRouter>
        </AIAssistantProvider>
      </AuthProvider>
    </TenantProvider>
  );
};

export default App;
