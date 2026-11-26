import React, { useState } from 'react';
import { DataTable } from '../../components/ui/DataTable';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { Plus, Users, Shield } from 'lucide-react';

export const UsersAndRoles: React.FC = () => {
  const users = [
    { id: 'u1', name: 'Sarah Jenkins', email: 's.jenkins@horizonstrata.com.au', role: 'Strata Manager', scope: 'All NSW Schemes', status: 'active' },
    { id: 'u2', name: 'Michael Chang', email: 'm.chang@horizonstrata.com.au', role: 'Strata Accountant', scope: 'All Portfolios', status: 'active' },
    { id: 'u3', name: 'Tom Bradley', email: 't.bradley@horizonfm.com.au', role: 'Lead Technician', scope: 'FM Operations', status: 'active' },
  ];

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100 font-sans">
            Users & Roles Access Control
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Role-based access permissions, tenant membership, and granular security scopes
          </p>
        </div>

        <button
          onClick={() => alert('Invite user modal')}
          className="flex items-center gap-1.5 px-3.5 py-1.5 bg-sky-600 text-white rounded text-xs font-semibold hover:bg-sky-700 shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Invite Staff User</span>
        </button>
      </div>

      <DataTable
        data={users}
        keyExtractor={(u) => u.id}
        columns={[
          { key: 'name', header: 'User Name' },
          { key: 'email', header: 'Email Address' },
          { key: 'role', header: 'Assigned Role' },
          { key: 'scope', header: 'Security Scope' },
          {
            key: 'status',
            header: 'Status',
            render: (u) => <StatusBadge status={u.status} />,
          },
        ]}
      />
    </div>
  );
};
