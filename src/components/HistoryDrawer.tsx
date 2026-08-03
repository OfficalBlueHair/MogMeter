import React from 'react';
import { MogAnalysisResult } from '../types';
import { History, X, Trash2, ArrowRight } from 'lucide-react';

interface HistoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  history: MogAnalysisResult[];
  onSelectResult: (res: MogAnalysisResult) => void;
  onClearHistory: () => void;
}

export const HistoryDrawer: React.FC<HistoryDrawerProps> = ({
  isOpen,
  onClose,
  history,
  onSelectResult,
  onClearHistory,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex justify-end">
      <div className="bg-stone-900 border-l border-stone-800 max-w-sm w-full h-full p-5 flex flex-col justify-between shadow-2xl animate-slide-left">
        {/* Header */}
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-stone-800 pb-3">
            <div className="flex items-center gap-2 text-stone-100 font-semibold text-sm">
              <History className="w-4 h-4 text-emerald-400" />
              <span>Geçmiş Mogging Analizleri</span>
            </div>
            <button
              onClick={onClose}
              className="p-1 text-stone-400 hover:text-white rounded-lg hover:bg-stone-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* List */}
          {history.length === 0 ? (
            <div className="text-center py-12 text-stone-500 text-xs">
              Henüz kaydedilmiş bir analiz geçmişi yok.
            </div>
          ) : (
            <div className="space-y-3 overflow-y-auto max-h-[calc(100vh-180px)] pr-1">
              {history.map((item) => (
                <div
                  key={item.id}
                  onClick={() => {
                    onSelectResult(item);
                    onClose();
                  }}
                  className="p-3 bg-stone-950/70 border border-stone-800 rounded-xl hover:border-emerald-500/40 cursor-pointer transition-all flex items-center gap-3 group"
                >
                  <img
                    src={item.imageUrl}
                    alt="Analiz"
                    className="w-12 h-12 rounded-lg object-cover bg-stone-900 border border-stone-800 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-semibold text-stone-200 truncate">{item.faceName}</h4>
                    <p className="text-[10px] text-stone-400 font-mono">
                      {new Date(item.timestamp).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-bold text-emerald-400 font-mono block">
                      {item.mogScore}
                    </span>
                    <ArrowRight className="w-3.5 h-3.5 text-stone-600 group-hover:text-emerald-400 transition-colors ml-auto" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {history.length > 0 && (
          <button
            onClick={onClearHistory}
            className="w-full py-2.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/20 text-xs font-medium rounded-xl flex items-center justify-center gap-2 transition-colors mt-4"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Tüm Geçmişi Temizle</span>
          </button>
        )}
      </div>
    </div>
  );
};
