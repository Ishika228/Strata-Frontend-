import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PhotoCapture } from '../../components/ui/PhotoCapture';
import { mockWorkOrders } from '../../lib/mockData';
import { CheckCircle2, ArrowLeft, Clock, ShieldCheck } from 'lucide-react';

export const FieldJobExecution: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const wo = mockWorkOrders.find((w) => w.id === id) || mockWorkOrders[0];

  const [checkedItems, setCheckedItems] = useState([true, false]);
  const [complete, setComplete] = useState(false);

  const handleFinish = () => {
    setComplete(true);
    alert('Job completed and saved to offline queue. Syncing to server.');
  };

  return (
    <div className="space-y-4">
      <button
        onClick={() => navigate('/field')}
        className="inline-flex items-center gap-1 text-xs text-slate-400 hover:text-white"
      >
        <ArrowLeft className="w-3.5 h-3.5" /> Back to Today's List
      </button>

      <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 space-y-2 text-xs">
        <div className="flex justify-between items-center">
          <span className="font-bold text-white text-base">{wo.number}</span>
          <span
            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
              wo.priority === 'P1'
                ? 'bg-red-500 text-white'
                : wo.priority === 'P2'
                ? 'bg-orange-500 text-white'
                : 'bg-emerald-500 text-white'
            }`}
          >
            {wo.priority}
          </span>
        </div>
        <div className="text-slate-300 font-semibold">{wo.description}</div>
        <div className="text-slate-400 text-[11px]">{wo.propertyName}</div>
      </div>

      {/* Safety Checklist */}
      <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 space-y-3 text-xs">
        <h3 className="font-bold text-white">Technician Checklist</h3>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={checkedItems[0]}
            onChange={(e) => setCheckedItems([e.target.checked, checkedItems[1]])}
            className="rounded text-emerald-500"
          />
          <span className="text-slate-300">Safety lock-out applied</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={checkedItems[1]}
            onChange={(e) => setCheckedItems([checkedItems[0], e.target.checked])}
            className="rounded text-emerald-500"
          />
          <span className="text-slate-300">Diagnostic run completed & logged</span>
        </label>
      </div>

      {/* Photo Capture with GPS */}
      <PhotoCapture label="Snap Completion Proof Photo" />

      <button
        onClick={handleFinish}
        className="w-full py-3 bg-emerald-600 text-white font-bold rounded-xl text-xs hover:bg-emerald-700 shadow-lg transition"
      >
        {complete ? 'Job Completed ✔' : 'Complete Job & Submit Evidence'}
      </button>
    </div>
  );
};
