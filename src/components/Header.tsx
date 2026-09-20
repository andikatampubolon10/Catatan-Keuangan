import React from 'react';
import { RotateCcw, Download, ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface HeaderProps {
  onResetData: () => void;
  onExportData: () => void;
  isDbConnected?: boolean;
}

export const Header: React.FC<HeaderProps> = ({ onResetData, onExportData, isDbConnected = false }) => {
  return (
    <header className="bg-[#0A0A0A] border-b border-[#262626] sticky top-0 z-30">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] uppercase tracking-[0.3em] text-[#A3A3A3] font-semibold">
                Financial Portfolio
              </span>
              <span className="text-[#333333]">&bull;</span>
              <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] tracking-wider uppercase font-medium bg-[#171717] border border-[#262626]">
                <span className={`w-1.5 h-1.5 rounded-full ${isDbConnected ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.7)] animate-pulse' : 'bg-amber-500'}`} />
                <span className={isDbConnected ? 'text-emerald-400' : 'text-amber-400'}>
                  {isDbConnected ? 'MySQL Aktif' : 'Offline Storage'}
                </span>
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-light tracking-tight text-[#F5F5F5]">
              Catatan Keuangan <span className="italic text-[#A3A3A3] font-normal">Bulanan</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2.5">
            <button
              onClick={onExportData}
              title="Unduh Data JSON"
              className="inline-flex items-center gap-1.5 px-3 py-2 text-[11px] font-medium uppercase tracking-wider text-[#A3A3A3] hover:text-[#F5F5F5] bg-[#171717] hover:bg-[#262626] border border-[#333333] hover:border-[#525252] rounded transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Ekspor</span>
            </button>
            <button
              onClick={onResetData}
              title="Reset ke data contoh"
              className="inline-flex items-center gap-1.5 px-3 py-2 text-[11px] font-medium uppercase tracking-wider text-[#737373] hover:text-[#EF4444] bg-[#171717] hover:bg-[#262626] border border-[#333333] hover:border-[#EF4444]/40 rounded transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

