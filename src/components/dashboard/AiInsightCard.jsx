import React from 'react';
import { Sparkles, CheckCircle2, AlertTriangle, ShieldCheck, Flame, Loader2 } from 'lucide-react';

export default function AiInsightCard({
  insightData,
  onAnalyze,
  isLoading
}) {
  const {
    status = "Aman",
    insight = "Klik tombol di bawah untuk menganalisis keselarasan jam kerja produktif dan alokasi arus kas hari ini dengan AI Gemini.",
    action_items = [
      "Sinkronkan target to-do dengan alokasi jam kerja efektif.",
      "Kendalikan pos pengeluaran harian agar tetap sesuai anggaran."
    ]
  } = insightData || {};

  const getStatusBadge = () => {
    switch (status) {
      case 'Kritis':
        return (
          <span className="neo-badge bg-[#FF4B4B] text-white flex items-center gap-1">
            <Flame className="w-3 h-3" strokeWidth={3} />
            KRITIS
          </span>
        );
      case 'Perhatian':
        return (
          <span className="neo-badge bg-[#FFAA00] text-black flex items-center gap-1">
            <AlertTriangle className="w-3 h-3" strokeWidth={3} />
            PERHATIAN
          </span>
        );
      case 'Aman':
      default:
        return (
          <span className="neo-badge bg-[#00D26A] text-black flex items-center gap-1">
            <ShieldCheck className="w-3 h-3" strokeWidth={3} />
            AMAN
          </span>
        );
    }
  };

  return (
    <div className="bg-white border-3 border-black shadow-[6px_6px_0px_#000000] rounded-[6px] overflow-hidden">
      {/* Neo-Brutalist Top Banner */}
      <div className="bg-[#FF2A85] text-white px-4 py-2.5 border-b-2 border-black flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-white" strokeWidth={2.5} />
          <span className="font-heading font-extrabold text-xs sm:text-sm tracking-wider uppercase">
            AI INTEL: GEMINI 1.5
          </span>
        </div>
        <div className="flex items-center gap-2">
          {getStatusBadge()}
        </div>
      </div>

      {/* Card Content Body */}
      <div className="p-4 sm:p-5 space-y-4">
        {/* Key Evaluation Text */}
        <div className="bg-[#F6F4EE] border-2 border-black p-3.5 rounded-[4px] shadow-[2px_2px_0px_#000]">
          <p className="text-xs font-mono font-bold text-zinc-500 uppercase mb-1">
            EVALUASI CERDAS
          </p>
          <p className="text-sm font-body font-semibold text-black leading-relaxed">
            {insight}
          </p>
        </div>

        {/* Action Items Box */}
        {action_items && action_items.length > 0 && (
          <div className="space-y-2">
            <p className="text-xs font-heading font-extrabold uppercase tracking-wide text-zinc-800">
              TINDAKAN SOLUTIF DIREKOMENDASIKAN:
            </p>
            <div className="space-y-2">
              {action_items.map((action, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-2.5 p-2.5 bg-white border-2 border-black rounded-[4px] shadow-[2px_2px_0px_#000]"
                >
                  <div className="mt-0.5 w-4 h-4 rounded-full bg-[#FFE600] border-2 border-black flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-3 h-3 text-black" strokeWidth={3} />
                  </div>
                  <span className="text-xs sm:text-sm font-medium text-black">
                    {action}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* CTA Button */}
        <div className="pt-2">
          <button
            onClick={onAnalyze}
            disabled={isLoading}
            className="w-full neo-btn neo-btn-accent py-2.5 sm:py-3 text-xs sm:text-sm"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-black" strokeWidth={2.5} />
                MENGANALISIS DATA DENGAN AI...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-black" strokeWidth={2.5} />
                MINTA SARAN CERDAS GEMINI
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
