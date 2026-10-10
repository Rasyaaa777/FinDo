import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  MessageSquare,
  Send,
  Loader2,
  Bot,
  User,
  ShieldCheck,
  AlertTriangle,
  Flame,
  CheckCircle2,
  RotateCcw,
  Lightbulb,
  Clock,
  Receipt,
  Moon,
  Undo2,
  ArrowRight,
  XCircle
} from 'lucide-react';
import { sendAiChatMessage } from '../../lib/aiService.js';
import { parseAiCommand } from '../../lib/aiActionService.js';
import { getTodayDateString, formatRupiah, formatShortDate } from '../../lib/utils.js';

const nowTime = () => new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });

// Kartu hasil aksi AI yang sudah tersimpan ke database (jelas terbaca di Light & Dark Mode)
function ActionResultCard({ result }) {
  const { type, ok, data, error } = result;
  const isTodo = type === 'todo';
  const isIncome = data?.type === 'income';
  const isSleep = type === 'sleep';

  return (
    <div
      className={`mt-2.5 p-3 border-2 border-black dark:border-white/30 rounded-[6px] text-xs transition-all ${
        ok
          ? isTodo
            ? 'bg-[#E6FFFA] dark:bg-[#003B33] text-black dark:text-white shadow-[2px_2px_0px_#000]'
            : isSleep
            ? 'bg-[#F2E8FF] dark:bg-[#2E1065] text-black dark:text-white shadow-[2px_2px_0px_#000]'
            : isIncome
            ? 'bg-[#E3FCEB] dark:bg-[#0B3D1B] text-black dark:text-white shadow-[2px_2px_0px_#000]'
            : 'bg-[#FFF0F0] dark:bg-[#3D0B0B] text-black dark:text-white shadow-[2px_2px_0px_#000]'
          : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-500 opacity-70'
      }`}
    >
      <div className="flex items-center justify-between gap-2 mb-1.5 pb-1 border-b border-black/10 dark:border-white/10">
        <span className="flex items-center gap-1.5 font-heading font-extrabold uppercase text-[10px] tracking-wider text-black dark:text-white">
          {isTodo ? (
            <Clock className="w-3.5 h-3.5 text-[#00A88F] dark:text-[#00E5CC]" strokeWidth={2.5} />
          ) : isSleep ? (
            <Moon className="w-3.5 h-3.5 text-[#8338EC] dark:text-[#C4B5FD]" strokeWidth={2.5} />
          ) : (
            <Receipt className="w-3.5 h-3.5 text-[#00A855] dark:text-[#00D26A]" strokeWidth={2.5} />
          )}
          {isTodo ? 'TO-DO LIST PER JAM' : isSleep ? 'PELACAK JAM TIDUR' : isIncome ? 'CATATAN PEMASUKAN' : 'CATATAN PENGELUARAN'}
        </span>
        {ok ? (
          <span className="text-[10px] font-mono font-extrabold text-black dark:text-black bg-[#00D26A] px-1.5 py-0.5 rounded border border-black flex items-center gap-1 shadow-[1px_1px_0px_#000]">
            <CheckCircle2 className="w-3 h-3 text-black" strokeWidth={3} /> TERSIMPAN KE DB
          </span>
        ) : (
          <span className="text-[10px] font-mono font-extrabold text-white bg-[#FF4B4B] px-1.5 py-0.5 rounded border border-black flex items-center gap-1">
            <XCircle className="w-3 h-3" strokeWidth={3} /> GAGAL
          </span>
        )}
      </div>

      {isTodo ? (
        <div className="space-y-1">
          <p className="font-heading font-extrabold text-sm text-black dark:text-white">
            {data.task_title}
          </p>
          <div className="flex items-center gap-2 font-mono text-[11px] text-zinc-700 dark:text-zinc-300 font-bold">
            <span className="bg-black/10 dark:bg-white/10 px-1.5 py-0.5 rounded">
              📅 {formatShortDate(data.target_date)}
            </span>
            <span className="bg-[#FFE600] text-black px-1.5 py-0.5 rounded border border-black">
              ⏰ {data.start_time?.slice(0, 5)} - {data.end_time?.slice(0, 5)}
            </span>
          </div>
        </div>
      ) : isSleep ? (
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <p className="font-heading font-extrabold text-base text-[#8338EC] dark:text-[#C4B5FD]">
              {data.duration_hours} Jam Tidur
            </p>
            <span className="text-[10px] font-mono font-extrabold px-1.5 py-0.5 rounded bg-[#8338EC] text-white">
              {data.quality || 'Baik'}
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-2 font-mono text-[11px] text-zinc-700 dark:text-zinc-300 font-bold">
            <span className="bg-black/10 dark:bg-white/10 px-1.5 py-0.5 rounded">
              📅 {formatShortDate(data.record_date)}
            </span>
            {data.bedtime && data.wake_time && (
              <span className="bg-[#FFE600] text-black px-1.5 py-0.5 rounded border border-black">
                ⏰ {data.bedtime?.slice(0, 5)} - {data.wake_time?.slice(0, 5)}
              </span>
            )}
            {data.notes && (
              <span className="text-zinc-600 dark:text-zinc-400">
                • {data.notes}
              </span>
            )}
          </div>
        </div>
      ) : (
        <div className="space-y-1">
          <p className="font-mono font-extrabold text-base text-black dark:text-white">
            {isIncome ? '+' : '-'}{formatRupiah(data.amount)}
          </p>
          <div className="flex items-center gap-2 font-mono text-[11px] text-zinc-700 dark:text-zinc-300 font-bold">
            <span className="bg-black/10 dark:bg-white/10 px-1.5 py-0.5 rounded">
              📁 {data.category}
            </span>
            <span className="bg-black/10 dark:bg-white/10 px-1.5 py-0.5 rounded">
              📅 {formatShortDate(data.record_date)}
            </span>
            {data.description && (
              <span className="truncate max-w-[150px] text-zinc-600 dark:text-zinc-400">
                • {data.description}
              </span>
            )}
          </div>
        </div>
      )}

      {!ok && error && (
        <p className="text-[11px] font-mono font-bold text-[#FF4B4B] mt-1 bg-red-100 p-1 rounded">
          ⚠️ {error}
        </p>
      )}
    </div>
  );
}

