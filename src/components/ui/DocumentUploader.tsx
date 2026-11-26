import React, { useState } from 'react';
import { UploadCloud, CheckCircle2, AlertCircle, Loader2, File } from 'lucide-react';
import { cn } from '../../lib/utils';

interface DocumentUploaderProps {
  onUploadComplete?: (fileInfo: { name: string; size: number; hash: string; scanStatus: 'clean' | 'scanning' | 'infected' }) => void;
  allowedTypes?: string[];
  maxSizeMB?: number;
  className?: string;
}

export const DocumentUploader: React.FC<DocumentUploaderProps> = ({
  onUploadComplete,
  allowedTypes = ['.pdf', '.docx', '.png', '.jpg', '.xlsx'],
  maxSizeMB = 20,
  className,
}) => {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [scanStatus, setScanStatus] = useState<'idle' | 'scanning' | 'clean' | 'infected'>('idle');
  const [uploadedFile, setUploadedFile] = useState<{ name: string; size: number; hash: string } | null>(null);

  const simulateUpload = async (file: File) => {
    setUploading(true);
    setProgress(15);
    setScanStatus('scanning');

    // Simulate SHA-256 client hash calculation
    const arrayBuffer = await file.arrayBuffer();
    const hashBuffer = await crypto.subtle.digest('SHA-256', arrayBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('').substring(0, 16);

    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 95) {
          clearInterval(interval);
          setUploading(false);
          setScanStatus('clean');
          const res = { name: file.name, size: file.size, hash: hashHex, scanStatus: 'clean' as const };
          setUploadedFile(res);
          if (onUploadComplete) onUploadComplete(res);
          return 100;
        }
        return p + 20;
      });
    }, 150);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      simulateUpload(e.dataTransfer.files[0]);
    }
  };

  return (
    <div
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDrop}
      className={cn(
        'border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-lg p-6 text-center bg-slate-50/50 dark:bg-slate-900/50 hover:bg-slate-50 transition',
        className
      )}
    >
      <input
        type="file"
        id="file-upload"
        className="hidden"
        onChange={(e) => e.target.files?.[0] && simulateUpload(e.target.files[0])}
      />

      <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center">
        <UploadCloud className="w-10 h-10 text-slate-400 mb-2" />
        <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
          Click to upload or drag & drop files
        </span>
        <span className="text-xs text-slate-500 mt-1">
          Supported: {allowedTypes.join(', ')} (Max {maxSizeMB} MB)
        </span>
      </label>

      {uploading && (
        <div className="mt-4 max-w-xs mx-auto space-y-2">
          <div className="flex justify-between text-xs text-slate-500">
            <span>Uploading & calculating SHA-256...</span>
            <span>{progress}%</span>
          </div>
          <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-1.5 overflow-hidden">
            <div className="bg-sky-600 h-full transition-all" style={{ width: `${progress}%` }} />
          </div>
        </div>
      )}

      {uploadedFile && scanStatus === 'clean' && (
        <div className="mt-4 p-3 bg-white dark:bg-slate-800 rounded-md border border-slate-200 dark:border-slate-700 max-w-sm mx-auto flex items-center justify-between text-xs text-left">
          <div className="flex items-center gap-2 truncate">
            <File className="w-4 h-4 text-sky-500 shrink-0" />
            <div className="truncate">
              <div className="font-semibold truncate">{uploadedFile.name}</div>
              <div className="text-[10px] text-slate-400 font-mono">SHA-256: {uploadedFile.hash}...</div>
            </div>
          </div>
          <div className="flex items-center gap-1 text-emerald-600 text-[10px] font-bold shrink-0 ml-2">
            <CheckCircle2 className="w-4 h-4" /> Clean
          </div>
        </div>
      )}
    </div>
  );
};
