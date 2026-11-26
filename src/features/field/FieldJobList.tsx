import React from 'react';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { SLAClock } from '../../components/ui/SLAClock';
import { mockWorkOrders } from '../../lib/mockData';
import { useNavigate } from 'react-router-dom';
import { MapPin, Navigation, Clock } from 'lucide-react';

export const FieldJobList: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-bold text-white">Today's Assigned Jobs</h2>
        <span className="text-[10px] text-emerald-400 font-mono font-bold">2 JOBS SCHEDULED</span>
      </div>

      <div className="space-y-3">
        {mockWorkOrders.slice(0, 2).map((wo) => (
          <div
            key={wo.id}
            onClick={() => navigate(`/field/job/${wo.id}`)}
            className="p-4 rounded-xl bg-slate-800 border border-slate-700 space-y-3 cursor-pointer hover:border-emerald-500 transition text-xs"
          >
            <div className="flex justify-between items-start">
              <div>
                <span className="font-bold text-white text-sm">{wo.number}</span>
                <div className="text-[11px] text-slate-400">{wo.propertyName}</div>
              </div>
              <StatusBadge status={wo.status} />
            </div>

            <p className="text-slate-300 font-medium">{wo.description}</p>

            <div className="flex items-center justify-between pt-2 border-t border-slate-700/60 text-[11px]">
              <div className="flex items-center gap-1 text-slate-400">
                <Clock className="w-3.5 h-3.5 text-sky-400" />
                <span>Scheduled 10:00 AM</span>
              </div>
              <SLAClock
                dueIsoString={wo.slaDue}
                slaPercentUsed={wo.slaPercentUsed}
                slaState={wo.slaState}
              />
            </div>

            <button className="w-full py-2 bg-emerald-600 text-white font-bold rounded-lg hover:bg-emerald-700 transition flex items-center justify-center gap-1.5">
              <Navigation className="w-3.5 h-3.5" />
              <span>Navigate & Open Job</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
