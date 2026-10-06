import React, { useState, useEffect } from 'react';
import { X, DollarSign, TrendingUp, TrendingDown, Save, Plus } from 'lucide-react';
import { getTodayDateString, formatRupiah } from '../../lib/utils.js';

const EXPENSE_CATEGORIES = [
  'Makanan & Minuman',
  'Transportasi',
  'Belanja & Kebutuhan',
  'Tagihan & Utilitas',
  'Hiburan & Rekreasi',
  'Kesehatan',
  'Pendidikan',
  'Lain-lain'
];

const INCOME_CATEGORIES = [
  'Gaji Pokok',
  'Freelance / Proyek',
  'Bisnis / Usaha',
  'Investasi',
  'Bonus / Hadiah',
  'Lain-lain'
];

export default function FinanceModal({
  isOpen,
  onClose,
  onSubmit,
  initialData = null, // if null -> Add mode; if object -> Edit mode
  selectedDate
}) {
  const [type, setType] = useState('expense');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState(EXPENSE_CATEGORIES[0]);
  const [description, setDescription] = useState('');
  const [recordDate, setRecordDate] = useState(selectedDate || getTodayDateString());
  const [error, setError] = useState('');

  const isEditMode = Boolean(initialData && initialData.id);

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setType(initialData.type || 'expense');
        setAmount(String(initialData.amount || ''));
        setCategory(initialData.category || (initialData.type === 'income' ? INCOME_CATEGORIES[0] : EXPENSE_CATEGORIES[0]));
        setDescription(initialData.description || '');
        setRecordDate(initialData.record_date || selectedDate || getTodayDateString());
      } else {
        setType('expense');
        setAmount('');
        setCategory(EXPENSE_CATEGORIES[0]);
        setDescription('');
        setRecordDate(selectedDate || getTodayDateString());
      }
      setError('');
    }
  }, [isOpen, initialData, selectedDate]);

  if (!isOpen) return null;

  const handleTypeChange = (newType) => {
    setType(newType);
    setCategory(newType === 'income' ? INCOME_CATEGORIES[0] : EXPENSE_CATEGORIES[0]);
  };

  const handleQuickAddAmount = (addVal) => {
    const cur = parseFloat(amount) || 0;
    setAmount(String(cur + addVal));
    if (error) setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const numericAmount = parseFloat(amount);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      setError('Nominal transaksi harus lebih besar dari Rp 0.');
      return;
    }

    setError('');
    onSubmit({
      id: initialData?.id,
      type,
      amount: numericAmount,
      category,
      description: description.trim() || undefined,
      record_date: recordDate || getTodayDateString(),
    });
    onClose();
  };

  const numericValue = parseFloat(amount) || 0;
  const currentCategories = type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;
  const categoryOptions = category && !currentCategories.includes(category)
    ? [category, ...currentCategories]
    : currentCategories;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 overflow-y-auto">
      <div className="w-full max-w-lg bg-white border-3 border-black shadow-[8px_8px_0px_#000000] rounded-[6px] overflow-hidden my-6 animate-in fade-in duration-150">
        {/* Header Bar */}
        <div className="bg-black text-white px-5 py-3.5 flex items-center justify-between border-b-2 border-black">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 bg-[#00E5CC] text-black border border-black flex items-center justify-center font-heading font-extrabold text-xs">
              <DollarSign className="w-4 h-4 text-black" strokeWidth={2.5} />
            </div>
            <span className="font-heading font-extrabold text-sm sm:text-base uppercase tracking-wider">
              {isEditMode ? 'EDIT TRANSAKSI KAS' : 'CATAT MUTASI TRANSAKSI'}
            </span>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 bg-white text-black hover:bg-[#FF4B4B] hover:text-white border-2 border-black flex items-center justify-center font-bold transition-colors"
          >
            <X className="w-4 h-4" strokeWidth={3} />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4">
          {error && (
            <div className="p-3 bg-[#FFE4E4] border-2 border-[#FF4B4B] text-black font-mono text-xs rounded-[4px] shadow-[2px_2px_0px_#FF4B4B]">
              <strong>⚠ PERHATIAN:</strong> {error}
            </div>
          )}

          {/* Type Toggle: PENGELUARAN vs PEMASUKAN */}
          <div>
            <label className="block text-xs font-heading font-extrabold uppercase mb-1.5 text-black">
              Jenis Mutasi Transaksi
            </label>
            <div className="grid grid-cols-2 gap-2 p-1.5 bg-[#F6F4EE] border-2 border-black rounded-[4px]">
              <button
                type="button"
                onClick={() => handleTypeChange('expense')}
                className={`py-2 text-xs font-heading font-extrabold flex items-center justify-center gap-1.5 transition-all border-2 ${
                  type === 'expense'
                    ? 'bg-[#FF4B4B] text-white border-black shadow-[2px_2px_0px_#000]'
                    : 'bg-transparent text-black border-transparent hover:bg-zinc-200'
                }`}
              >
                <TrendingDown className="w-4 h-4" strokeWidth={3} />
                PENGELUARAN
              </button>

              <button
                type="button"
                onClick={() => handleTypeChange('income')}
                className={`py-2 text-xs font-heading font-extrabold flex items-center justify-center gap-1.5 transition-all border-2 ${
                  type === 'income'
                    ? 'bg-[#00D26A] text-black border-black shadow-[2px_2px_0px_#000]'
                    : 'bg-transparent text-black border-transparent hover:bg-zinc-200'
                }`}
              >
                <TrendingUp className="w-4 h-4" strokeWidth={3} />
                PEMASUKAN
              </button>
            </div>
          </div>

          {/* Nominal Input */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-heading font-extrabold uppercase text-black">
                Nominal (Rupiah) <span className="text-[#FF4B4B]">*</span>
              </label>
              {numericValue > 0 && (
                <span className="text-xs font-mono font-bold text-zinc-800 bg-[#FFE600] px-2 py-0.5 border border-black rounded shadow-[1px_1px_0px_#000]">
                  {formatRupiah(numericValue)}
                </span>
              )}
            </div>

            <div className={`flex items-stretch border-2 border-black rounded-[4px] overflow-hidden shadow-[2px_2px_0px_#000000] focus-within:shadow-[4px_4px_0px_#000000] transition-all ${
              error ? 'border-[#FF4B4B] bg-[#FFE4E4]' : 'bg-white'
            }`}>
              <div className="bg-[#FFE600] border-r-2 border-black px-3.5 py-2.5 flex items-center justify-center font-mono font-extrabold text-sm text-black select-none shrink-0">
                Rp
              </div>
              <input
                type="number"
                min="1"
                step="any"
                placeholder="50000"
                value={amount}
                onChange={(e) => {
                  setAmount(e.target.value);
                  if (error) setError('');
                }}
                className="w-full bg-white px-3 py-2.5 font-mono font-bold text-base text-black focus:outline-none placeholder:text-zinc-400 placeholder:font-normal"
                autoFocus
                required
              />
            </div>

            {/* Quick Amount Add Chips */}
            <div className="flex flex-wrap items-center gap-1.5 mt-2">
              <span className="text-[10px] font-mono font-bold text-zinc-500 uppercase">
                + Cepat:
              </span>
              {[
                { label: '+10rb', val: 10000 },
                { label: '+25rb', val: 25000 },
                { label: '+50rb', val: 50000 },
                { label: '+100rb', val: 100000 },
                { label: '+500rb', val: 500000 },
              ].map((chip, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleQuickAddAmount(chip.val)}
                  className="text-[11px] font-mono font-bold px-2 py-1 bg-[#F6F4EE] hover:bg-[#FFE600] active:translate-y-0.5 border border-black transition-all shadow-[1px_1px_0px_#000] rounded-[2px]"
                >
                  {chip.label}
                </button>
              ))}
              {amount && (
                <button
                  type="button"
                  onClick={() => setAmount('')}
                  className="text-[10px] font-mono text-zinc-500 hover:text-black underline ml-auto"
                >
                  Reset
                </button>
              )}
            </div>
          </div>

          {/* Kategori & Tanggal (2 Kolom) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div>
              <label className="block text-xs font-heading font-extrabold uppercase mb-1.5 text-black">
                Kategori
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="neo-input font-medium text-xs sm:text-sm bg-white"
              >
                {categoryOptions.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-heading font-extrabold uppercase mb-1.5 text-black">
                Tanggal Transaksi
              </label>
              <input
                type="date"
                value={recordDate}
                onChange={(e) => setRecordDate(e.target.value)}
                className="neo-input font-mono text-xs sm:text-sm"
                required
              />
            </div>
          </div>

          {/* Keterangan / Deskripsi */}
          <div>
            <label className="block text-xs font-heading font-extrabold uppercase mb-1.5 text-black">
              Keterangan / Catatan (Opsional)
            </label>
            <input
              type="text"
              placeholder="Contoh: Makan siang, bayar wifi, tagihan listrik..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="neo-input text-xs sm:text-sm"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 pt-3 border-t-2 border-black/10">
            <button
              type="submit"
              className={`flex-1 neo-btn py-2.5 sm:py-3 text-xs sm:text-sm ${
                type === 'income' ? 'neo-btn-accent' : 'neo-btn-primary'
              }`}
            >
              {isEditMode ? (
                <>
                  <Save className="w-4 h-4 text-black" strokeWidth={2.5} />
                  SIMPAN PERUBAHAN
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4 text-black" strokeWidth={3} />
                  SIMPAN {type === 'income' ? 'PEMASUKAN' : 'PENGELUARAN'}
                </>
              )}
            </button>

            <button
              type="button"
              onClick={onClose}
              className="neo-btn neo-btn-secondary py-2.5 sm:py-3 px-4 text-xs sm:text-sm"
            >
              BATAL
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
