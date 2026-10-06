import React from 'react';
import { Wallet, TrendingUp, TrendingDown, ArrowUpRight, ArrowDownRight, Scale } from 'lucide-react';
import { formatRupiah } from '../../lib/utils.js';

export default function MetricCards({ cashflow }) {
  const { income = 0, expense = 0, balance = 0 } = cashflow || {};

  const isNetPositive = balance >= 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
      {/* 1. Net Balance Card (Primary Yellow, 3px Border) */}
      <div className="bg-[#FFE600] border-3 border-black shadow-[4px_4px_0px_#000000] p-5 sm:p-6 rounded-[6px] relative overflow-hidden transition-transform duration-150 hover:-translate-y-0.5">
        <div className="flex items-center justify-between mb-3">
          <span className="font-heading font-extrabold text-xs uppercase tracking-wider text-black">
            SALDO BERSIH (NET CASH)
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
          <span className="text-zinc-800">
            {isNetPositive ? 'Kondisi Kas Surplus' : 'Kondisi Kas Defisit'}
          </span>
          <span className={`neo-badge ${isNetPositive ? 'bg-[#00D26A] text-black' : 'bg-[#FF4B4B] text-white'}`}>
            {isNetPositive ? '+ SEHAT' : '! DEFISIT'}
          </span>
        </div>
      </div>

      {/* 2. Total Pemasukan (Income Card) */}
      <div className="bg-white border-2 border-black shadow-[4px_4px_0px_#000000] p-5 sm:p-6 rounded-[6px] transition-transform duration-150 hover:-translate-y-0.5">
        <div className="flex items-center justify-between mb-3">
          <span className="font-heading font-extrabold text-xs uppercase tracking-wider text-zinc-700">
            TOTAL PEMASUKAN
          </span>
          <div className="w-8 h-8 bg-[#00E5CC] text-black flex items-center justify-center rounded-[4px] border-2 border-black shadow-[2px_2px_0px_#000]">
            <TrendingUp className="w-4 h-4 text-black" strokeWidth={2.5} />
          </div>
        </div>

        <div className="my-2">
          <div className="font-mono font-bold text-2xl sm:text-3xl text-[#008f4c] tracking-tight">
            +{formatRupiah(income)}
          </div>
        </div>

        <div className="mt-3 pt-3 border-t-2 border-zinc-200 flex items-center justify-between text-xs font-mono font-semibold text-zinc-600">
          <span className="flex items-center gap-1">
            <ArrowUpRight className="w-3.5 h-3.5 text-[#00D26A]" strokeWidth={2.5} />
            Arus Kas Masuk
          </span>
          <span className="neo-badge bg-[#D4F8E8] text-black">
            INFLOW
          </span>
        </div>
      </div>

      {/* 3. Total Pengeluaran (Expense Card) */}
      <div className="bg-white border-2 border-black shadow-[4px_4px_0px_#000000] p-5 sm:p-6 rounded-[6px] transition-transform duration-150 hover:-translate-y-0.5">
        <div className="flex items-center justify-between mb-3">
          <span className="font-heading font-extrabold text-xs uppercase tracking-wider text-zinc-700">
            TOTAL PENGELUARAN
          </span>
          <div className="w-8 h-8 bg-[#FF4B4B] text-white flex items-center justify-center rounded-[4px] border-2 border-black shadow-[2px_2px_0px_#000]">
            <TrendingDown className="w-4 h-4 text-white" strokeWidth={2.5} />
          </div>
        </div>

        <div className="my-2">
          <div className="font-mono font-bold text-2xl sm:text-3xl text-[#d42b2b] tracking-tight">
            -{formatRupiah(expense)}
          </div>
        </div>

        <div className="mt-3 pt-3 border-t-2 border-zinc-200 flex items-center justify-between text-xs font-mono font-semibold text-zinc-600">
          <span className="flex items-center gap-1">
            <ArrowDownRight className="w-3.5 h-3.5 text-[#FF4B4B]" strokeWidth={2.5} />
            Arus Kas Keluar
          </span>
          <span className="neo-badge bg-[#FFE4E4] text-black">
            OUTFLOW
          </span>
        </div>
      </div>
    </div>
  );
}
