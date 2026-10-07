import React from 'react';
import { Wallet, TrendingUp, TrendingDown, ArrowUpRight, ArrowDownRight, Scale } from 'lucide-react';
import { formatRupiah } from '../../lib/utils.js';

export default function MetricCards({ cashflow, monthLabel = '' }) {
  const { income = 0, expense = 0, balance = 0 } = cashflow || {};

  const isNetPositive = balance >= 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
      {/* 1. Net Balance Card (Primary Yellow, 3px Border) */}
      <div className="bg-[#FFE600] border-3 border-black shadow-[4px_4px_0px_#000000] dark:shadow-[4px_4px_0px_rgba(255,255,255,0.2)] p-5 sm:p-6 rounded-[6px] relative overflow-hidden transition-transform duration-150 hover:-translate-y-0.5">
        <div className="flex items-center justify-between mb-3">
          <span className="font-heading font-extrabold text-xs uppercase tracking-wider text-black">
            SALDO BERSIH {monthLabel ? `(${monthLabel.toUpperCase()})` : '(NET CASH)'}
          </span>
          <div className="w-8 h-8 bg-black text-white flex items-center justify-center rounded-[4px] border border-black shadow-[2px_2px_0px_rgba(0,0,0,0.3)]">
            <Scale className="w-4 h-4 text-[#FFE600]" strokeWidth={2.5} />
          </div>
        </div>

        <div className="my-2">
          <div className="font-mono font-bold text-2xl sm:text-3xl text-black tracking-tight">
            {balance < 0 ? '-' : ''}{formatRupiah(balance)}
          </div>
        </div>

        <div className="mt-3 pt-3 border-t-2 border-black/20 flex items-center justify-between text-xs font-mono font-bold">
          <span className="text-zinc-900 font-bold">
            {isNetPositive ? 'Kondisi Kas Surplus' : 'Kondisi Kas Defisit'}
          </span>
          <span className={`neo-badge ${isNetPositive ? 'bg-[#00D26A] text-black font-extrabold' : 'bg-black text-white font-extrabold'}`}>
            {isNetPositive ? '+ SEHAT' : '! DEFISIT'}
          </span>
        </div>
      </div>

      {/* 2. Total Pemasukan (Income Card) */}
      <div className="bg-white dark:bg-[#1E1E22] border-2 border-black dark:border-white/20 shadow-[4px_4px_0px_#000000] dark:shadow-[4px_4px_0px_rgba(255,255,255,0.1)] p-5 sm:p-6 rounded-[6px] transition-transform duration-150 hover:-translate-y-0.5">
        <div className="flex items-center justify-between mb-3">
          <span className="font-heading font-extrabold text-xs uppercase tracking-wider text-zinc-700 dark:text-zinc-300">
            TOTAL PEMASUKAN
          </span>
          <div className="w-8 h-8 bg-[#00E5CC] text-black flex items-center justify-center rounded-[4px] border-2 border-black shadow-[2px_2px_0px_#000]">
            <TrendingUp className="w-4 h-4 text-black" strokeWidth={2.5} />
          </div>
        </div>

        <div className="my-2">
          <div className="font-mono font-bold text-2xl sm:text-3xl text-[#00A859] dark:text-[#00E5CC] tracking-tight">
            +{formatRupiah(income)}
          </div>
        </div>

        <div className="mt-3 pt-3 border-t-2 border-zinc-200 dark:border-zinc-800 flex items-center justify-between text-xs font-mono font-semibold text-zinc-600 dark:text-zinc-400">
          <span className="flex items-center gap-1">
            <ArrowUpRight className="w-3.5 h-3.5 text-[#00D26A]" strokeWidth={2.5} />
            Arus Kas Masuk
          </span>
          <span className="neo-badge bg-[#D4F8E8] dark:bg-[#00D26A]/20 text-black dark:text-[#00D26A] font-bold border border-black/20 dark:border-[#00D26A]/30">
            INFLOW
          </span>
        </div>
      </div>

      {/* 3. Total Pengeluaran (Expense Card) */}
      <div className="bg-white dark:bg-[#1E1E22] border-2 border-black dark:border-white/20 shadow-[4px_4px_0px_#000000] dark:shadow-[4px_4px_0px_rgba(255,255,255,0.1)] p-5 sm:p-6 rounded-[6px] transition-transform duration-150 hover:-translate-y-0.5">
        <div className="flex items-center justify-between mb-3">
          <span className="font-heading font-extrabold text-xs uppercase tracking-wider text-zinc-700 dark:text-zinc-300">
            TOTAL PENGELUARAN
          </span>
          <div className="w-8 h-8 bg-[#FF4B4B] text-white flex items-center justify-center rounded-[4px] border-2 border-black shadow-[2px_2px_0px_#000]">
            <TrendingDown className="w-4 h-4 text-white" strokeWidth={2.5} />
          </div>
        </div>

        <div className="my-2">
          <div className="font-mono font-bold text-2xl sm:text-3xl text-[#d42b2b] dark:text-[#FF6B6B] tracking-tight">
            -{formatRupiah(expense)}
          </div>
        </div>

        <div className="mt-3 pt-3 border-t-2 border-zinc-200 dark:border-zinc-800 flex items-center justify-between text-xs font-mono font-semibold text-zinc-600 dark:text-zinc-400">
          <span className="flex items-center gap-1">
            <ArrowDownRight className="w-3.5 h-3.5 text-[#FF4B4B]" strokeWidth={2.5} />
            Arus Kas Keluar
          </span>
          <span className="neo-badge bg-[#FFE4E4] dark:bg-[#FF4B4B]/20 text-black dark:text-[#FF6B6B] font-bold border border-black/20 dark:border-[#FF4B4B]/30">
            OUTFLOW
          </span>
        </div>
      </div>
    </div>
  );
}
