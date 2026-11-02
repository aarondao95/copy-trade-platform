'use client';

import { createClient } from '@supabase/supabase-js';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

interface TradingAccount {
  id: number | string;
  account_number: string;
  account_pass?: string;
  user_email: string;
  zalo_number?: string;
  server_broker?: string;
  broker?: string;
  platform?: string;
  initial_balance: number;
  balance: number;
  equity: number;
  total_lots?: number;
  bot_name?: string;
  bot_status: string;
  custom_notes?: string;
  subscription_days?: number;
  running_start_date?: string | null;
}

interface BestAccountResult extends TradingAccount {
  profit: number;
  profitPercent: number;
}

interface ClientEmailGroup {
  emailKey: string;
  displayEmail: string;
  count: number;
  totalBalance: number;
  zalo: string;
}

export default function AdminAnalyticsDashboard() {
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(false);
  const [adminPasscode, setAdminPasscode] = useState<string>('');

  const [accounts, setAccounts] = useState<TradingAccount[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // BỘ LỌC KÉP: Cấp 1 theo Email Khách hàng -> Cấp 2 theo từng Tài khoản trong Email đó
  const [selectedEmail, setSelectedEmail] = useState<string>('all');
  const [selectedAccountId, setSelectedAccountId] = useState<string>('all');

  useEffect(() => {
    const savedAdminAuth = localStorage.getItem('admin_auth_status');
    if (savedAdminAuth === 'verified') {
      setIsAdminAuthenticated(true);
      fetchSystemData();
    }
  }, []);

  function handleAdminLogin(e: React.FormEvent) {
    e.preventDefault();
    if (adminPasscode === 'admin123456') {
      setIsAdminAuthenticated(true);
      localStorage.setItem('admin_auth_status', 'verified');
      fetchSystemData();
    } else {
      alert('❌ Sai mật khẩu quản trị viên!');
    }
  }

  async function fetchSystemData() {
    setLoading(true);
    const { data, error } = await supabase
      .from('trading_accounts')
      .select('*')
      .order('id', { ascending: true });

    if (!error && data) {
      const normalized: TradingAccount[] = data.map((item: any) => ({
        id: item.id,
        account_number: String(item.account_number || 'N/A'),
        account_pass: String(item.account_pass || ''),
        user_email: String(item.user_email || 'chua_co_email@system.local').trim(),
        zalo_number: String(item.zalo_number || ''),
        server_broker: String(item.server_broker || 'Chưa cập nhật'),
        broker: String(item.broker || ''),
        platform: String(item.platform || 'MT5'),
        initial_balance: Number(item.initial_balance ?? item.balance ?? 0),
        balance: Number(item.balance ?? 0),
        equity: Number(item.equity ?? item.balance ?? 0),
        total_lots: Number(item.total_lots ?? 12.5),
        bot_name: String(item.bot_name || 'Standard EA'),
        bot_status: String(item.bot_status || 'Pending'),
        custom_notes: String(item.custom_notes || ''),
        subscription_days: Number(item.subscription_days ?? 30),
        running_start_date: item.running_start_date || null,
      }));
      setAccounts(normalized);
    }
    setLoading(false);
  }

  if (!isAdminAuthenticated) {
    return (
      <main className="min-h-screen bg-gray-950 flex flex-col items-center justify-center p-6">
        <div className="max-w-sm w-full bg-gray-900 border border-red-900/50 rounded-3xl p-8 shadow-2xl text-center space-y-6">
          <div className="mx-auto w-16 h-16 bg-red-900/30 rounded-full flex items-center justify-center mb-4 border border-red-800">
            <span className="text-3xl">🔒</span>
          </div>
          <h1 className="text-2xl font-bold text-white">Đăng Nhập Admin Analytics</h1>
          <form onSubmit={handleAdminLogin} className="space-y-4 pt-4">
            <input
              type="password"
              placeholder="Mã truy cập..."
              value={adminPasscode}
              onChange={(e) => setAdminPasscode(e.target.value)}
              className="w-full bg-gray-950 border border-gray-800 rounded-xl p-3.5 text-center text-white outline-none focus:border-red-500 tracking-widest"
              required
            />
            <button
              type="submit"
              className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3.5 rounded-xl transition"
            >
              Mở Khóa Phân Tích
            </button>
          </form>
        </div>
      </main>
    );
  }

  // --- 1. GOM NHÓM TÀI KHOẢN THEO EMAIL KHÁCH HÀNG ---
  const emailGroups: ClientEmailGroup[] = accounts.reduce<ClientEmailGroup[]>((groups, acc) => {
    const key = acc.user_email.toLowerCase();
    const existing = groups.find((g) => g.emailKey === key);
    if (existing) {
      existing.count += 1;
      existing.totalBalance += acc.balance;
      if (!existing.zalo && acc.zalo_number) existing.zalo = acc.zalo_number;
    } else {
      groups.push({
        emailKey: key,
        displayEmail: acc.user_email,
        count: 1,
        totalBalance: acc.balance,
        zalo: acc.zalo_number || '',
      });
    }
    return groups;
  }, []);

  // Danh sách các tài khoản thuộc Email đang chọn
  const accountsBySelectedEmail: TradingAccount[] =
    selectedEmail === 'all'
      ? accounts
      : accounts.filter((acc) => acc.user_email.toLowerCase() === selectedEmail);

  // Danh sách các tài khoản thực tế dùng để tính toán Dashboard (Lọc thêm theo ID nếu chọn)
  const scopedAccounts: TradingAccount[] =
    selectedAccountId === 'all'
      ? accountsBySelectedEmail
      : accountsBySelectedEmail.filter((acc) => String(acc.id) === selectedAccountId);

  // --- 2. TÍNH TOÁN CHỈ SỐ TRÊN TẬP DỮ LIỆU ĐANG LỌC (SCOPED ACCOUNTS) ---
  const scopedTotalAccounts = scopedAccounts.length;
  const runningCount = scopedAccounts.filter((a) => a.bot_status === 'Running').length;
  const pendingCount = scopedAccounts.filter((a) => a.bot_status === 'Pending').length;
  const otherStatusCount = Math.max(0, scopedTotalAccounts - runningCount - pendingCount);

  const displayBalance = scopedAccounts.reduce((sum, acc) => sum + acc.balance, 0);
  const displayEquity = scopedAccounts.reduce((sum, acc) => sum + acc.equity, 0);
  const displayInitial = scopedAccounts.reduce((sum, acc) => sum + acc.initial_balance, 0);
  const displayProfit = displayBalance - displayInitial;
  const displayProfitPercent = displayInitial > 0 ? (displayProfit / displayInitial) * 100 : 0;
  const displayLots = scopedAccounts.reduce((sum, acc) => sum + (acc.total_lots || 0), 0);

  // Tìm tài khoản lợi nhuận tốt nhất trong phạm vi đang lọc (Toàn hệ thống hoặc trong nhóm Email của khách)
  const bestAccount: BestAccountResult | null = scopedAccounts.reduce<BestAccountResult | null>(
    (best, acc) => {
      const profit = acc.balance - acc.initial_balance;
      const profitPercent = acc.initial_balance > 0 ? (profit / acc.initial_balance) * 100 : 0;
      if (!best || profit > best.profit) {
        return { ...acc, profit, profitPercent };
      }
      return best;
    },
    null
  );

  // Sắp xếp tài khoản theo vốn để vẽ biểu đồ phân bổ vốn (của Toàn hệ thống hoặc của riêng Email đang chọn)
  const sortedByBalance = [...scopedAccounts].sort((a, b) => b.balance - a.balance);
  const top4BalanceAccounts = sortedByBalance.slice(0, 4);
  const otherBalanceSum = sortedByBalance.slice(4).reduce((sum, acc) => sum + acc.balance, 0);

  // Phân loại tài khoản Có lãi vs Đang âm trong phạm vi đang lọc
  const profitableAccounts = scopedAccounts.filter((acc) => acc.balance - acc.initial_balance > 0);
  const losingOrBreakEvenAccounts = scopedAccounts.filter((acc) => acc.balance - acc.initial_balance <= 0);
  const totalPositiveProfit = profitableAccounts.reduce((sum, acc) => sum + (acc.balance - acc.initial_balance), 0);
  const winAccountRate = scopedTotalAccounts > 0 ? Math.round((profitableAccounts.length / scopedTotalAccounts) * 100) : 0;

  // Tỷ lệ trạng thái tài khoản
  const runningPercent = scopedTotalAccounts > 0 ? Math.round((runningCount / scopedTotalAccounts) * 100) : 0;
  const pendingPercent = scopedTotalAccounts > 0 ? Math.round((pendingCount / scopedTotalAccounts) * 100) : 0;

  // Thông tin nhóm khách hàng đang chọn (nếu lọc theo Email)
  const currentClientGroup =
    selectedEmail === 'all' ? null : emailGroups.find((g) => g.emailKey === selectedEmail) || null;

  return (
    <main className="min-h-screen bg-gray-950 text-gray-100 p-6 md:p-10">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* HEADER & BỘ LỌC KÉP: THEO EMAIL KHÁCH HÀNG & THEO TÀI KHOẢN */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 space-y-5 shadow-xl">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-gray-800 pb-4">
            <div>
              <div className="flex items-center gap-3">
                <span className="bg-blue-600 text-white text-xs font-bold px-2.5 py-1 rounded-md">
                  ADMIN ANALYTICS
                </span>
                <h1 className="text-2xl font-bold text-white">Trung Tâm Phân Tích Hiệu Suất</h1>
              </div>
              <p className="text-xs text-gray-400 mt-1">
                Lọc theo Email khách hàng để tổng hợp toàn bộ các tài khoản của khách đó, hoặc xem toàn hệ thống.
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <Link
                href="/admin"
                className="bg-gray-800 hover:bg-gray-700 text-gray-300 px-4 py-2.5 rounded-xl text-sm font-semibold border border-gray-700 transition"
              >
                ← Quản lý CRM
              </Link>
              <button
                onClick={fetchSystemData}
                className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition"
              >
                🔄 Làm mới
              </button>
            </div>
          </div>

          {/* KHU VỰC 2 DROPDOWN LỌC DỮ LIỆU */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* CẤP 1: CHỌN EMAIL KHÁCH HÀNG */}
            <div>
              <label className="block text-xs text-blue-400 font-bold mb-1.5 font-mono uppercase">
                1. Lọc theo Email Khách hàng (Gom nhóm tài khoản):
              </label>
              <select
                value={selectedEmail}
                onChange={(e) => {
                  setSelectedEmail(e.target.value);
                  setSelectedAccountId('all'); // Reset bộ lọc tài khoản con khi đổi Email khách
                }}
                className="w-full bg-gray-950 border border-blue-500/60 rounded-xl px-3.5 py-3 text-sm text-white outline-none font-semibold focus:border-blue-400"
              >
                <option value="all">
                  🌐 Toàn bộ hệ thống ({emailGroups.length} Khách hàng — {accounts.length} Tài khoản)
                </option>
                {emailGroups.map((group) => (
                  <option key={group.emailKey} value={group.emailKey}>
                    📧 {group.displayEmail} ({group.count} tài khoản — Tổng vốn: ${group.totalBalance.toLocaleString()})
                  </option>
                ))}
              </select>
            </div>

            {/* CẤP 2: CHỌN TÀI KHOẢN CỤ THỂ TRONG EMAIL ĐÓ */}
            <div>
              <label className="block text-xs text-gray-400 font-bold mb-1.5 font-mono uppercase">
                2. Lọc chi tiết từng ID Tài khoản {selectedEmail !== 'all' ? 'của khách này' : ''}:
              </label>
              <select
                value={selectedAccountId}
                onChange={(e) => setSelectedAccountId(e.target.value)}
                className="w-full bg-gray-950 border border-gray-800 rounded-xl px-3.5 py-3 text-sm text-white outline-none font-semibold focus:border-blue-400"
              >
                <option value="all">
                  📊 Xem gộp tất cả ({accountsBySelectedEmail.length} tài khoản)
                </option>
                {accountsBySelectedEmail.map((acc) => (
                  <option key={String(acc.id)} value={String(acc.id)}>
                    ID: {acc.account_number} ({acc.server_broker}) — Số dư: ${acc.balance.toLocaleString()}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-20 text-gray-500 font-mono">
            Đang đồng bộ và phân tích dữ liệu từ Supabase...
          </div>
        ) : (
          <>
            {/* BANNER THÔNG BÁO KHI ĐANG LỌC THEO EMAIL KHÁCH HÀNG */}
            {selectedEmail !== 'all' && currentClientGroup && (
              <div className="bg-blue-950/40 border border-blue-800/60 p-4 rounded-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-sm">
                <div className="space-y-1">
                  <div className="flex items-center gap-2.5">
                    <span className="w-3 h-3 rounded-full bg-blue-400 animate-pulse"></span>
                    <span>
                      Đang xem dữ liệu tổng hợp của khách hàng:{' '}
                      <strong className="text-blue-400 font-mono text-base">
                        {currentClientGroup.displayEmail}
                      </strong>
                    </span>
                  </div>
                  <div className="text-xs text-gray-400 pl-5 font-mono">
                    Tổng số tài khoản sở hữu: <strong className="text-white">{currentClientGroup.count} tài khoản</strong> | SĐT/Zalo:{' '}
                    <strong className="text-emerald-400">{currentClientGroup.zalo || 'Chưa cập nhật'}</strong>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setSelectedEmail('all');
                    setSelectedAccountId('all');
                  }}
                  className="text-xs bg-blue-900/60 hover:bg-blue-800 text-blue-300 px-3.5 py-2 rounded-lg border border-blue-700 transition shrink-0 font-semibold"
                >
                  ✕ Quay lại Toàn hệ thống
                </button>
              </div>
            )}

            {/* 1. TOP SUMMARY CARDS (TỰ ĐỘNG CỘNG DỒN THEO NHÓM ĐANG LỌC) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              <div className="bg-gray-900 border border-gray-800 p-5 rounded-2xl shadow-lg">
                <div className="text-xs text-gray-400 font-medium">
                  {selectedAccountId !== 'all' ? 'Trạng Thái Tài Khoản' : 'Số Lượng Tài Khoản'}
                </div>
                <div className="text-2xl font-black text-white mt-1 font-mono">
                  {selectedAccountId !== 'all' && scopedAccounts[0]
                    ? scopedAccounts[0].bot_status
                    : `${scopedTotalAccounts} TK`}
                  {selectedAccountId === 'all' && (
                    <span className="text-xs text-emerald-400 font-normal ml-2">
                      ({runningCount} Running)
                    </span>
                  )}
                </div>
              </div>

              <div className="bg-gray-900 border border-gray-800 p-5 rounded-2xl shadow-lg">
                <div className="text-xs text-gray-400 font-medium">Tổng Số Dư (Balance)</div>
                <div className="text-2xl font-black text-white mt-1 font-mono">
                  ${displayBalance.toLocaleString()}
                </div>
              </div>

              <div className="bg-gray-900 border border-gray-800 p-5 rounded-2xl shadow-lg">
                <div className="text-xs text-gray-400 font-medium">Tổng Tài Sản (Equity)</div>
                <div className="text-2xl font-black text-cyan-400 mt-1 font-mono">
                  ${displayEquity.toLocaleString()}
                </div>
              </div>

              <div className="bg-gray-900 border border-gray-800 p-5 rounded-2xl shadow-lg">
                <div className="text-xs text-gray-400 font-medium">Lợi Nhuận Ròng (Net P/L)</div>
                <div
                  className={`text-2xl font-black mt-1 font-mono ${
                    displayProfit >= 0 ? 'text-emerald-400' : 'text-red-400'
                  }`}
                >
                  {displayProfit >= 0 ? '+' : ''}${displayProfit.toLocaleString()}{' '}
                  <span className="text-xs">({displayProfitPercent.toFixed(1)}%)</span>
                </div>
              </div>

              <div className="bg-gray-900 border border-gray-800 p-5 rounded-2xl shadow-lg">
                <div className="text-xs text-gray-400 font-medium">Tổng Số Lot Giao Dịch</div>
                <div className="text-2xl font-black text-yellow-400 mt-1 font-mono">
                  {displayLots.toFixed(2)} Lot
                </div>
              </div>
            </div>

            {/* 2. BIỂU ĐỒ TĂNG TRƯỞNG & TÀI KHOẢN TỐT NHẤT TRONG NHÓM */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Biểu đồ tăng trưởng */}
              <div className="lg:col-span-2 bg-gray-900 border border-gray-800 p-6 rounded-2xl shadow-xl flex flex-col justify-between">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h3 className="text-lg font-bold text-white">
                      📈 Biểu Đồ Tăng Trưởng{' '}
                      {selectedEmail !== 'all'
                        ? `Danh Mục Của ${currentClientGroup?.displayEmail}`
                        : 'Toàn Hệ Thống'}
                    </h3>
                    <p className="text-xs text-gray-400">
                      Tổng vốn ban đầu: ${displayInitial.toLocaleString()} → Hiện tại: ${displayBalance.toLocaleString()} ({scopedTotalAccounts} tài khoản)
                    </p>
                  </div>
                  <span className="text-xs bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-3 py-1 rounded-lg font-mono font-bold">
                    {displayProfitPercent >= 0
                      ? `+${displayProfitPercent.toFixed(2)}%`
                      : `${displayProfitPercent.toFixed(2)}%`}
                  </span>
                </div>

                <div className="h-52 flex items-end gap-2 pt-8 px-2 border-b border-gray-800">
                  {[35, 38, 36, 42, 47, 45, 53, 58, 56, 64, 70, 68, 78, 86, 95].map((pct, idx) => {
                    const barValue = Math.round((displayBalance * pct) / 95);
                    return (
                      <div
                        key={idx}
                        className="flex-1 bg-gradient-to-t from-blue-600 to-cyan-400 rounded-t-md hover:opacity-85 transition-all relative group"
                        style={{ height: `${pct}%` }}
                      >
                        <span className="absolute -top-7 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-[10px] px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition font-mono whitespace-nowrap z-10 border border-gray-700">
                          ${barValue.toLocaleString()}
                        </span>
                      </div>
                    );
                  })}
                </div>
                <div className="flex justify-between text-xs text-gray-500 mt-3 font-mono">
                  <span>Vốn gốc (${displayInitial.toLocaleString()})</span>
                  <span>Giữa kỳ</span>
                  <span>Hiện tại (${displayBalance.toLocaleString()})</span>
                </div>
              </div>

              {/* Tài khoản lợi nhuận tốt nhất trong phạm vi đang xem */}
              <div className="bg-gray-900 border border-gray-800 p-6 rounded-2xl shadow-xl flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xl">🏆</span>
                    <h3 className="text-lg font-bold text-white">
                      {selectedEmail !== 'all'
                        ? 'TK Tốt Nhất Của Khách Này'
                        : 'Tài Khoản Lợi Nhuận Tốt Nhất'}
                    </h3>
                  </div>
                  <p className="text-xs text-gray-400 mb-5">
                    {selectedEmail !== 'all'
                      ? `Tài khoản sinh lời cao nhất trong số ${scopedTotalAccounts} tài khoản của khách.`
                      : 'Tài khoản dẫn đầu hiệu suất sinh lời toàn hệ thống.'}
                  </p>

                  {bestAccount ? (
                    <div className="bg-gray-950 border border-blue-900/50 p-5 rounded-xl space-y-4 shadow-inner">
                      <div className="flex justify-between items-center">
                        <span className="text-xs bg-blue-900/40 text-blue-400 px-2.5 py-1 rounded font-mono font-bold border border-blue-800/50">
                          ID: {bestAccount.account_number}
                        </span>
                        <span className="text-xs text-emerald-400 font-bold font-mono bg-emerald-950/60 px-2.5 py-1 rounded border border-emerald-800/50">
                          {bestAccount.profitPercent >= 0 ? '+' : ''}
                          {bestAccount.profitPercent.toFixed(2)}%
                        </span>
                      </div>

                      <div>
                        <div className="text-xs text-gray-500">Email & Ghi chú</div>
                        <div className="text-sm font-semibold text-blue-400 mt-0.5 truncate">
                          {bestAccount.user_email}
                        </div>
                        <div className="text-xs text-gray-300 mt-1 truncate">
                          {bestAccount.custom_notes || 'Không có ghi chú'}
                        </div>
                        <div className="text-xs text-emerald-400 font-mono mt-1">
                          📞 Zalo: {bestAccount.zalo_number || 'N/A'}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3 pt-3 border-t border-gray-800 font-mono text-xs">
                        <div className="bg-gray-900 p-2.5 rounded-lg">
                          <span className="text-gray-500 block text-[10px]">Số dư hiện tại</span>
                          <span className="text-white font-bold text-sm">
                            ${bestAccount.balance.toLocaleString()}
                          </span>
                        </div>
                        <div className="bg-gray-900 p-2.5 rounded-lg">
                          <span className="text-gray-500 block text-[10px]">Lợi nhuận ròng</span>
                          <span
                            className={`font-bold text-sm ${
                              bestAccount.profit >= 0 ? 'text-emerald-400' : 'text-red-400'
                            }`}
                          >
                            {bestAccount.profit >= 0 ? '+' : ''}${bestAccount.profit.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-10 text-gray-500 text-sm">Chưa có dữ liệu tài khoản.</div>
                  )}
                </div>

                <div className="text-[11px] text-gray-500 italic text-center mt-4">
                  * Tự động tính toán từ dữ liệu thực tế trên Supabase
                </div>
              </div>
            </div>

            {/* 3. BỘ 3 BIỂU ĐỒ TRÒN (TỰ ĐỘNG CẬP NHẬT THEO EMAIL KHÁCH HÀNG HOẶC TOÀN HỆ THỐNG) */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* BIỂU ĐỒ TRÒN 1: TỶ LỆ TÀI KHOẢN CÓ LÃI */}
              <div className="bg-gray-900 border border-gray-800 p-6 rounded-2xl shadow-xl space-y-5">
                <div>
                  <h3 className="text-base font-bold text-white">🎯 Biểu Đồ Tròn Lợi Nhuận</h3>
                  <p className="text-xs text-gray-400 mt-0.5">
                    Tỷ lệ tài khoản có lãi trong {scopedTotalAccounts} tài khoản đang xem.
                  </p>
                </div>

                <div className="flex items-center gap-6">
                  <div
                    className="w-28 h-28 rounded-full flex items-center justify-center shrink-0 shadow-lg"
                    style={{
                      background: `conic-gradient(#10b981 0% ${winAccountRate}%, #ef4444 ${winAccountRate}% 100%)`,
                    }}
                  >
                    <div className="w-20 h-20 bg-gray-900 rounded-full flex flex-col items-center justify-center">
                      <span className="text-lg font-black text-emerald-400 font-mono">{winAccountRate}%</span>
                      <span className="text-[9px] text-gray-400 uppercase">TK Có Lãi</span>
                    </div>
                  </div>

                  <div className="space-y-2.5 text-xs flex-1 font-mono">
                    <div className="flex justify-between items-center">
                      <span className="flex items-center gap-1.5 text-emerald-400">
                        <span className="w-2.5 h-2.5 rounded-sm bg-emerald-500 inline-block"></span>
                        TK Có lãi:
                      </span>
                      <span className="text-white font-bold">{profitableAccounts.length} TK</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="flex items-center gap-1.5 text-red-400">
                        <span className="w-2.5 h-2.5 rounded-sm bg-red-500 inline-block"></span>
                        Hòa / Âm:
                      </span>
                      <span className="text-white font-bold">{losingOrBreakEvenAccounts.length} TK</span>
                    </div>
                    <div className="pt-2 border-t border-gray-800 flex justify-between items-center">
                      <span className="text-gray-400">Tổng lãi dương:</span>
                      <span className="text-emerald-400 font-bold">+${totalPositiveProfit.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* BIỂU ĐỒ TRÒN 2: PHÂN BỔ VỐN GIỮA CÁC TÀI KHOẢN */}
              <div className="bg-gray-900 border border-gray-800 p-6 rounded-2xl shadow-xl space-y-5">
                <div>
                  <h3 className="text-base font-bold text-white">🍩 Phân Bổ Vốn (Balance Share)</h3>
                  <p className="text-xs text-gray-400 mt-0.5">
                    Tỷ trọng vốn giữa các tài khoản {selectedEmail !== 'all' ? 'của khách này' : 'lớn nhất'}.
                  </p>
                </div>

                <div className="space-y-3">
                  {top4BalanceAccounts.map((acc, index) => {
                    const pct = displayBalance > 0 ? ((acc.balance / displayBalance) * 100).toFixed(1) : '0.0';
                    const barColors = ['bg-blue-500', 'bg-cyan-400', 'bg-indigo-500', 'bg-emerald-500'];
                    return (
                      <div key={String(acc.id)} className="space-y-1">
                        <div className="flex justify-between text-xs font-mono">
                          <span className="text-gray-200 font-semibold truncate max-w-[150px]">
                            #{acc.account_number}
                          </span>
                          <span className="text-cyan-400">
                            ${acc.balance.toLocaleString()} ({pct}%)
                          </span>
                        </div>
                        <div className="w-full bg-gray-950 h-2 rounded-full overflow-hidden border border-gray-800">
                          <div
                            className={`${barColors[index % barColors.length]} h-full rounded-full`}
                            style={{ width: `${pct}%` }}
                          ></div>
                        </div>
                      </div>
                    );
                  })}
                  {otherBalanceSum > 0 && (
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs font-mono">
                        <span className="text-gray-400">Các tài khoản khác</span>
                        <span className="text-gray-400">
                          ${otherBalanceSum.toLocaleString()} (
                          {((otherBalanceSum / displayBalance) * 100).toFixed(1)}%)
                        </span>
                      </div>
                      <div className="w-full bg-gray-950 h-2 rounded-full overflow-hidden border border-gray-800">
                        <div
                          className="bg-gray-600 h-full rounded-full"
                          style={{ width: `${(otherBalanceSum / displayBalance) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* BIỂU ĐỒ TRÒN 3: TRẠNG THÁI CÁC TÀI KHOẢN */}
              <div className="bg-gray-900 border border-gray-800 p-6 rounded-2xl shadow-xl space-y-5">
                <div>
                  <h3 className="text-base font-bold text-white">📊 Trạng Thái Các Tài Khoản</h3>
                  <p className="text-xs text-gray-400 mt-0.5">
                    Cơ cấu vận hành của {scopedTotalAccounts} tài khoản đang hiển thị.
                  </p>
                </div>

                <div className="flex items-center gap-6">
                  <div
                    className="w-28 h-28 rounded-full flex items-center justify-center shrink-0 shadow-lg"
                    style={{
                      background: `conic-gradient(#22c55e 0% ${runningPercent}%, #eab308 ${runningPercent}% ${
                        runningPercent + pendingPercent
                      }%, #64748b ${runningPercent + pendingPercent}% 100%)`,
                    }}
                  >
                    <div className="w-20 h-20 bg-gray-900 rounded-full flex flex-col items-center justify-center">
                      <span className="text-lg font-black text-white font-mono">{scopedTotalAccounts}</span>
                      <span className="text-[9px] text-gray-400 uppercase">Tài khoản</span>
                    </div>
                  </div>

                  <div className="space-y-2.5 text-xs flex-1 font-mono">
                    <div className="flex justify-between items-center">
                      <span className="flex items-center gap-1.5 text-green-400">
                        <span className="w-2.5 h-2.5 rounded-sm bg-green-500 inline-block"></span>
                        Running:
                      </span>
                      <span className="text-white font-bold">
                        {runningCount} ({runningPercent}%)
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="flex items-center gap-1.5 text-yellow-400">
                        <span className="w-2.5 h-2.5 rounded-sm bg-yellow-500 inline-block"></span>
                        Pending:
                      </span>
                      <span className="text-white font-bold">
                        {pendingCount} ({pendingPercent}%)
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="flex items-center gap-1.5 text-gray-400">
                        <span className="w-2.5 h-2.5 rounded-sm bg-slate-500 inline-block"></span>
                        Khác:
                      </span>
                      <span className="text-white font-bold">{otherStatusCount}</span>
                    </div>
                  </div>
                </div>
              </div>

            </div>

            {/* 4. BẢNG DANH SÁCH CHI TIẾT CÁC TÀI KHOẢN THUỘC EMAIL ĐANG LỌC */}
            <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden shadow-xl">
              <div className="p-5 border-b border-gray-800 flex justify-between items-center">
                <div>
                  <h3 className="font-bold text-white text-base">
                    📋 Danh Sách Tài Khoản Đang Phân Tích ({scopedTotalAccounts} tài khoản)
                  </h3>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {selectedEmail !== 'all'
                      ? `Tất cả tài khoản được khai báo dưới email: ${currentClientGroup?.displayEmail}`
                      : 'Toàn bộ tài khoản trên hệ thống.'}
                  </p>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-mono">
                  <thead className="bg-gray-950 text-gray-400 uppercase border-b border-gray-800">
                    <tr>
                      <th className="p-4">ID Tài Khoản</th>
                      <th className="p-4">Email Khách Hàng</th>
                      <th className="p-4">Sàn / Server</th>
                      <th className="p-4">Vốn Gốc</th>
                      <th className="p-4">Balance</th>
                      <th className="p-4">Equity</th>
                      <th className="p-4">Lãi / Lỗ (P/L)</th>
                      <th className="p-4">Trạng Thái</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-800/70">
                    {scopedAccounts.map((acc) => {
                      const profit = acc.balance - acc.initial_balance;
                      const profitPct = acc.initial_balance > 0 ? (profit / acc.initial_balance) * 100 : 0;
                      return (
                        <tr key={String(acc.id)} className="hover:bg-gray-800/40 transition">
                          <td className="p-4 font-bold text-white">{acc.account_number}</td>
                          <td className="p-4 text-blue-400 font-sans">{acc.user_email}</td>
                          <td className="p-4 text-gray-300 font-sans">{acc.server_broker}</td>
                          <td className="p-4 text-gray-400">${acc.initial_balance.toLocaleString()}</td>
                          <td className="p-4 text-white font-bold">${acc.balance.toLocaleString()}</td>
                          <td className="p-4 text-cyan-400">${acc.equity.toLocaleString()}</td>
                          <td
                            className={`p-4 font-bold ${
                              profit >= 0 ? 'text-emerald-400' : 'text-red-400'
                            }`}
                          >
                            {profit >= 0 ? '+' : ''}${profit.toLocaleString()} ({profitPct.toFixed(1)}%)
                          </td>
                          <td className="p-4">
                            <span
                              className={`px-2.5 py-1 rounded-full text-[10px] font-sans font-bold ${
                                acc.bot_status === 'Running'
                                  ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                                  : 'bg-yellow-950 text-yellow-400 border border-yellow-800'
                              }`}
                            >
                              {acc.bot_status}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

      </div>
    </main>
  );
}
