import React, { useState } from 'react';
import MetricCards from '../dashboard/MetricCards.jsx';
import FinanceList from '../finance/FinanceList.jsx';
import FinanceModal from '../finance/FinanceModal.jsx';
import { Receipt, Plus } from 'lucide-react';
import { formatIndonesianMonth, getTodayDateString } from '../../lib/utils.js';

export default function FinanceView({
  records = [],
  cashflow,
  period = 'monthly',
  onPeriodChange,
  selectedMonth = '',
  onSelectMonth,
  onAddRecord,
  onDeleteRecord,
  onUpdateRecord,
  selectedDate
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);

  const currentMonthStr = getTodayDateString().slice(0, 7);
  const activeMonth = selectedMonth || currentMonthStr;
  const activeMonthName = formatIndonesianMonth(activeMonth);

  // Default date for modal when adding record
  const modalDefaultDate = activeMonth === currentMonthStr
    ? (selectedDate || getTodayDateString())
    : `${activeMonth}-01`;

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
      {/* Top Metric Cards for Selected Month */}
      <section>
        <MetricCards cashflow={cashflow} monthLabel={activeMonthName} />
      </section>

      {/* FULL WIDTH FINANCIAL LEDGER TABLE WITH MONTH SELECTOR */}
      <div>
        <FinanceList
          records={records}
          period={period}
          onPeriodChange={onPeriodChange}
          selectedMonth={activeMonth}
          onSelectMonth={onSelectMonth}
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
        selectedDate={modalDefaultDate}
      />
    </div>
  );
}