export default function AiChatSection({
  aiInsight,
  onAnalyzeAi,
  isAiLoading,
  contextData,
  onExecuteActions,
  onUndoActions,
  onNavigate
}) {
  const [activeTab, setActiveTab] = useState('chat'); // 'chat' | 'insight'
  const [messages, setMessages] = useState([
    {
      id: 'welcome',
      role: 'assistant',
      text: 'Halo! Saya **FinDo AI Advisor**. Selain menganalisis keuangan, to-do, dan jam tidur, saya juga bisa **langsung mencatat** untuk Anda.\n\nContoh:\n• "beli kopi 25rb"\n• "tadi malam tidur 7.5 jam"\n• "meeting klien besok jam 2-3 siang"\n\nSaya akan otomatis mendeteksi apakah itu masuk ke To-Do List, Laporan Keuangan, atau Jam Tidur lalu menyimpannya ke database.',
      time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isSending, setIsSending] = useState(false);
  const chatBottomRef = useRef(null);

  // Auto scroll to latest message
  useEffect(() => {
    if (activeTab === 'chat') {
      chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, activeTab, isSending]);

  const handleSendMessage = async (textToSend) => {
    const query = (textToSend || inputText).trim();
    if (!query || isSending) return;

    const userMsg = {
      id: 'msg-' + Date.now(),
      role: 'user',
      text: query,
      time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
    };

    const newHistory = [...messages, userMsg];
    setMessages(newHistory);
    setInputText('');
    setIsSending(true);

    try {
      // 1. AI menganalisis: apakah ini perintah input (to-do / keuangan) atau chat biasa?
      const command = await parseAiCommand(query, getTodayDateString());

      if (command.intent !== 'chat' && command.actions.length > 0 && onExecuteActions) {
        // 2. AI input ke database sesuai hasil analisis
        let results;
        try {
          results = await onExecuteActions(command.actions);
        } catch (execErr) {
          setMessages(prev => [...prev, {
            id: 'msg-err-' + Date.now(),
            role: 'assistant',
            text: '⚠️ ' + execErr.message,
            time: nowTime()
          }]);
          return;
        }

        const okCount = results.filter(r => r.ok).length;
        const todoCount = results.filter(r => r.ok && r.type === 'todo').length;
        const finCount = results.filter(r => r.ok && r.type === 'finance').length;
        const sleepCount = results.filter(r => r.ok && r.type === 'sleep').length;
        const destinations = [
          todoCount ? `${todoCount} item ke **To-Do List**` : null,
          finCount ? `${finCount} item ke **Laporan Keuangan**` : null,
          sleepCount ? `${sleepCount} catatan ke **Jam Tidur**` : null
        ].filter(Boolean).join(' dan ');

        // 3. Tampilkan output yang sudah dilakukan AI
        setMessages(prev => [...prev, {
          id: 'msg-bot-' + Date.now(),
          role: 'assistant',
          text: okCount > 0
            ? `✅ ${command.reply || 'Siap, sudah dicatat!'}\nDisimpan: ${destinations}.`
            : '⚠️ Gagal menyimpan data ke database. Periksa koneksi atau login Anda.',
          actionResults: results,
          time: nowTime()
        }]);
        return;
      }

      // Chat biasa → advisor
      const replyText = await sendAiChatMessage(
        newHistory.map(m => ({ role: m.role, text: m.text })),
        contextData
      );

      const botMsg = {
        id: 'msg-bot-' + Date.now(),
        role: 'assistant',
        text: replyText || 'Maaf, saya tidak dapat memproses jawaban saat ini.',
        time: nowTime()
      };
      setMessages(prev => [...prev, botMsg]);
    } catch (err) {
      console.error("Chat error:", err);
      const errorMsg = {
        id: 'msg-err-' + Date.now(),
        role: 'assistant',
        text: '⚠️ Terjadi kendala saat menghubungi AI. Silakan coba sesaat lagi.',
        time: nowTime()
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsSending(false);
    }
  };

  const handleUndo = async (msgId, results) => {
    if (!onUndoActions) return;
    try {
      await onUndoActions(results);
      setMessages(prev => prev.map(m => (m.id === msgId ? { ...m, undone: true } : m)));
    } catch (err) {
      alert('Gagal membatalkan: ' + err.message);
    }
  };

  const handleClearChat = () => {
    setMessages([
      {
        id: 'welcome-reset',
        role: 'assistant',
        text: 'Percakapan direset. Ada yang ingin Anda konsultasikan seputar to-do list atau keuangan hari ini?',
        time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  };

  const quickPrompts = [
    "Catat tidur semalam 7.5 jam",
    "Beli makan siang 35rb",
    "Belajar React besok jam 19-21",
    "Bagaimana kualitas tidur & keuanganku bulan ini?"
  ];

  // Helper for insight status badge
  const getStatusBadge = (status) => {
    switch (status) {
      case 'Kritis':
        return (
          <span className="neo-badge bg-[#FF4B4B] text-white flex items-center gap-1 font-bold">
            <Flame className="w-3 h-3" strokeWidth={3} />
            KRITIS
          </span>
        );
      case 'Perhatian':
        return (
          <span className="neo-badge bg-[#FFAA00] text-black flex items-center gap-1 font-bold">
            <AlertTriangle className="w-3 h-3" strokeWidth={3} />
            PERHATIAN
          </span>
        );
      case 'Aman':
      default:
        return (
          <span className="neo-badge bg-[#00D26A] text-black flex items-center gap-1 font-bold">
            <ShieldCheck className="w-3 h-3" strokeWidth={3} />
            AMAN
          </span>
        );
    }
  };

  const {
    status = "Aman",
    insight = "Klik tombol di bawah untuk meminta analisis cerdas mengenai keselarasan produktivitas to-do dan arus kas Anda.",
    action_items = [
      "Sinkronkan target to-do dengan alokasi jam kerja efektif.",
      "Kendalikan pos pengeluaran harian agar tetap sesuai anggaran."
    ]
  } = aiInsight || {};

  return (
    <div className="bg-white dark:bg-[#1E1E24] border-2 sm:border-3 border-black shadow-[3px_3px_0px_#000000] rounded-[5px] overflow-hidden flex flex-col h-full min-h-[280px]">
      {/* Top Neo-Brutalist Strip Header */}
      <div className="bg-[#FF2A85] text-white p-2 sm:p-2.5 border-b-2 border-black flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-white" strokeWidth={2.5} />
          <span className="font-heading font-extrabold text-xs tracking-wider uppercase">
            AI CHAT INTEL & ADVISOR
          </span>
        </div>

        {/* Tab Toggle Buttons */}
        <div className="flex items-center gap-1 bg-black/30 p-0.5 rounded-[3px] border border-black/40">
          <button
            onClick={() => setActiveTab('chat')}
            className={`px-2 py-0.5 text-[10px] font-heading font-bold rounded transition-all flex items-center gap-1 ${
              activeTab === 'chat'
                ? 'bg-[#FFE600] text-black shadow-[1px_1px_0px_#000]'
                : 'text-white hover:bg-white/20'
            }`}
          >
            <MessageSquare className="w-3 h-3" />
            CHAT AI
          </button>
          <button
            onClick={() => setActiveTab('insight')}
            className={`px-2 py-0.5 text-[10px] font-heading font-bold rounded transition-all flex items-center gap-1 ${
              activeTab === 'insight'
                ? 'bg-[#00E5CC] text-black shadow-[1px_1px_0px_#000]'
                : 'text-white hover:bg-white/20'
            }`}
          >
            <Sparkles className="w-3 h-3" />
            ANALISIS
          </button>
        </div>
      </div>

      {/* Main Tab Content */}
      {activeTab === 'chat' ? (
        <div className="flex-1 flex flex-col min-h-0 bg-[#FAF8F3] dark:bg-[#151518]">
          {/* Top Chat Info Subheader */}
          <div className="px-3 py-1 border-b border-black/10 bg-white dark:bg-[#1E1E24] flex items-center justify-between text-[10px] font-mono">
            <span className="text-zinc-600 dark:text-zinc-400 font-bold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00D26A] animate-pulse" />
              FinDo Advisor • Auto-Input Aktif
            </span>
            <button
              onClick={handleClearChat}
              title="Reset Chat"
              className="text-zinc-500 hover:text-black dark:hover:text-white flex items-center gap-0.5 text-[10px]"
            >
              <RotateCcw className="w-2.5 h-2.5" /> Reset
            </button>
          </div>

          {/* Messages Stream */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 min-h-0">
            {messages.map((msg) => {
              const isUser = msg.role === 'user';
              return (
                <div
                  key={msg.id}
                  className={`flex items-start gap-2.5 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
                >
                  {/* Avatar */}
                  <div
                    className={`w-5 h-5 rounded-[3px] border-2 border-black flex items-center justify-center shrink-0 ${
                      isUser ? 'bg-[#FFE600] text-black' : 'bg-[#00E5CC] text-black'
                    }`}
                  >
                    {isUser ? <User className="w-3 h-3" /> : <Bot className="w-3 h-3" />}
                  </div>

                  {/* Bubble */}
                  <div
                    className={`max-w-[85%] sm:max-w-[80%] p-2 rounded-[5px] border-2 border-black text-[11px] sm:text-xs leading-relaxed whitespace-pre-wrap ${
                      isUser
                        ? 'bg-[#FFE600] text-black shadow-[2px_2px_0px_#000] font-semibold'
                        : 'bg-white dark:bg-[#1E1E24] text-zinc-900 dark:text-zinc-100 shadow-[2px_2px_0px_#000]'
                    }`}
                  >
                    {msg.text}
                    {msg.actionResults && (
                      <div className={msg.undone ? 'line-through opacity-50' : ''}>
                        {msg.actionResults.map((r, i) => (
                          <ActionResultCard key={i} result={r} />
                        ))}
                      </div>
                    )}
                    {msg.actionResults && msg.actionResults.some(r => r.ok) && (
                      <div className="flex flex-wrap gap-1 mt-1.5">
                        {msg.undone ? (
                          <span className="text-[9px] font-mono font-bold text-zinc-500">↩ Dibatalkan & dihapus dari database</span>
                        ) : (
                          <>
                            <button
                              onClick={() => handleUndo(msg.id, msg.actionResults)}
                              className="text-[9px] font-mono font-bold px-1.5 py-0.5 bg-white border border-black rounded-[3px] shadow-[1px_1px_0px_#000] hover:bg-[#FFE4E4] flex items-center gap-0.5 text-black"
                            >
                              <Undo2 className="w-2.5 h-2.5" /> BATALKAN
                            </button>
                            {onNavigate && msg.actionResults.some(r => r.ok && r.type === 'todo') && (
                              <button
                                onClick={() => onNavigate('todos')}
                                className="text-[9px] font-mono font-bold px-1.5 py-0.5 bg-[#00E5CC] border border-black rounded-[3px] shadow-[1px_1px_0px_#000] flex items-center gap-0.5 text-black"
                              >
                                LIHAT TO-DO <ArrowRight className="w-2.5 h-2.5" />
                              </button>
                            )}
                            {onNavigate && msg.actionResults.some(r => r.ok && r.type === 'finance') && (
                              <button
                                onClick={() => onNavigate('finance')}
                                className="text-[9px] font-mono font-bold px-1.5 py-0.5 bg-[#FFE600] border border-black rounded-[3px] shadow-[1px_1px_0px_#000] flex items-center gap-0.5 text-black"
                              >
                                LIHAT KEUANGAN <ArrowRight className="w-2.5 h-2.5" />
                              </button>
                            )}
                          </>
                        )}
                      </div>
                    )}
                    <div
                      className={`text-[8px] font-mono mt-0.5 ${
                        isUser ? 'text-zinc-700 text-right' : 'text-zinc-400 text-left'
                      }`}
                    >
                      {msg.time}
                    </div>
                  </div>
                </div>
              );
            })}

            {isSending && (
              <div className="flex items-start gap-2">
                <div className="w-5 h-5 rounded-[3px] border-2 border-black bg-[#00E5CC] text-black flex items-center justify-center shrink-0">
                  <Bot className="w-3 h-3" />
                </div>
                <div className="p-2 bg-white border-2 border-black rounded-[5px] shadow-[1px_1px_0px_#000] flex items-center gap-1.5 text-[11px] font-mono font-bold text-zinc-600">
                  <Loader2 className="w-3 h-3 animate-spin" />
                  AI sedang memproses...
                </div>
              </div>
            )}

            <div ref={chatBottomRef} />
          </div>

          {/* Quick Prompt Chips */}
          <div className="px-2.5 py-1.5 bg-white dark:bg-[#1E1E24] border-t-2 border-black/10 overflow-x-auto flex items-center gap-1 no-scrollbar">
            <span className="text-[9px] font-mono font-bold text-zinc-500 shrink-0 flex items-center gap-0.5">
              <Lightbulb className="w-2.5 h-2.5 text-[#FFE600]" /> CEPAT:
            </span>
            {quickPrompts.map((prompt, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(prompt)}
                disabled={isSending}
                className="shrink-0 text-[10px] font-mono font-semibold px-2 py-0.5 bg-[#F6F4EE] hover:bg-[#FFE600] text-black border border-black rounded-[3px] transition-colors shadow-[1px_1px_0px_#000] active:translate-y-0.5"
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Chat Input Field */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="p-2 sm:p-2.5 bg-white dark:bg-[#1E1E24] border-t-2 border-black flex items-center gap-1.5"
          >
            <input
              type="text"
              placeholder="Ketik: 'tidur 7 jam' / 'beli kopi 25rb' / 'rapat jam 10' / tanya AI..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              disabled={isSending}
              className="flex-1 neo-input text-xs py-1.5 px-2.5"
            />
            <button
              type="submit"
              disabled={isSending || !inputText.trim()}
              className="neo-btn neo-btn-primary py-1.5 px-2.5 sm:px-3 text-[11px] font-bold flex items-center gap-1 shrink-0"
            >
              {isSending ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <>
                  <Send className="w-3 h-3" />
                  <span className="hidden sm:inline">KIRIM</span>
                </>
              )}
            </button>
          </form>
        </div>
      ) : (
        /* Insight Tab Content */
        <div className="flex-1 p-3.5 space-y-3 overflow-y-auto bg-white dark:bg-[#1E1E24]">
          <div className="flex items-center justify-between pb-2 border-b-2 border-black">
            <span className="font-heading font-extrabold text-[11px] uppercase tracking-wide text-zinc-600 dark:text-zinc-300">
              STATUS KESELARASAN KERJA VS KAS:
            </span>
            {getStatusBadge(status)}
          </div>

          {/* Key Evaluation Card */}
          <div className="bg-[#F6F4EE] dark:bg-[#121214] border-2 border-black p-3 rounded-[4px] shadow-[2px_2px_0px_#000]">
            <p className="text-[10px] font-mono font-bold text-zinc-500 uppercase mb-0.5">
              RINGKASAN EVALUASI CERDAS
            </p>
            <p className="text-xs font-semibold text-black dark:text-white leading-relaxed">
              {insight}
            </p>
          </div>

          {/* Action Items List */}
          {action_items && action_items.length > 0 && (
            <div className="space-y-1.5">
              <p className="text-[11px] font-heading font-extrabold uppercase tracking-wide text-zinc-800 dark:text-zinc-300">
                TINDAKAN SOLUTIF DIREKOMENDASIKAN:
              </p>
              <div className="space-y-1.5">
                {action_items.map((action, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-2 p-2 bg-white dark:bg-[#1E1E24] border-2 border-black rounded-[4px] shadow-[1px_1px_0px_#000]"
                  >
                    <div className="mt-0.5 w-3.5 h-3.5 rounded-full bg-[#FFE600] border border-black flex items-center justify-center shrink-0">
                      <CheckCircle2 className="w-2.5 h-2.5 text-black" strokeWidth={3} />
                    </div>
                    <span className="text-xs font-medium text-black dark:text-white">
                      {action}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* CTA Refresh Analysis */}
          <div className="pt-1">
            <button
              onClick={onAnalyzeAi}
              disabled={isAiLoading}
              className="w-full neo-btn neo-btn-accent py-2 text-xs flex items-center justify-center gap-1.5"
            >
              {isAiLoading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-black" strokeWidth={2.5} />
                  MENGANALISIS DATA DENGAN AI...
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5 text-black" strokeWidth={2.5} />
                  MINTA EVALUASI ULANG AI GEMINI
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
