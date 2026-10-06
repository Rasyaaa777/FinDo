import React, { useState } from 'react';
import MetricCards from '../dashboard/MetricCards.jsx';
import FinanceList from '../finance/FinanceList.jsx';
import FinanceModal from '../finance/FinanceModal.jsx';
import { Receipt, Plus } from 'lucide-react';

export default function FinanceView({
  records = [],
  cashflow,
  period,
  onPeriodChange,
  onAddRecord,
  onDeleteRecord,
  onUpdateRecord,
  selectedDate
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);

  const handleOpenAdd = () => {
    setEditingRecord(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (record) => {
    setEditingRecord(record);
    setIsModalOpen(true);
  };

  const handleModalSubmit = (recordData) => {
    if (recordData.id) {
      if (onUpdateRecord) {
        onUpdateRecord(recordData.id, {
          type: recordData.type,
          amount: recordData.amount,
          category: recordData.category,
          description: recordData.description,
          record_date: recordData.record_date,
        });
      }
    } else {
      onAddRecord(recordData);
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-150">
      {/* Header Banner */}
      <div className="bg-[#00E5CC] border-3 border-black shadow-[4px_4px_0px_#000000] p-5 rounded-[6px]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-black text-[#00E5CC] border-2 border-black flex items-center justify-center rounded-[4px] shadow-[2px_2px_0px_rgba(0,0,0,0.2)]">
              <Receipt className="w-5 h-5 text-[#00E5CC]" strokeWidth={2.5} />
            </div>
            <div>
              <h1 className="font-heading font-extrabold text-xl sm:text-2xl uppercase tracking-tight text-black">
                CATATAN KEUANGAN & BUKU KAS
              </h1>
              <p className="text-xs font-mono text-zinc-900 font-semibold">
                Pelacakan mutasi arus kas, klasifikasi kategori, dan kontrol defisit/surplus.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 self-start sm:self-auto">
            <div className="bg-black text-white border-2 border-black px-3 py-1.5 shadow-[2px_2px_0px_#000] rounded text-xs font-mono font-bold">
              {records.length} Transaksi
            </div>

            <button
              onClick={handleOpenAdd}
              className="neo-btn bg-black text-white hover:bg-zinc-800 py-2 px-4 text-xs sm:text-sm flex items-center gap-1.5 shadow-[2px_2px_0px_rgba(0,0,0,0.4)] active:translate-y-0.5"
            >
              <Plus className="w-4 h-4 text-white" strokeWidth={3} />
              CATAT TRANSAKSI
            </button>
          </div>
        </div>
      </div>

      {/* Top Metric Cards */}
      <section>
        <MetricCards cashflow={cashflow} />
      </section>

      {/* FULL WIDTH FINANCIAL LEDGER TABLE */}
      <div>
        <FinanceList
          records={records}
          period={period}
          onPeriodChange={onPeriodChange}
          onDeleteRecord={onDeleteRecord}
          onOpenAdd={handleOpenAdd}
          onOpenEdit={handleOpenEdit}
        />
      </div>

      {/* POPUP MODAL FORM (UNTUK INPUT & EDIT TRANSAKSI KAS) */}
      <FinanceModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleModalSubmit}
        initialData={editingRecord}
        selectedDate={selectedDate}
      />
    </div>
  );
}
