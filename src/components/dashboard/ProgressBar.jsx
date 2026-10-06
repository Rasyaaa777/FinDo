import React, { useEffect, useRef } from 'react';
import { CheckCircle2, Trophy, Clock } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function ProgressBar({ todos = [] }) {
  const total = todos.length;
  const completed = todos.filter(t => t.is_completed).length;
  const percentage = total === 0 ? 0 : Math.round((completed / total) * 100);
  const isAllDone = total > 0 && completed === total;
  const prevDoneRef = useRef(false);

  // Trigger celebratory confetti when reaching 100% completion
  useEffect(() => {
    if (isAllDone && !prevDoneRef.current) {
      try {
        confetti({
          particleCount: 60,
          spread: 60,
          origin: { y: 0.6 }
        });
      } catch (e) {}
    }
    prevDoneRef.current = isAllDone;
  }, [isAllDone]);

  return (
    <div className="bg-white border-2 border-black shadow-[4px_4px_0px_#000000] p-4 sm:p-5 rounded-[6px]">
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-[#FFE600] border-2 border-black flex items-center justify-center rounded-[3px]">
            {isAllDone ? (
              <Trophy className="w-3.5 h-3.5 text-black" strokeWidth={2.5} />
            ) : (
              <Clock className="w-3.5 h-3.5 text-black" strokeWidth={2.5} />
            )}
          </div>
          <span className="font-heading font-bold text-sm tracking-tight text-black">
            PROGRES HARIAN:
          </span>
          <span className="font-mono text-sm font-semibold text-zinc-700">
            {total === 0 ? (
              "Belum ada agenda jam hari ini"
            ) : (
              <>
                <strong className="text-black">{completed}</strong> dari{' '}
                <strong className="text-black">{total}</strong> tugas selesai
              </>
            )}
          </span>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          {isAllDone && (
            <span className="neo-badge bg-[#00D26A] text-black animate-bounce">
              SEMUA BERES! 🎉
            </span>
          )}
          <div className="font-mono font-extrabold text-xl sm:text-2xl text-black">
            {percentage}%
          </div>
        </div>
      </div>

      {/* Progress Track & Fill */}
      <div className="w-full h-5 sm:h-6 bg-[#EAE6DC] border-2 border-black rounded-[4px] overflow-hidden p-0.5 relative shadow-inner">
        <div
          className={`h-full transition-all duration-300 ease-out border-r-2 border-black ${
            isAllDone ? 'bg-[#00D26A]' : percentage > 0 ? 'bg-[#00E5CC]' : 'bg-transparent'
          }`}
          style={{ width: `${percentage}%` }}
        />
      </div>

      {/* Subtle indicator tags */}
      <div className="mt-2.5 flex items-center justify-between text-[11px] font-mono text-zinc-600">
        <span>0%</span>
        <span>50% Target Tengah Hari</span>
        <span>100% Tuntas</span>
      </div>
    </div>
  );
}
