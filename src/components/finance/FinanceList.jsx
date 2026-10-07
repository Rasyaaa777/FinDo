import React from 'react';
import {
  ArrowUpRight,
  ArrowDownRight,
  Trash2,
  Pencil,
  Plus,
  Receipt,
  Table as TableIcon,
  ChevronLeft,
  ChevronRight,
  Calendar,
  PieChart,
  Scale
} from 'lucide-react';
import {
  formatRupiah,
  formatShortDate,
  formatIndonesianMonth,
  getTodayDateString,
  calculateCategoryBreakdown
} from '../../lib/utils.js';

export default function FinanceList({
  records = [],
  period = 'monthly',
  onPeriodChange,
  selectedMonth = '',
  onSelectMonth,
  onDeleteRecord,
  onOpenAdd,
  onOpenEdit
}) {
  const currentMonthStr = getTodayDateString().slice(0, 7);
  const activeMonth = selectedMonth || currentMonthStr;
  const activeMonthName = formatIndonesianMonth(activeMonth);

  // Income & Expense Breakdown
  const incomeRecords = records.filter(r => r.type === 'income');
  const expenseRecords = records.filter(r => r.type === 'expense');

  const totalIncome = incomeRecords.reduce((sum, r) => sum + Number(r.amount || 0), 0);
  const totalExpense = expenseRecords.reduce((sum, r) => sum + Number(r.amount || 0), 0);
  const balance = totalIncome - totalExpense;
  const isSurplus = balance >= 0;
  const surplusRatio = totalIncome > 0 ? Math.round((balance / totalIncome) * 100) : 0;

  // Dominant expense category
  const { dominant: topCategory } = calculateCategoryBreakdown(records, 'expense');

  // Month navigation shift (-1 or +1 month)
  const handleShiftMonth = (delta) => {
    if (!activeMonth) return;
    const [year, month] = activeMonth.split('-').map(Number);
    const date = new Date(year, month - 1 + delta, 1);
    const newYear = date.getFullYear();
    const newMonth = String(date.getMonth() + 1).padStart(2, '0');
    const nextMonthStr = `${newYear}-${newMonth}`;
    if (onSelectMonth) {
      onSelectMonth(nextMonthStr);
    }
    if (period !== 'monthly' && onPeriodChange) {
      onPeriodChange('monthly');
    }
  };

  return (
    <div className="bg-white dark:bg-[#1A1A1E] border-3 border-black dark:border-white/20 shadow-[6px_6px_0px_#000000] dark:shadow-[6px_6px_0px_rgba(255,255,255,0.1)] p-4 sm:p-6 rounded-[6px] space-y-5 transition-colors">
      {/* 1. TOP HEADER & MONTH SELECTION CONTROLS */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b-2 border-black dark:border-white/10">
        {/* Left: Section Title & Indicator */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-[#FFE600] border-2 border-black flex items-center justify-center rounded-[4px] shadow-[2px_2px_0px_#000] shrink-0">
            <Receipt className="w-5 h-5 text-black" strokeWidth={2.5} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-heading font-extrabold text-base sm:text-lg uppercase tracking-tight text-black dark:text-white">
                TABEL MUTASI ARUS KAS
              </h2>
              <span className="neo-badge bg-[#00E5CC] text-black text-[10px] py-0.5 px-2 font-mono font-bold">
                {period === 'monthly' ? activeMonthName.toUpperCase() : 'SEMUA RIWAYAT'}
              </span>
            </div>
            <p className="text-xs font-mono text-zinc-600 dark:text-zinc-400 mt-0.5">
              {period === 'monthly'
                ? `Laporan keuangan & pembukuan mutasi bulan ${activeMonthName}`
                : 'Menampilkan seluruh riwayat transaksi tanpa batasan bulan'}
            </p>
          </div>
        </div>

        {/* Right: Controls (Month Navigator + View Toggle + Add Button) */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Mode Switch (Bulanan vs Semua) */}
          <div className="flex items-center gap-1 bg-[#F6F4EE] dark:bg-[#2A2A32] border-2 border-black dark:border-white/20 p-0.5 rounded-[4px]">
            <button
              onClick={() => onPeriodChange && onPeriodChange('monthly')}
              className={`px-2.5 py-1 text-[11px] font-heading font-extrabold transition-all border ${
                period === 'monthly'
                  ? 'bg-black text-white border-black shadow-[1px_1px_0px_#000]'
                  : 'bg-transparent text-black dark:text-zinc-300 border-transparent hover:bg-zinc-200 dark:hover:bg-zinc-700'
              }`}
            >
              BULANAN
            </button>
            <button
              onClick={() => onPeriodChange && onPeriodChange('all')}
              className={`px-2.5 py-1 text-[11px] font-heading font-extrabold transition-all border ${
                period === 'all'
                  ? 'bg-black text-white border-black shadow-[1px_1px_0px_#000]'
                  : 'bg-transparent text-black dark:text-zinc-300 border-transparent hover:bg-zinc-200 dark:hover:bg-zinc-700'
              }`}
            >
              SEMUA
            </button>
          </div>

          {/* Month Navigator (Hanya aktif saat periode Bulanan atau siap digunakan) */}
          <div className="flex items-center gap-1 bg-[#F6F4EE] dark:bg-[#2A2A32] border-2 border-black dark:border-white/20 p-1 rounded-[4px] shadow-[2px_2px_0px_#000]">
            <button
              onClick={() => handleShiftMonth(-1)}
              title="Bulan Sebelumnya"
              className="p-1.5 bg-white dark:bg-[#1E1E22] text-black dark:text-white hover:bg-[#FFE600] hover:text-black border border-black dark:border-white/20 rounded transition-colors active:translate-y-0.5"
            >
              <ChevronLeft className="w-4 h-4" strokeWidth={2.5} />
            </button>

            {/* Interactive Month Picker Trigger */}
            <div
              className="relative flex items-center gap-1.5 px-2.5 py-1 bg-white dark:bg-[#1E1E22] border border-black dark:border-white/20 rounded cursor-pointer hover:border-black transition-colors"
              title="Klik untuk memilih bulan & tahun"
            >
              <Calendar className="w-3.5 h-3.5 text-zinc-600 dark:text-zinc-400 shrink-0" />
              <span className="text-xs font-mono font-bold text-black dark:text-white whitespace-nowrap">
                {activeMonthName}
              </span>
              <input
                type="month"
                value={activeMonth}
                onChange={(e) => {
                  if (e.target.value && onSelectMonth) {
                    onSelectMonth(e.target.value);
                    if (period !== 'monthly' && onPeriodChange) {
                      onPeriodChange('monthly');
                    }
                  }
                }}
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
              />
            </div>

            <button
              onClick={() => handleShiftMonth(1)}
              title="Bulan Berikutnya"
              className="p-1.5 bg-white dark:bg-[#1E1E22] text-black dark:text-white hover:bg-[#FFE600] hover:text-black border border-black dark:border-white/20 rounded transition-colors active:translate-y-0.5"
            >
              <ChevronRight className="w-4 h-4" strokeWidth={2.5} />
            </button>

            {activeMonth !== currentMonthStr && (
              <button
                onClick={() => {
                  if (onSelectMonth) onSelectMonth(currentMonthStr);
                  if (period !== 'monthly' && onPeriodChange) onPeriodChange('monthly');
                }}
                className="text-[10px] font-heading font-extrabold bg-[#FFE600] text-black hover:bg-[#FFD000] border border-black px-2 py-1 rounded transition-colors ml-1 shadow-[1px_1px_0px_#000]"
              >
                BULAN INI
              </button>
            )}
          </div>

          {/* Quick Add Button */}
          {onOpenAdd && (
            <button
              onClick={onOpenAdd}
              className="neo-btn neo-btn-primary py-2 px-3.5 text-xs flex items-center gap-1.5 shadow-[2px_2px_0px_#000] shrink-0"
            >
              <Plus className="w-4 h-4 text-black" strokeWidth={3} />
              CATAT TRANSAKSI
            </button>
          )}
        </div>
      </div>

      {/* 2. LAPORAN KEUANGAN BULANAN MINI-BAR (RINGKASAN EKSEKUTIF BULAN TERPILIH) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 bg-[#FAF8F3] dark:bg-[#202024] border-2 border-black dark:border-white/20 p-3.5 rounded-[4px] shadow-[2px_2px_0px_#000]">
        {/* Metric A: Saldo Bersih Bulanan */}
        <div className="bg-[#FFE600] border-2 border-black p-3 rounded-[3px] shadow-[2px_2px_0px_#000] flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono font-extrabold text-black uppercase">
              SALDO BERSIH BULANAN
            </span>
            <span className={`neo-badge text-[9px] py-0.5 px-1.5 ${isSurplus ? 'bg-[#00D26A] text-black' : 'bg-black text-white'}`}>
              {isSurplus ? 'SURPLUS' : 'DEFISIT'}
            </span>
          </div>
          <div className="font-mono font-bold text-lg sm:text-xl text-black mt-2">
            {balance < 0 ? '-' : ''}{formatRupiah(balance)}
          </div>
        </div>

        {/* Metric B: Total Pemasukan Bulanan */}
        <div className="bg-white dark:bg-[#1A1A1E] border-2 border-black dark:border-white/20 p-3 rounded-[3px] shadow-[2px_2px_0px_#000] flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono font-extrabold text-zinc-600 dark:text-zinc-400 uppercase">
              TOTAL PEMASUKAN
            </span>
            <span className="text-[10px] font-mono font-bold text-[#00A859] dark:text-[#00E5CC]">
              {incomeRecords.length} Transaksi
            </span>
          </div>
          <div className="font-mono font-bold text-lg sm:text-xl text-[#00A859] dark:text-[#00E5CC] mt-2">
            +{formatRupiah(totalIncome)}
          </div>
        </div>

        {/* Metric C: Total Pengeluaran Bulanan */}
        <div className="bg-white dark:bg-[#1A1A1E] border-2 border-black dark:border-white/20 p-3 rounded-[3px] shadow-[2px_2px_0px_#000] flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono font-extrabold text-zinc-600 dark:text-zinc-400 uppercase">
              TOTAL PENGELUARAN
            </span>
            <span className="text-[10px] font-mono font-bold text-[#d42b2b] dark:text-[#FF6B6B]">
              {expenseRecords.length} Transaksi
            </span>
          </div>
          <div className="font-mono font-bold text-lg sm:text-xl text-[#d42b2b] dark:text-[#FF6B6B] mt-2">
            -{formatRupiah(totalExpense)}
          </div>
        </div>

        {/* Metric D: Rasio Tabungan / Pengeluaran Terbesar */}
        <div className="bg-white dark:bg-[#1A1A1E] border-2 border-black dark:border-white/20 p-3 rounded-[3px] shadow-[2px_2px_0px_#000] flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono font-extrabold text-zinc-600 dark:text-zinc-400 uppercase">
              BEBAN TERBESAR
            </span>
            <span className="text-[10px] font-mono font-bold text-black dark:text-zinc-300">
              {totalIncome > 0 ? `Tabungan ${surplusRatio}%` : 'Kas 0%'}
            </span>
          </div>
          <div className="mt-2">
            {topCategory ? (
              <div className="flex items-baseline justify-between gap-1">
                <span className="font-heading font-extrabold text-xs text-black dark:text-white truncate">
                  {topCategory.category}
                </span>
                <span className="font-mono text-xs font-bold text-[#d42b2b] dark:text-[#FF6B6B] shrink-0">
                  {topCategory.percentage}%
                </span>
              </div>
            ) : (
              <span className="text-xs font-mono text-zinc-400 italic">
                Belum ada beban
              </span>
            )}
          </div>
        </div>
      </div>

      {/* 3. FINANCIAL RECORDS TABLE / EMPTY STATE */}
      {records.length === 0 ? (
        <div className="p-8 sm:p-12 text-center border-3 border-dashed border-black dark:border-white/30 bg-[#F6F4EE] dark:bg-[#151518] rounded-[6px] my-2">
          <TableIcon className="w-12 h-12 mx-auto mb-3 text-zinc-400 dark:text-zinc-600" strokeWidth={1.5} />
          <h3 className="font-heading font-extrabold text-base sm:text-lg text-black dark:text-white">
            Belum ada transaksi di bulan {activeMonthName}
          </h3>
          <p className="font-mono text-xs text-zinc-600 dark:text-zinc-400 mt-1.5 max-w-md mx-auto">
            Tidak ada catatan pemasukan atau pengeluaran untuk periode ini. Catat mutasi sekarang untuk memantau arus kas Anda.
          </p>
          {onOpenAdd && (
            <button
              onClick={onOpenAdd}
              className="mt-5 neo-btn neo-btn-primary py-2.5 px-5 text-xs inline-flex items-center gap-2 shadow-[3px_3px_0px_#000]"
            >
              <Plus className="w-4 h-4 text-black" strokeWidth={3} />
              Catat Transaksi di {activeMonthName}
            </button>
          )}
        </div>
      ) : (
        <div className="border-3 border-black dark:border-white/20 rounded-[4px] overflow-hidden shadow-[3px_3px_0px_#000000] dark:shadow-[3px_3px_0px_rgba(255,255,255,0.1)]">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[620px]">
              {/* Table Header */}
              <thead>
                <tr className="bg-black text-white font-heading font-extrabold text-xs uppercase tracking-wider border-b-2 border-black">
                  <th className="py-3 px-3.5 border-r border-zinc-700 w-28">Tipe</th>
                  <th className="py-3 px-3.5 border-r border-zinc-700 w-32">Tanggal</th>
                  <th className="py-3 px-3.5 border-r border-zinc-700">Kategori & Keterangan</th>
                  <th className="py-3 px-3.5 border-r border-zinc-700 text-right w-44">Nominal</th>
                  <th className="py-3 px-3 text-center w-24">Aksi</th>
                </tr>
              </thead>

              {/* Table Body */}
              <tbody className="divide-y divide-black/20 dark:divide-white/10 text-xs font-body">
                {records.map((record, index) => {
                  const isIncome = record.type === 'income';

                  return (
                    <tr
                      key={record.id}
                      className={`transition-colors hover:bg-[#FFF9CC] dark:hover:bg-[#2A2A32] ${
                        index % 2 === 0
                          ? 'bg-white dark:bg-[#1E1E22]'
                          : 'bg-[#FAF8F3] dark:bg-[#18181B]'
                      }`}
                    >
                      {/* Tipe Badge */}
                      <td className="py-3 px-3.5 border-r border-black/10 dark:border-white/10 align-middle">
                        <span
                          className={`neo-badge text-[10px] py-0.5 px-2 flex items-center justify-center gap-1 w-fit ${
                            isIncome
                              ? 'bg-[#00D26A] text-black font-extrabold'
                              : 'bg-[#FF4B4B] text-white font-extrabold'
                          }`}
                        >
                          {isIncome ? (
                            <>
                              <ArrowUpRight className="w-3 h-3" strokeWidth={3} />
                              INCOME
                            </>
                          ) : (
                            <>
                              <ArrowDownRight className="w-3 h-3" strokeWidth={3} />
                              EXPENSE
                            </>
                          )}
                        </span>
                      </td>

                      {/* Tanggal */}
                      <td className="py-3 px-3.5 border-r border-black/10 dark:border-white/10 font-mono text-zinc-700 dark:text-zinc-300 whitespace-nowrap align-middle">
                        <div className="font-bold">
                          {formatShortDate(record.record_date) || record.record_date}
                        </div>
                        <div className="text-[10px] text-zinc-400">
                          {record.record_date}
                        </div>
                      </td>

                      {/* Kategori & Keterangan */}
                      <td className="py-3 px-3.5 border-r border-black/10 dark:border-white/10 align-middle">
                        <div className="font-heading font-extrabold text-xs text-black dark:text-white">
                          {record.category}
                        </div>
                        {record.description ? (
                          <div className="text-[11px] text-zinc-600 dark:text-zinc-400 font-normal line-clamp-1 mt-0.5">
                            {record.description}
                          </div>
                        ) : (
                          <div className="text-[10px] text-zinc-400 italic">
                            Tanpa keterangan
                          </div>
                        )}
                      </td>

                      {/* Nominal */}
                      <td className="py-3 px-3.5 border-r border-black/10 dark:border-white/10 text-right align-middle whitespace-nowrap">
                        <span
                          className={`font-mono font-extrabold text-xs sm:text-sm ${
                            isIncome
                              ? 'text-[#00A859] dark:text-[#00E5CC]'
                              : 'text-[#d42b2b] dark:text-[#FF6B6B]'
                          }`}
                        >
                          {isIncome ? '+' : '-'}{formatRupiah(record.amount)}
                        </span>
                      </td>

                      {/* Aksi: Edit & Hapus */}
                      <td className="py-3 px-3 text-center align-middle">
                        <div className="flex items-center justify-center gap-1.5">
                          {onOpenEdit && (
                            <button
                              onClick={() => onOpenEdit(record)}
                              title="Edit Transaksi"
                              className="p-1.5 bg-white dark:bg-[#2A2A32] text-black dark:text-white hover:bg-[#FFE600] hover:text-black border border-black dark:border-white/20 transition-colors rounded-[3px] active:translate-y-0.5 shadow-[1px_1px_0px_#000]"
                            >
                              <Pencil className="w-3.5 h-3.5" strokeWidth={2.5} />
                            </button>
                          )}
                          <button
                            onClick={() => onDeleteRecord(record.id)}
                            title="Hapus Transaksi"
                            className="p-1.5 bg-white dark:bg-[#2A2A32] text-black dark:text-white hover:bg-[#FF4B4B] hover:text-white border border-black dark:border-white/20 transition-colors rounded-[3px] active:translate-y-0.5 shadow-[1px_1px_0px_#000]"
                          >
                            <Trash2 className="w-3.5 h-3.5" strokeWidth={2.5} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>

              {/* Table Footer Summary */}
              <tfoot>
                <tr className="bg-[#EAE6DC] dark:bg-[#242428] border-t-2 border-black dark:border-white/20 font-mono font-bold text-xs text-black dark:text-white">
                  <td colSpan={3} className="py-3 px-3.5 border-r border-black dark:border-white/20">
                    <div className="flex items-center justify-between">
                      <span>Total {records.length} Transaksi Terdaftar</span>
                      <span className="text-[11px] font-mono text-zinc-600 dark:text-zinc-400">
                        {period === 'monthly' ? `Periode: ${activeMonthName}` : 'Periode: Keseluruhan'}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-3.5 border-r border-black dark:border-white/20 text-right whitespace-nowrap">
                    <div className="text-[11px] text-zinc-600 dark:text-zinc-400 font-normal">
                      Masuk: <span className="text-[#00A859] dark:text-[#00E5CC] font-bold">+{formatRupiah(totalIncome)}</span> | Keluar: <span className="text-[#d42b2b] dark:text-[#FF6B6B] font-bold">-{formatRupiah(totalExpense)}</span>
                    </div>
                    <div className="mt-0.5 font-bold">
                      Net: <span className={isSurplus ? 'text-[#00A859] dark:text-[#00E5CC]' : 'text-[#d42b2b] dark:text-[#FF6B6B]'}>
                        {balance < 0 ? '-' : ''}{formatRupiah(balance)}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-3 text-center">
                    <Scale className="w-4 h-4 mx-auto text-black dark:text-white" strokeWidth={2} />
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
