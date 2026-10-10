import React from 'react';
import { Receipt, TrendingUp, TrendingDown, Scale, PieChart, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { formatRupiah, calculateCategoryBreakdown } from '../../lib/utils.js';

export default function MonthlyFinanceCard({
  monthlyCashflow = { income: 0, expense: 0, balance: 0 },
  monthlyRecords = [],
  monthName = '',
  onNavigate
}) {
  const { income = 0, expense = 0, balance = 0 } = monthlyCashflow;
  const isSurplus = balance >= 0;

  // Breakdown expense categories
  const { categories = [] } = calculateCategoryBreakdown(monthlyRecords, 'expense');

  // Savings / surplus ratio
  const surplusRatio = income > 0 ? Math.round((balance / income) * 100) : 0;

  // Category palette
  const getCategoryColor = (index) => {
    const colors = ['bg-[#FF2A85]', 'bg-[#FFE600]', 'bg-[#00E5CC]', 'bg-[#FFAA00]', 'bg-[#8338EC]'];
    return colors[index % colors.length];
  };

  return (
    <div className="bg-white dark:bg-[#1E1E24] border-2 sm:border-3 border-black shadow-[3px_3px_0px_#000000] p-3 sm:p-3.5 rounded-[5px] transition-transform duration-150 hover:-translate-y-0.5 h-full flex flex-col justify-between">
      {/* Header */}
      <div>
        <div className="flex items-center justify-between gap-1.5 pb-2 mb-2 border-b-2 border-black">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-[#00E5CC] border border-black flex items-center justify-center rounded-[2px] shadow-[1px_1px_0px_#000]">
              <Receipt className="w-3.5 h-3.5 text-black" strokeWidth={2.5} />
            </div>
            <div>
              <span className="text-[9px] font-mono font-extrabold uppercase tracking-wider text-zinc-500 block">
                LAPORAN KAS BULANAN
              </span>
              <h3 className="font-heading font-extrabold text-xs sm:text-sm text-black dark:text-white uppercase tracking-tight">
                KEUANGAN {monthName ? `(${monthName.toUpperCase()})` : ''}
              </h3>
            </div>
          </div>

          <span
            className={`neo-badge text-[9px] py-0.5 px-1.5 font-bold border border-black ${
              isSurplus ? 'bg-[#00D26A] text-black' : 'bg-[#FF4B4B] text-white'
            }`}
          >
            {isSurplus ? 'SURPLUS KAS' : 'DEFISIT KAS'}
          </span>
        </div>

        {/* 3 Metric Mini Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-1.5 my-2">
          {/* Net Cash */}
          <div className="p-2 bg-[#FFE600] border border-black rounded-[3px] shadow-[1.5px_1.5px_0px_#000]">
            <span className="text-[8px] sm:text-[9px] font-mono font-bold text-black uppercase block">
              SALDO BERSIH
            </span>
            <div className="font-heading font-extrabold text-xs sm:text-sm text-black truncate my-0.5">
              {balance < 0 ? '-' : ''}{formatRupiah(balance)}
            </div>
            <span className="text-[8px] font-mono font-bold text-zinc-800 block truncate">
              {income > 0 ? `${surplusRatio}% sisa` : 'Net Cashflow'}
            </span>
          </div>

          {/* Total Inflow */}
          <div className="p-2 bg-white dark:bg-[#1E1E24] border border-black rounded-[3px] shadow-[1px_1px_0px_#000]">
            <div className="flex items-center justify-between">
              <span className="text-[8px] sm:text-[9px] font-mono font-bold text-zinc-500 uppercase block">
                PEMASUKAN
              </span>
              <ArrowUpRight className="w-3 h-3 text-[#008f4c]" strokeWidth={2.5} />
            </div>
            <div className="font-heading font-extrabold text-xs sm:text-sm text-[#008f4c] dark:text-[#00D26A] truncate my-0.5">
              +{formatRupiah(income)}
            </div>
            <span className="text-[8px] font-mono text-zinc-500 block truncate">
              Inflow bulan ini
            </span>
          </div>

          {/* Total Outflow */}
          <div className="p-2 bg-white dark:bg-[#1E1E24] border border-black rounded-[3px] shadow-[1px_1px_0px_#000]">
            <div className="flex items-center justify-between">
              <span className="text-[8px] sm:text-[9px] font-mono font-bold text-zinc-500 uppercase block">
                PENGELUARAN
              </span>
              <ArrowDownRight className="w-3 h-3 text-[#d42b2b] dark:text-[#FF4B4B]" strokeWidth={2.5} />
            </div>
            <div className="font-heading font-extrabold text-xs sm:text-sm text-[#d42b2b] dark:text-[#FF4B4B] truncate my-0.5">
              -{formatRupiah(expense)}
            </div>
            <span className="text-[8px] font-mono text-zinc-500 block truncate">
              Outflow bulan ini
            </span>
          </div>
        </div>

        {/* Expense Category Breakdown */}
        <div className="mt-2.5 pt-2 border-t border-dashed border-black/30">
          <div className="flex items-center justify-between mb-1.5">
            <span className="font-heading font-extrabold text-[10px] uppercase tracking-wide text-zinc-700 dark:text-zinc-300 flex items-center gap-1">
              <PieChart className="w-3 h-3" />
              POS PENGELUARAN TERBESAR
            </span>
            <span className="text-[9px] font-mono font-semibold text-zinc-500">
              {categories.length} Kategori
            </span>
          </div>

          {categories.length === 0 ? (
            <div className="p-2 bg-[#F6F4EE] dark:bg-[#151518] border border-black rounded text-center text-[10px] font-mono text-zinc-500">
              Belum ada pengeluaran tercatat di bulan ini.
            </div>
          ) : (
            <div className="space-y-1.5">
              {categories.slice(0, 3).map((item, idx) => (
                <div key={item.category} className="space-y-0.5">
                  <div className="flex items-center justify-between text-[10px] font-mono font-bold">
                    <span className="flex items-center gap-1 truncate text-black dark:text-white">
                      <span className={`w-1.5 h-1.5 rounded-full border border-black ${getCategoryColor(idx)}`} />
                      {item.category}
                    </span>
                    <span className="text-zinc-700 dark:text-zinc-300">
                      {formatRupiah(item.amount)} ({item.percentage}%)
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-[#EAE6DC] dark:bg-zinc-800 border border-black rounded-full overflow-hidden">
                    <div
                      className={`h-full ${getCategoryColor(idx)} border-r border-black`}
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="mt-2.5 pt-2 border-t border-black/20 flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 text-[10px] font-mono">
        <p className="text-zinc-600 dark:text-zinc-400 font-medium truncate">
          {isSurplus
            ? `🟢 Tabungan surplus Rp ${balance.toLocaleString('id-ID')}`
            : `🔴 Defisit Rp ${Math.abs(balance).toLocaleString('id-ID')}`}
        </p>
        {onNavigate && (
          <button
            onClick={() => onNavigate('finance')}
            className="neo-btn neo-btn-accent text-[9px] py-1 px-2 self-start sm:self-auto shrink-0 shadow-[1px_1px_0px_#000]"
          >
            BUKU KAS ➜
          </button>
        )}
      </div>
    </div>
  );
}
