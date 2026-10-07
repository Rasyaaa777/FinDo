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
    <div className="bg-white border-3 border-black shadow-[6px_6px_0px_#000000] p-5 sm:p-6 rounded-[6px] transition-transform duration-150 hover:-translate-y-0.5 flex flex-col justify-between">
      {/* Header */}
      <div>
        <div className="flex items-center justify-between gap-2 pb-3 mb-4 border-b-2 border-black">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-[#00E5CC] border-2 border-black flex items-center justify-center rounded-[3px] shadow-[2px_2px_0px_#000]">
              <Receipt className="w-4 h-4 text-black" strokeWidth={2.5} />
            </div>
            <div>
              <span className="text-[10px] sm:text-xs font-mono font-extrabold uppercase tracking-wider text-zinc-500 block">
                LAPORAN KAS BULANAN
              </span>
              <h3 className="font-heading font-extrabold text-base sm:text-lg text-black dark:text-white uppercase tracking-tight">
                KEUANGAN {monthName ? `(${monthName.toUpperCase()})` : ''}
              </h3>
            </div>
          </div>

          <span
            className={`neo-badge text-xs py-1 px-2.5 font-bold ${
              isSurplus ? 'bg-[#00D26A] text-black' : 'bg-[#FF4B4B] text-white'
            }`}
          >
            {isSurplus ? 'SURPLUS KAS' : 'DEFISIT KAS'}
          </span>
        </div>

        {/* 3 Metric Mini Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 my-3">
          {/* Net Cash */}
          <div className="p-3.5 bg-[#FFE600] border-2 border-black rounded-[4px] shadow-[2px_2px_0px_#000]">
            <span className="text-[10px] font-mono font-bold text-black uppercase block">
              SALDO BERSIH
            </span>
            <div className="font-heading font-extrabold text-lg sm:text-xl text-black truncate my-0.5">
              {balance < 0 ? '-' : ''}{formatRupiah(balance)}
            </div>
            <span className="text-[10px] font-mono font-bold text-zinc-800 block">
              {income > 0 ? `${surplusRatio}% sisa pemasukan` : 'Net Cashflow'}
            </span>
          </div>

          {/* Total Inflow */}
          <div className="p-3.5 bg-white border-2 border-black rounded-[4px] shadow-[2px_2px_0px_#000]">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold text-zinc-500 uppercase block">
                PEMASUKAN
              </span>
              <ArrowUpRight className="w-3.5 h-3.5 text-[#008f4c]" strokeWidth={2.5} />
            </div>
            <div className="font-heading font-extrabold text-lg sm:text-xl text-[#008f4c] truncate my-0.5">
              +{formatRupiah(income)}
            </div>
            <span className="text-[10px] font-mono text-zinc-500 block">
              Inflow bulan ini
            </span>
          </div>

          {/* Total Outflow */}
          <div className="p-3.5 bg-white border-2 border-black rounded-[4px] shadow-[2px_2px_0px_#000]">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold text-zinc-500 uppercase block">
                PENGELUARAN
              </span>
              <ArrowDownRight className="w-3.5 h-3.5 text-[#d42b2b]" strokeWidth={2.5} />
            </div>
            <div className="font-heading font-extrabold text-lg sm:text-xl text-[#d42b2b] truncate my-0.5">
              -{formatRupiah(expense)}
            </div>
            <span className="text-[10px] font-mono text-zinc-500 block">
              Outflow bulan ini
            </span>
          </div>
        </div>

        {/* Expense Category Breakdown */}
        <div className="mt-4 pt-3 border-t-2 border-dashed border-black">
          <div className="flex items-center justify-between mb-2.5">
            <span className="font-heading font-extrabold text-xs uppercase tracking-wide text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5">
              <PieChart className="w-3.5 h-3.5" />
              POS PENGELUARAN TERBESAR
            </span>
            <span className="text-[10px] font-mono font-semibold text-zinc-500">
              {categories.length} Kategori
            </span>
          </div>

          {categories.length === 0 ? (
            <div className="p-3 bg-[#F6F4EE] border border-black rounded text-center text-xs font-mono text-zinc-600">
              Belum ada pengeluaran tercatat di bulan ini.
            </div>
          ) : (
            <div className="space-y-2">
              {categories.slice(0, 3).map((item, idx) => (
                <div key={item.category} className="space-y-1">
                  <div className="flex items-center justify-between text-xs font-mono font-bold">
                    <span className="flex items-center gap-1.5 truncate text-black dark:text-white">
                      <span className={`w-2 h-2 rounded-full border border-black ${getCategoryColor(idx)}`} />
                      {item.category}
                    </span>
                    <span className="text-zinc-800 dark:text-zinc-200">
                      {formatRupiah(item.amount)} ({item.percentage}%)
                    </span>
                  </div>
                  <div className="w-full h-2.5 bg-[#EAE6DC] border border-black rounded-full overflow-hidden">
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
      <div className="mt-5 pt-3 border-t-2 border-black/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono">
        <p className="text-zinc-700 dark:text-zinc-300 font-medium">
          {isSurplus
            ? `🟢 Arus kas positif. Tabungan surplus Rp ${balance.toLocaleString('id-ID')}`
            : `🔴 Pengeluaran melebihi pemasukan sebesar Rp ${Math.abs(balance).toLocaleString('id-ID')}`}
        </p>
        {onNavigate && (
          <button
            onClick={() => onNavigate('finance')}
            className="neo-btn neo-btn-accent text-[11px] py-1.5 px-3 self-start sm:self-auto shrink-0"
          >
            BUKU KAS ➜
          </button>
        )}
      </div>
    </div>
  );
}
