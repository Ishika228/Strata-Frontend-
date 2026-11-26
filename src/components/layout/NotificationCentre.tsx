import React from 'react';
import { Bell, CheckCheck, X, AlertCircle, Info, Clock } from 'lucide-react';
import { NotificationItem } from '../../types/common';
import { formatDateTime } from '../../lib/utils';

interface NotificationCentreProps {
  isOpen: boolean;
  onClose: () => void;
}

const mockNotifications: NotificationItem[] = [
  {
    id: 'notif-1',
    title: 'SLA At Risk: Lift A Work Order',
    message: 'WO-8801 at The Pacific Heights has reached 84% SLA elapsed time.',
    time: '2026-11-23T09:10:00Z',
    read: false,
    type: 'warning',
  },
  {
    id: 'notif-2',
    title: 'Committee Invoice Approval Required',
    message: 'Invoice INV-2026-904 from KONE ($4,250.00) requires treasurer review.',
    time: '2026-11-23T08:45:00Z',
    read: false,
    type: 'critical',
  },
  {
    id: 'notif-3',
    title: 'Levy Run Q2 FY27 Generated',
    message: '48 notices created successfully for SP10492 totaling $43,500.00.',
    time: '2026-11-22T14:30:00Z',
    read: true,
    type: 'success',
  },
];

export const NotificationCentre: React.FC<NotificationCentreProps> = ({ isOpen, onClose }) => {
  const [items, setItems] = React.useState(mockNotifications);

  if (!isOpen) return null;

  return (
    <div className="fixed top-14 right-4 z-40 w-80 sm:w-96 bg-white dark:bg-slate-900 shadow-2xl rounded-lg border border-slate-200 dark:border-slate-800 overflow-hidden animate-in fade-in">
      <div className="flex items-center justify-between p-3.5 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <Bell className="w-4 h-4 text-sky-600" />
          <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">Notifications</h4>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setItems(items.map((i) => ({ ...i, read: true })))}
            className="text-[11px] text-sky-600 hover:underline"
          >
            Mark all read
          </button>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="max-h-80 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800">
        {items.map((item) => (
          <div key={item.id} className="p-3 text-xs space-y-1 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-slate-800 dark:text-slate-200">{item.title}</span>
              {!item.read && <span className="w-2 h-2 rounded-full bg-sky-500" />}
            </div>
            <p className="text-slate-500 dark:text-slate-400 text-[11px]">{item.message}</p>
            <div className="text-[10px] text-slate-400 font-mono">{formatDateTime(item.time)}</div>
          </div>
        ))}
      </div>
    </div>
  );
};
