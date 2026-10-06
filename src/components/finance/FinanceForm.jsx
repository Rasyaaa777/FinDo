import React, { useState } from 'react';
import { PlusCircle, TrendingUp, TrendingDown, DollarSign } from 'lucide-react';
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

export default function FinanceForm({ onAddRecord, selectedDate }) {
  const [type, setType] = useState('expense'); // 'income' or 'expense'
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState(EXPENSE_CATEGORIES[0]);
  const [description, setDescription] = useState('');
  const [recordDate, setRecordDate] = useState(selectedDate || getTodayDateString());
  const [error, setError] = useState('');

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
      setError('Nominal harus lebih besar dari 0');
      return;
    }

    setError('');
    onAddRecord({
      type,
      amount: numericAmount,
      category,
      description: description.trim() || undefined,
      record_date: recordDate || getTodayDateString(),
    });

    setAmount('');
    setDescription('');
  };

  const numericValue = parseFloat(amount) || 0;

  return (
    <div className="bg-white border-2 border-black shadow-[4px_4px_0px_#000000] p-4 sm:p-5 rounded-[6px] mb-4">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-6 h-6 bg-[#00E5CC] border-2 border-black flex items-center justify-center rounded-[3px]">
          <DollarSign className="w-3.5 h-3.5 text-black" strokeWidth={2.5} />
        </div>
        <h3 className="font-heading font-extrabold text-sm uppercase tracking-wide text-black">
          Catat Mutasi Arus Kas
        </h3>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        {/* Type Toggle: INCOME vs EXPENSE */}
        <div className="grid grid-cols-2 gap-2 p-1 bg-[#F6F4EE] border-2 border-black rounded-[4px]">
          <button
            type="button"
            onClick={() => handleTypeChange('expense')}
            className={`py-2 text-xs font-heading font-extrabold flex items-center justify-center gap-1.5 transition-all border-2 ${
              type === 'expense'
                ? 'bg-[#FF4B4B] text-white border-black shadow-[2px_2px_0px_#000]'
                : 'bg-transparent text-black border-transparent hover:bg-zinc-200'
            }`}
          >
            <TrendingDown className="w-3.5 h-3.5" strokeWidth={3} />
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
            <TrendingUp className="w-3.5 h-3.5" strokeWidth={3} />
            PEMASUKAN
          </button>
        </div>

        {/* Nominal Input (Fixed: Clean Neo-Brutalist Input Group without Overlap) */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-xs font-heading font-extrabold uppercase text-black">
              Nominal (Rupiah) <span className="text-[#FF4B4B]">*</span>
            </label>
            {numericValue > 0 && (
              <span className="text-xs font-mono font-bold text-zinc-700 bg-[#F6F4EE] px-2 py-0.5 border border-black rounded">
                Terbaca: {formatRupiah(numericValue)}
              </span>
            )}
          </div>

          {/* Attached Input Group */}
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
              required
            />
          </div>

          {error && (
            <p className="text-xs font-bold text-[#FF4B4B] mt-1 font-mono">
              ⚠ {error}
            </p>
          )}

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

        {/* Category & Date */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-heading font-extrabold uppercase mb-1 text-black">
              Kategori
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="neo-input font-medium text-xs sm:text-sm bg-white"
            >
              {(type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES).map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-heading font-extrabold uppercase mb-1 text-black">
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

        {/* Description (Optional) */}
        <div>
          <label className="block text-xs font-heading font-extrabold uppercase mb-1 text-black">
            Keterangan / Catatan (Opsional)
          </label>
          <input
            type="text"
            placeholder="Contoh: Makan siang bareng tim, bayar tagihan internet..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="neo-input text-xs sm:text-sm"
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          className={`w-full neo-btn py-2.5 sm:py-3 text-xs sm:text-sm mt-2 ${
            type === 'income' ? 'neo-btn-accent' : 'neo-btn-primary'
          }`}
        >
          <PlusCircle className="w-4 h-4 text-black" strokeWidth={2.5} />
          SIMPAN {type === 'income' ? 'PEMASUKAN' : 'PENGELUARAN'}
        </button>
      </form>
    </div>
  );
}
