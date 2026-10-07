'use client';

import { createClient } from '@supabase/supabase-js';
import { useEffect, useState } from 'react';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

export default function AdminDashboard() {
  const [accounts, setAccounts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  // Quản lý email tra cứu & trạng thái đăng nhập (KHÔNG DÙNG LOCALSTORAGE)
  const [clientEmail, setClientEmail] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Form thêm thủ công
  const [accountNumber, setAccountNumber] = useState('');
  const [accountPass, setAccountPass] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [serverBroker, setServerBroker] = useState('');
  const [balance, setBalance] = useState('');
  const [customNotes, setCustomNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Tìm kiếm & Phân trang
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 3;

  async function fetchAccounts() {
    setLoading(true);
    const { data, error } = await supabase
      .from('trading_accounts')
      .select('*')
      .order('id', { ascending: false });

    if (error) {
      setErrorMessage(error.message);
    } else {
      setAccounts(data || []);
    }
    setLoading(false);
  }

  useEffect(() => {
    // Chỉ fetch data ban đầu, không tự động đăng nhập email cũ nữa
    fetchAccounts();
  }, []);

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (!clientEmail.trim()) {
      alert('Vui lòng nhập email tra cứu!');
      return;
    }
    // Chỉ bật cờ đăng nhập tạm thời, F5 là mất
    setIsLoggedIn(true);
    setCurrentPage(1);
  }

  function handleLogout(e: React.MouseEvent) {
    e.preventDefault();
    setIsLoggedIn(false);
    setClientEmail('');
    setCurrentPage(1);
  }

  async function handleAddAccount(e: React.FormEvent) {
    e.preventDefault();
    if (!accountNumber || !accountPass || !userEmail || !serverBroker || !balance) {
      alert('Vui lòng điền đầy đủ tất cả thông tin!');
      return;
    }

    setSubmitting(true);
    const parsedBalance = parseFloat(balance);
    const { error } = await supabase.from('trading_accounts').insert([
      {
        account_number: accountNumber,
        account_pass: accountPass,
        user_email: userEmail,
        server_broker: serverBroker,
        initial_balance: parsedBalance,
        balance: parsedBalance,
        equity: parsedBalance,
        custom_notes: customNotes,
        bot_status: 'Pending',
      },
    ]);

    if (error) {
      alert('Lỗi khi thêm: ' + error.message);
    } else {
      setAccountNumber('');
      setAccountPass('');
      setUserEmail('');
      setServerBroker('');
      setBalance('');
      setCustomNotes('');
      fetchAccounts();
    }
    setSubmitting(false);
  }

  async function handleDelete(id: any) {
    if (!confirm('Bạn có chắc chắn muốn xóa tài khoản này không?')) return;

    const { error } = await supabase.from('trading_accounts').delete().eq('id', id);
    if (error) {
      alert('Lỗi khi xóa: ' + error.message);
    } else {
      fetchAccounts();
    }
  }

  // Thống kê tổng quan hệ thống
  const totalAccountsCount = accounts.length;
  const runningAccountsCount = accounts.filter(acc => acc.bot_status === 'Running').length;
  const pendingAccountsCount = accounts.filter(acc => acc.bot_status === 'Pending' || !acc.bot_status).length;
  
  const totalCapitalRunning = accounts
    .filter(acc => acc.bot_status === 'Running')
    .reduce((sum, acc) => sum + Number(acc.balance || acc.initial_balance || 0), 0);

  const totalSystemProfit = accounts.reduce((sum, acc) => {
    const init = Number(acc.initial_balance || acc.balance || 0);
    const curr = Number(acc.balance || 0);
    return sum + (curr - init);
  }, 0);

  // Lọc dữ liệu: nếu đang bật lọc theo email thì chỉ hiện acc của email đó
  const filteredAccounts = accounts.filter((acc) => {
    const searchLower = searchTerm.toLowerCase();
    const matchSearch = (
      acc.account_number?.toLowerCase().includes(searchLower) ||
      acc.user_email?.toLowerCase().includes(searchLower) ||
      acc.server_broker?.toLowerCase().includes(searchLower) ||
      acc.custom_notes?.toLowerCase().includes(searchLower)
    );
    if (isLoggedIn && clientEmail.trim() !== '') {
      return matchSearch && acc.user_email?.toLowerCase() === clientEmail.trim().toLowerCase();
    }
    return matchSearch;
  });

  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentAccounts = filteredAccounts.slice(indexOfFirstRow, indexOfLastRow);
  const totalPages = Math.ceil(filteredAccounts.length / rowsPerPage);

  return (
    <main className="min-h-screen bg-gray-950 text-gray-100 p-6 md:p-10">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* HEADER TÍCH HỢP Ô EMAIL, NÚT XEM DASHBOARD VÀ NÚT THOÁT */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 flex flex-col lg:flex-row justify-between items-center gap-4 shadow-xl">
          <div>
            <h1 className="text-2xl font-bold text-white">Investor Dashboard - Theo dõi Hiệu suất</h1>
            <p className="text-sm text-gray-400 mt-1">Hệ thống đồng bộ dữ liệu Real-time từ VPS & MetaTrader</p>
          </div>
          
          <form onSubmit={handleLogin} className="flex flex-wrap items-center gap-2.5 w-full lg:w-auto">
            <input
              type="email"
              placeholder="Nhập email tra cứu..."
              value={clientEmail}
              onChange={(e) => setClientEmail(e.target.value)}
              className="bg-gray-950 border border-gray-800 text-white text-sm px-4 py-2.5 rounded-xl outline-none focus:border-blue-500 font-mono w-full sm:w-64"
            />
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition shadow-lg shadow-blue-600/20"
            >
              Xem Dashboard
            </button>
            <button
              type="button"
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition shadow-lg shadow-red-600/20"
              title="Thoát tài khoản"
            >
              🚪 Thoát
            </button>
          </form>
        </div>

        {/* THỐNG KÊ TỔNG QUAN HỆ THỐNG */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 shadow-lg">
            <div className="text-xs text-gray-400 font-medium">Tổng số ACC đang chạy</div>
            <div className="text-2xl font-bold font-mono text-green-400 mt-2 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse"></span>
              {runningAccountsCount} <span className="text-xs text-gray-500 font-normal">/ {totalAccountsCount} acc</span>
            </div>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 shadow-lg">
            <div className="text-xs text-gray-400 font-medium">Số ACC chờ chạy VPS</div>
            <div className="text-2xl font-bold font-mono text-yellow-400 mt-2 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-yellow-500"></span>
              {pendingAccountsCount} <span className="text-xs text-gray-500 font-normal">acc</span>
            </div>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 shadow-lg">
            <div className="text-xs text-gray-400 font-medium">Tổng vốn đang chạy</div>
            <div className="text-2xl font-bold font-mono text-white mt-2">
              ${totalCapitalRunning.toLocaleString()}
            </div>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 shadow-lg">
            <div className="text-xs text-gray-400 font-medium">Tổng lợi nhuận toàn hệ thống</div>
            <div className={`text-2xl font-bold font-mono mt-2 ${totalSystemProfit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {totalSystemProfit >= 0 ? '+' : ''}${totalSystemProfit.toLocaleString()}
            </div>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 shadow-lg">
            <div className="text-xs text-gray-400 font-medium">Trạng thái hạ tầng VPS</div>
            <div className="text-lg font-bold font-mono text-blue-400 mt-2 flex items-center gap-1.5">
              🟢 Stable (Online)
            </div>
          </div>
        </div>

        {/* FORM THÊM TÀI KHOẢN THỦ CÔNG */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 shadow-xl space-y-4">
          <h2 className="text-lg font-bold text-white border-b border-gray-800 pb-3">➕ Thêm tài khoản thủ công</h2>
          <form onSubmit={handleAddAccount} className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1">Tài khoản (ID MT4/MT5)</label>
              <input
                type="text"
                placeholder="Ví dụ: 88392011"
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
                className="w-full bg-gray-950 border border-gray-800 rounded-xl p-2.5 text-sm text-white outline-none focus:border-blue-500 font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1">Pass (Mật khẩu giao dịch)</label>
              <input
                type="text"
                placeholder="Mật khẩu tài khoản"
                value={accountPass}
                onChange={(e) => setAccountPass(e.target.value)}
                className="w-full bg-gray-950 border border-gray-800 rounded-xl p-2.5 text-sm text-white outline-none focus:border-blue-500 font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1">Email khách hàng</label>
              <input
                type="email"
                placeholder="khachhang@gmail.com"
                value={userEmail}
                onChange={(e) => setUserEmail(e.target.value)}
                className="w-full bg-gray-950 border border-gray-800 rounded-xl p-2.5 text-sm text-white outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1">Server broker</label>
              <input
                type="text"
                placeholder="Ví dụ: Exness-Real15"
                value={serverBroker}
                onChange={(e) => setServerBroker(e.target.value)}
                className="w-full bg-gray-950 border border-gray-800 rounded-xl p-2.5 text-sm text-white outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1">Vốn ban đầu ($)</label>
              <input
                type="number"
                step="0.01"
                placeholder="1000"
                value={balance}
                onChange={(e) => setBalance(e.target.value)}
                className="w-full bg-gray-950 border border-gray-800 rounded-xl p-2.5 text-sm text-white outline-none focus:border-blue-500 font-mono text-green-400 font-bold"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1">Yêu cầu setup (Custom Notes)</label>
              <input
                type="text"
                placeholder="Ví dụ: DCA 15 giá..."
                value={customNotes}
                onChange={(e) => setCustomNotes(e.target.value)}
                className="w-full bg-gray-950 border border-gray-800 rounded-xl p-2.5 text-sm text-white outline-none focus:border-blue-500"
              />
            </div>
            <div className="md:col-span-3">
              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-xl transition duration-200 shadow-lg shadow-blue-600/20"
              >
                {submitting ? 'Đang thêm...' : 'Lưu tài khoản lên hệ thống'}
              </button>
            </div>
          </form>
        </div>

        {/* DANH SÁCH HIỆU SUẤT TỪNG TÀI KHOẢN (12 TRƯỜNG THÔNG TIN ĐẦY ĐỦ) */}
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-gray-900 border border-gray-800 rounded-2xl p-6 shadow-xl">
            <h2 className="text-lg font-bold text-white">
              📊 Hiệu suất Chi tiết {isLoggedIn && clientEmail ? `cho: ${clientEmail}` : 'Tất cả tài khoản'}
            </h2>
            <div className="w-full md:w-80">
              <input
                type="text"
                placeholder="🔍 Tìm kiếm tài khoản, email, ghi chú..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full bg-gray-950 border border-gray-800 rounded-xl px-3 py-2 text-sm text-white outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {errorMessage && (
            <div className="bg-red-950 border border-red-700 text-red-300 px-4 py-3 rounded-xl text-sm">
              Lỗi: {errorMessage}
            </div>
          )}

          {loading ? (
            <div className="text-center py-12 text-gray-500 bg-gray-900 border border-gray-800 rounded-2xl">Đang tải dữ liệu hiệu suất...</div>
          ) : currentAccounts.length === 0 ? (
            <div className="text-center py-12 text-gray-500 bg-gray-900 border border-gray-800 rounded-2xl">
              Chưa có dữ liệu tài khoản nào {isLoggedIn ? `thuộc email "${clientEmail}"` : 'trong hệ thống'}.
            </div>
          ) : (
            <div className="space-y-6">
              {currentAccounts.map((acc: any) => {
                const initVal = Number(acc.initial_balance || acc.balance || 0);
                const balanceVal = Number(acc.balance || 0);
                const equityVal = Number(acc.equity || balanceVal);
                const profitVal = balanceVal - initVal;
                const profitPercent = initVal > 0 ? (profitVal / initVal) * 100 : 0;

                const drawdown = acc.drawdown || '0.00%';
                const profitDay = Number(acc.profit_today || 0);
                const profitWeek = Number(acc.profit_week || 0);
                const profitMonth = Number(acc.profit_month || balanceVal);
                const openOrders = acc.open_orders || acc.total_trades || 0;
                const totalTrades = acc.total_trades || 0;
                const buyTrades = acc.buy_trades || 0;
                const sellTrades = acc.sell_trades || 0;
                const totalLots = Number(acc.total_lots || 0);

                return (
                  <div key={acc.id} className="bg-gray-900 border border-gray-800 rounded-2xl p-6 shadow-xl space-y-5">
                    
                    {/* HÀNG ĐẦU MỖI CARD */}
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-gray-800 pb-4">
                      <div className="flex items-center gap-3">
                        <span className="text-xs bg-blue-900/60 text-blue-400 border border-blue-700/50 px-2.5 py-1 rounded-lg font-bold">
                          {acc.platform || 'MT5'}
                        </span>
                        <div>
                          <div className="text-xl font-mono font-bold text-white flex items-center gap-2">
                            {acc.account_number}
                            <span className="text-xs font-normal text-gray-400 font-sans">(Pass: {acc.account_pass})</span>
                          </div>
                          <div className="text-xs text-gray-400 mt-0.5">
                            Sàn: <span className="text-white">{acc.server_broker || 'N/A'}</span> | Khách: <span className="text-blue-400">{acc.user_email}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
                        <span className="text-xs bg-gray-950 border border-gray-800 px-3 py-1.5 rounded-xl text-purple-400 font-semibold">
                          Bot: {acc.bot_name || acc.custom_notes || 'Standard EA'}
                        </span>
                        <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-xl border ${
                          acc.bot_status === 'Running' ? 'bg-green-950/60 text-green-400 border-green-800' : 'bg-yellow-950/60 text-yellow-400 border-yellow-800'
                        }`}>
                          <span className={`w-2 h-2 rounded-full ${acc.bot_status === 'Running' ? 'bg-green-400 animate-pulse' : 'bg-yellow-400'}`}></span>
                          {acc.bot_status || 'Pending'}
                        </span>
                        <button
                          onClick={() => handleDelete(acc.id)}
                          className="bg-red-600/80 hover:bg-red-600 text-white px-3 py-1.5 rounded-xl text-xs font-semibold transition"
                          title="Xóa tài khoản"
                        >
                          Xóa
                        </button>
                      </div>
                    </div>

                    {/* 12 Ô CHỈ SỐ THÔNG TIN */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 text-sm">
                      <div className="bg-gray-950 border border-gray-800/80 p-4 rounded-xl">
                        <div className="text-xs text-gray-400">1. Vốn ban đầu</div>
                        <div className="font-mono font-bold text-white mt-1 text-base">${initVal.toLocaleString()}</div>
                      </div>

                      <div className="bg-gray-950 border border-gray-800/80 p-4 rounded-xl">
                        <div className="text-xs text-gray-400">2. Balance (Số dư)</div>
                        <div className="font-mono font-bold text-white mt-1 text-base">${balanceVal.toLocaleString()}</div>
                      </div>

                      <div className="bg-gray-950 border border-gray-800/80 p-4 rounded-xl">
                        <div className="text-xs text-gray-400">3. Equity hiện tại</div>
                        <div className="font-mono font-bold text-blue-400 mt-1 text-base">${equityVal.toLocaleString()}</div>
                      </div>

                      <div className="bg-gray-950 border border-gray-800/80 p-4 rounded-xl">
                        <div className="text-xs text-gray-400">4. Drawdown (Sụt giảm)</div>
                        <div className="font-mono font-bold text-red-400 mt-1 text-base">{drawdown}</div>
                      </div>

                      <div className="bg-gray-950 border border-gray-800/80 p-4 rounded-xl">
                        <div className="text-xs text-gray-400">5. P/L Hôm nay</div>
                        <div className={`font-mono font-bold mt-1 text-base ${profitDay >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                          {profitDay >= 0 ? '+' : ''}${profitDay.toLocaleString()}
                        </div>
                      </div>

                      <div className="bg-gray-950 border border-gray-800/80 p-4 rounded-xl">
                        <div className="text-xs text-gray-400">6. P/L Tuần này</div>
                        <div className={`font-mono font-bold mt-1 text-base ${profitWeek >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                          {profitWeek >= 0 ? '+' : ''}${profitWeek.toLocaleString()}
                        </div>
                      </div>

                      <div className="bg-gray-950 border border-gray-800/80 p-4 rounded-xl">
                        <div className="text-xs text-gray-400">7. P/L Tháng này</div>
                        <div className={`font-mono font-bold mt-1 text-base ${profitMonth >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                          {profitMonth >= 0 ? '+' : ''}${profitMonth.toLocaleString()}
                        </div>
                      </div>

                      <div className="bg-gray-950 border border-gray-800/80 p-4 rounded-xl">
                        <div className="text-xs text-gray-400">8. P/L Tổng lợi nhuận</div>
                        <div className={`font-mono font-bold mt-1 text-base ${profitVal >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                          {profitVal >= 0 ? '+' : ''}${profitVal.toLocaleString()} ({profitPercent.toFixed(2)}%)
                        </div>
                      </div>

                      <div className="bg-gray-950 border border-gray-800/80 p-4 rounded-xl">
                        <div className="text-xs text-gray-400">9. Tổng lệnh đã thực hiện</div>
                        <div className="font-mono font-bold text-white mt-1 text-base">{totalTrades} lệnh</div>
                      </div>

                      <div className="bg-gray-950 border border-gray-800/80 p-4 rounded-xl">
                        <div className="text-xs text-gray-400">10. Số lệnh Buy / Sell</div>
                        <div className="font-mono font-bold mt-1 text-sm flex gap-2">
                          <span className="text-blue-400">Buy: {buyTrades}</span>
                          <span className="text-gray-500">/</span>
                          <span className="text-red-400">Sell: {sellTrades}</span>
                        </div>
                      </div>

                      <div className="bg-gray-950 border border-gray-800/80 p-4 rounded-xl">
                        <div className="text-xs text-gray-400">11. Tổng Lot thực hiện</div>
                        <div className="font-mono font-bold text-yellow-400 mt-1 text-base">{totalLots.toFixed(2)} Lot</div>
                      </div>

                      <div className="bg-gray-950 border border-gray-800/80 p-4 rounded-xl">
                        <div className="text-xs text-gray-400">12. Số lệnh đang mở</div>
                        <div className="font-mono font-bold text-purple-400 mt-1 text-base">{openOrders} lệnh</div>
                      </div>
                    </div>

                  </div>
                );
              })}
            </div>
          )}

          {/* PHÂN TRANG */}
          {totalPages > 1 && (
            <div className="flex justify-between items-center pt-4 bg-gray-900 border border-gray-800 rounded-2xl p-4 shadow-xl">
              <span className="text-xs text-gray-400">Trang {currentPage} / {totalPages}</span>
              <div className="space-x-2">
                <button
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 bg-gray-950 border border-gray-800 rounded-xl text-xs font-semibold hover:bg-gray-800 disabled:opacity-50 transition"
                >
                  Trang trước
                </button>
                <button
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 bg-gray-950 border border-gray-800 rounded-xl text-xs font-semibold hover:bg-gray-800 disabled:opacity-50 transition"
                >
                  Trang sau
                </button>
              </div>
            </div>
          )}
        </div>

      </div>
    </main>
  );
}
