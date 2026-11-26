import React from 'react';
import { PhotoCapture } from '../../components/ui/PhotoCapture';
import { QrCode, Building, Plus } from 'lucide-react';

export const FieldAssetCapture: React.FC = () => {
  return (
    <div className="space-y-4 text-xs">
      <div>
        <h2 className="text-sm font-bold text-white">Field Asset Capture & Tagging</h2>
        <p className="text-slate-400 text-[11px] mt-0.5">
          Scan QR barcode or take camera photo with GPS timestamp to register asset
        </p>
      </div>

      <PhotoCapture label="Take High-Resolution Asset Nameplate Photo" />

      <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 space-y-3">
        <h3 className="font-bold text-white">Asset Details</h3>

        <div>
          <label className="block text-slate-400 mb-1">Asset Code *</label>
          <input
            type="text"
            placeholder="e.g. AST-PMP-005"
            className="w-full p-2 rounded bg-slate-900 border border-slate-700 text-white font-mono"
          />
        </div>

        <div>
          <label className="block text-slate-400 mb-1">Asset Type *</label>
          <select className="w-full p-2 rounded bg-slate-900 border border-slate-700 text-white">
            <option>HVAC</option>
            <option>Lifts</option>
            <option>Plumbing</option>
            <option>Electrical</option>
            <option>Fire Safety</option>
          </select>
        </div>

        <button
          onClick={() => alert('Asset registered in FM register with photo and GPS stamp.')}
          className="w-full py-2.5 bg-emerald-600 text-white font-bold rounded-lg hover:bg-emerald-700 transition"
        >
          Save Asset to Register
        </button>
      </div>
    </div>
  );
};
