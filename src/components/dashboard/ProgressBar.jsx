import React, { useEffect, useRef } from 'react';
import { CheckCircle2, Trophy, Clock, ArrowRight, Sparkles, Target, Zap } from 'lucide-react';
import confetti from 'canvas-confetti';
import { formatTime } from '../../lib/utils.js';

export default function ProgressBar({ todos = [], onNavigate }) {
  const total = todos.length;
  const completed = todos.filter(t => t.is_completed).length;
  const pending = total - completed;
  const percentage = total === 0 ? 0 : Math.round((completed / total) * 100);
  const isAllDone = total > 0 && completed === total;
  const prevDoneRef = useRef(false);

  // Next upcoming pending task today
  const nextTask = todos.find(t => !t.is_completed);

  // Trigger celebratory confetti when reaching 100% completion
  useEffect(() => {
    if (isAllDone && !prevDoneRef.current) {
      try {
        confetti({
          particleCount: 70,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (e) {}
    }
    prevDoneRef.current = isAllDone;
  }, [isAllDone]);

  // Circular gauge calculations (r=30, circumference ~ 188.5)
  const radius = 30;
  const circumference = 2 * Math.PI * radius;
  const strokeOffset = circumference - (percentage / 100) * circumference;

  const getStatusBadge = () => {
    if (total === 0) return { label: 'BELUM ADA TUGAS', bg: 'bg-zinc-200 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-300' };
    if (isAllDone) return { label: 'SEMUA TUNTAS! 🎉', bg: 'bg-[#00D26A] text-black animate-bounce' };
    if (percentage >= 60) return { label: 'PRODUKTIF 🚀', bg: 'bg-[#00E5CC] text-black' };
    if (percentage > 0) return { label: 'SEDANG JALAN 🔥', bg: 'bg-[#FFE600] text-black' };
    return { label: 'SIAP MULAI ⏰', bg: 'bg-zinc-200 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-300' };
  };

  const status = getStatusBadge();

  return (
    <div className="bg-white dark:bg-[#1E1E24] border-2 sm:border-3 border-black shadow-[3px_3px_0px_#000000] p-3 sm:p-3.5 rounded-[5px] h-full flex flex-col justify-between transition-transform duration-150 hover:-translate-y-0.5">
      {/* Top Header */}
      <div>
        <div className="flex items-center justify-between gap-1.5 pb-2 mb-2 border-b-2 border-black">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-[#FFE600] border border-black flex items-center justify-center rounded-[2px] shadow-[1px_1px_0px_#000]">
              {isAllDone ? (
                <Trophy className="w-3.5 h-3.5 text-black" strokeWidth={2.5} />
              ) : (
                <Target className="w-3.5 h-3.5 text-black" strokeWidth={2.5} />
              )}
            </div>
            <div>
              <span className="text-[9px] font-mono font-extrabold uppercase text-zinc-500 block">
                TARGET HARI INI
              </span>
              <h3 className="font-heading font-extrabold text-xs sm:text-sm uppercase tracking-tight text-black dark:text-white">
                PROGRES HARIAN
              </h3>
            </div>
          </div>

          <span className={`neo-badge text-[9px] py-0.5 px-1.5 font-bold ${status.bg} border border-black`}>
            {status.label}
          </span>
        </div>

        {/* Circular Gauge & Hero Stat */}
        <div className="flex flex-col items-center justify-center py-1">
          <div className="relative w-20 h-20 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 80 80">
              {/* Background circle */}
              <circle
                cx="40"
                cy="40"
                r={radius}
                className="stroke-zinc-200 dark:stroke-zinc-800"
                strokeWidth="8"
                fill="transparent"
              />
              {/* Animated Progress circle */}
              <circle
                cx="40"
                cy="40"
                r={radius}
                className={`transition-all duration-700 ease-out ${
                  isAllDone
                    ? 'stroke-[#00D26A]'
                    : percentage > 50
                    ? 'stroke-[#00E5CC]'
                    : 'stroke-[#FFE600]'
                }`}
                strokeWidth="8"
                strokeDasharray={circumference}
                strokeDashoffset={strokeOffset}
                strokeLinecap="round"
                fill="transparent"
              />
            </svg>

            {/* Inner text */}
            <div className="absolute flex flex-col items-center justify-center text-center">
              <span className="font-heading font-extrabold text-lg sm:text-xl text-black dark:text-white leading-none">
                {percentage}%
              </span>
              <span className="text-[8px] font-mono font-bold text-zinc-500 uppercase mt-0.5">
                SELESAI
              </span>
            </div>
          </div>

          <div className="text-center mt-1">
            <span className="font-heading font-extrabold text-xs text-black dark:text-white">
              {completed} <span className="text-zinc-500 font-normal">dari</span> {total} Tugas
            </span>
            <p className="text-[9px] font-mono text-zinc-500">
              {total === 0
                ? 'Belum ada agenda tugas hari ini'
                : isAllDone
                ? 'Target hari ini beres!'
                : `${pending} tugas lagi untuk 100%`}
            </p>
          </div>
        </div>

        {/* Next Task Highlight Pill */}
        {nextTask ? (
          <div className="mt-1.5 p-2 bg-[#FAF8F3] dark:bg-[#151518] border border-black rounded-[3px] shadow-[1px_1px_0px_#000]">
            <div className="flex items-center gap-1 text-[8px] font-mono font-extrabold text-zinc-500 uppercase mb-0.5">
              <Zap className="w-2.5 h-2.5 text-[#FFE600]" strokeWidth={3} />
              <span>FOKUS BERIKUTNYA</span>
            </div>
            <div className="flex items-center justify-between gap-1.5">
              <p className="font-heading font-bold text-[11px] text-black dark:text-white truncate">
                {nextTask.task_title}
              </p>
              <span className="neo-badge bg-[#FFE600] text-black text-[8px] py-0 px-1 font-bold shrink-0 border border-black">
                {formatTime(nextTask.start_time)}
              </span>
            </div>
          </div>
        ) : total > 0 ? (
          <div className="mt-1.5 p-1.5 bg-[#E6F9F0] dark:bg-[#06331C] border border-black rounded-[3px] text-center">
            <span className="text-[10px] font-heading font-extrabold text-[#008f4c] dark:text-[#00D26A] flex items-center justify-center gap-1">
              <CheckCircle2 className="w-3 h-3" /> Hari ini tuntas!
            </span>
          </div>
        ) : null}
      </div>

      {/* Bottom Horizontal Bar & Navigation */}
      <div className="mt-2 pt-2 border-t border-black/20 space-y-1.5">
        <div className="w-full h-2 bg-[#EAE6DC] dark:bg-zinc-800 border border-black rounded-[2px] overflow-hidden p-0.5 shadow-inner">
          <div
            className={`h-full transition-all duration-300 ease-out border-r border-black ${
              isAllDone ? 'bg-[#00D26A]' : percentage > 0 ? 'bg-[#00E5CC]' : 'bg-transparent'
            }`}
            style={{ width: `${percentage}%` }}
          />
        </div>

        {onNavigate && (
          <button
            onClick={() => onNavigate('todos')}
            className="w-full neo-btn neo-btn-secondary text-[9px] py-1 px-1.5 flex items-center justify-center gap-1 shadow-[1px_1px_0px_#000]"
          >
            <span>BUKA JADWAL HARI INI</span>
            <ArrowRight className="w-2.5 h-2.5" />
          </button>
        )}
      </div>
    </div>
  );
}
