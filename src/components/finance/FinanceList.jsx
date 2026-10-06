import React from 'react';
import { ArrowUpRight, ArrowDownRight, Trash2, Pencil, Plus, Receipt, Table as TableIcon } from 'lucide-react';
import { formatRupiah } from '../../lib/utils.js';

export default function FinanceList({
  records = [],
  period,
  onPeriodChange,
  onDeleteRecord,
  onOpenAdd,
  onOpenEdit
}) {
  const totalIncome = records
    .filter(r => r.type === 'income')
    .reduce((sum, r) => sum + Number(r.amount || 0), 0);

  const totalExpense = records
    .filter(r => r.type === 'expense')
    .reduce((sum, r) => sum + Number(r.amount || 0), 0);

  return (
    <div className="bg-white border-2 border-black shadow-[4px_4px_0px_#000000] p-4 sm:p-5 rounded-[6px]">
      {/* Header and Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b-2 border-black">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-[#FFE600] border-2 border-black flex items-center justify-center rounded-[3px] shadow-[2px_2px_0px_#000]">
            <Receipt className="w-4 h-4 text-black" strokeWidth={2.5} />
          </div>
          <div>
            <h2 className="font-heading font-extrabold text-base sm:text-lg uppercase tracking-tight text-black flex items-center gap-2">
              TABEL MUTASI ARUS KAS
            </h2>
            <p className="text-[11px] font-mono text-zinc-500">
              Daftar seluruh transaksi pemasukan dan pengeluaran
            </p>
          </div>
        </div>

        {/* Right side: Period Filter + Catat Transaksi button */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Filter Tabs */}
          <div className="flex items-center gap-1 bg-[#F6F4EE] border-2 border-black p-0.5 rounded-[4px]">
            {[
              { id: 'daily', label: 'HARI INI' },
              { id: 'monthly', label: 'BULAN INI' },
              { id: 'all', label: 'SEMUA' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => onPeriodChange(tab.id)}
                className={`px-2.5 py-1 text-[11px] font-heading font-extrabold transition-all border ${
                  period === tab.id
                    ? 'bg-black text-white border-black shadow-[1px_1px_0px_#000]'
                    : 'bg-transparent text-black border-transparent hover:bg-zinc-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Quick Add Button */}
          {onOpenAdd && (
            <button
              onClick={onOpenAdd}
              className="neo-btn neo-btn-primary py-1.5 px-3 text-xs flex items-center gap-1.5 shadow-[2px_2px_0px_#000]"
            >
              <Plus className="w-3.5 h-3.5 text-black" strokeWidth={3} />
              CATAT TRANSAKSI
            </button>
          )}
        </div>
      </div>

      {/* Table Format for Financial Records */}
      {records.length === 0 ? (
        <div className="p-8 text-center border-2 border-dashed border-black bg-[#F6F4EE] rounded-[4px] my-2">
          <TableIcon className="w-10 h-10 mx-auto mb-2 text-zinc-400" strokeWidth={2} />
          <p className="font-heading font-bold text-sm sm:text-base text-black">
            Belum ada transaksi pada periode ini.
          </p>
          <p className="font-mono text-xs text-zinc-600 mt-1 max-w-sm mx-auto">
            Klik tombol di bawah untuk mencatat mutasi pemasukan atau pengeluaran ke dalam buku kas.
          </p>
          {onOpenAdd && (
            <button
              onClick={onOpenAdd}
              className="mt-4 neo-btn neo-btn-primary py-2 px-4 text-xs inline-flex items-center gap-1.5 shadow-[2px_2px_0px_#000]"
            >
              <Plus className="w-3.5 h-3.5 text-black" strokeWidth={3} />
              Catat Transaksi Sekarang
            </button>
          )}
        </div>
      ) : (
        <div className="border-2 border-black rounded-[4px] overflow-hidden shadow-[2px_2px_0px_#000000]">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[580px]">
              {/* Table Header */}
              <thead>
                <tr className="bg-black text-white font-heading font-extrabold text-xs uppercase tracking-wider border-b-2 border-black">
                  <th className="py-2.5 px-3.5 border-r border-zinc-700 w-28">Tipe</th>
                  <th className="py-2.5 px-3.5 border-r border-zinc-700 w-32">Tanggal</th>
                  <th className="py-2.5 px-3.5 border-r border-zinc-700">Kategori & Keterangan</th>
                  <th className="py-2.5 px-3.5 border-r border-zinc-700 text-right w-40">Nominal</th>
                  <th className="py-2.5 px-3 text-center w-20">Aksi</th>
                </tr>
              </thead>

              {/* Table Body */}
              <tbody className="divide-y divide-black/20 text-xs font-body">
                {records.map((record, index) => {
                  const isIncome = record.type === 'income';

                  return (
                    <tr
                      key={record.id}
                      className={`transition-colors hover:bg-[#FFF9CC] ${
                        index % 2 === 0 ? 'bg-white' : 'bg-[#FAF8F3]'
                      }`}
                    >
                      {/* Tipe Badge */}
                      <td className="py-3 px-3.5 border-r border-black/10 align-middle">
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
                      <td className="py-3 px-3.5 border-r border-black/10 font-mono text-zinc-700 whitespace-nowrap align-middle">
                        {record.record_date}
                      </td>

                      {/* Kategori & Keterangan */}
                      <td className="py-3 px-3.5 border-r border-black/10 align-middle">
                        <div className="font-heading font-extrabold text-xs text-black">
                          {record.category}
                        </div>
                        {record.description ? (
                          <div className="text-[11px] text-zinc-600 font-normal line-clamp-1 mt-0.5">
                            {record.description}
                          </div>
                        ) : (
                          <div className="text-[10px] text-zinc-400 italic">
                            Tanpa catatan
                          </div>
                        )}
                      </td>

                      {/* Nominal */}
                      <td className="py-3 px-3.5 border-r border-black/10 text-right align-middle whitespace-nowrap">
                        <span
                          className={`font-mono font-extrabold text-xs sm:text-sm ${
                            isIncome ? 'text-[#008f4c]' : 'text-[#d42b2b]'
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
                              className="p-1 bg-white dark:bg-[#2A2A32] text-black dark:text-white hover:bg-[#FFE600] hover:text-black border border-black transition-colors rounded-[2px] active:translate-y-0.5 shadow-[1px_1px_0px_#000]"
                            >
                              <Pencil className="w-3.5 h-3.5" strokeWidth={2.5} />
                            </button>
                          )}
                          <button
                            onClick={() => onDeleteRecord(record.id)}
                            title="Hapus Transaksi"
                            className="p-1 bg-white dark:bg-[#2A2A32] text-black dark:text-white hover:bg-[#FF4B4B] hover:text-white border border-black transition-colors rounded-[2px] active:translate-y-0.5 shadow-[1px_1px_0px_#000]"
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
                <tr className="bg-[#EAE6DC] border-t-2 border-black font-mono font-bold text-xs text-black">
                  <td colSpan={3} className="py-2.5 px-3.5 border-r border-black">
                    Ringkasan ({records.length} transaksi terdaftar)
                  </td>
                  <td className="py-2.5 px-3.5 border-r border-black text-right whitespace-nowrap">
                    <span className="text-[#008f4c]">+{formatRupiah(totalIncome)}</span>
                    <span className="mx-1 text-zinc-400">/</span>
                    <span className="text-[#d42b2b]">-{formatRupiah(totalExpense)}</span>
                  </td>
                  <td className="py-2.5 px-3 text-center">
                    &bull;
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
