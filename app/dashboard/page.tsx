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

  // Các trường thông tin form thêm mới
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
  const rowsPerPage = 5;

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
    fetchAccounts();
  }, []);

  async function handleAddAccount(e: React.FormEvent) {
    e.preventDefault();
    if (!accountNumber || !accountPass || !userEmail || !serverBroker || !balance) {
      alert('Vui lòng điền đầy đủ tất cả thông tin!');
      return;
    }

    setSubmitting(true);
    const { error } = await supabase.from('trading_accounts').insert([
      {
        account_number: accountNumber,
        account_pass: accountPass,
        user_email: userEmail,
        server_broker: serverBroker,
        balance: parseFloat(balance),
        custom_notes: customNotes,
        bot_status: 'Pending', // Mặc định là chờ cài VPS
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

  // --- THỐNG KÊ TỔNG QUAN HỆ THỐNG ---
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

  // Lọc dữ liệu tìm kiếm
  const filteredAccounts = accounts.filter((acc) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      acc.account_number?.toLowerCase().includes(searchLower) ||
      acc.user_email?.toLowerCase().includes(searchLower) ||
      acc.server_broker?.toLowerCase().includes(searchLower) ||
      acc.custom_notes?.toLowerCase().includes(searchLower)
    );
  });

  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentAccounts = filteredAccounts.slice(indexOfFirstRow, indexOfLastRow);
  const totalPages = Math.ceil(filteredAccounts.length / rowsPerPage);

  return (
    <main className="min-h-screen bg-gray-950 text-gray-100 p-6 md:p-10">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* TIÊU ĐỀ */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 flex flex-col md:flex-row justify-between items-center gap-4 shadow-xl">
          <div>
            <h1 className="text-2xl font-bold text-white">⚙️ Trung tâm Quản trị Tổng thể Hệ thống Copy-Trade</h1>
            <p className="text-sm text-gray-400 mt-1">Giám sát VPS, trạng thái Bot và hiệu suất giao dịch toàn hệ thống</p>
          </div>
          <div className="flex gap-2">
            <a href="/portal" target="_blank" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-sm font-semibold transition">
              🔗 Mở Cổng Khách Hàng (Portal)
            </a>
          </div>
        </div>

        {/* 📊 BẢNG QUẢN LÝ TỔNG THỂ CHUNG (OVERVIEW STATS) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 shadow-lg">
            <div className="text-xs text-gray-400 font-medium">Tổng số ACC đang chạy</div>
            <div className="text-2xl font-bold font-mono text-green-400 mt-2 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse"></span>
              {runningAccountsCount} <span className="text-xs text-gray-500 font-normal">/ {totalAccountsCount} acc</span>
            </div>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 shadow-lg">
            <div className="text-xs text-gray-400 font-medium">Số ACC chờ chạy trên VPS</div>
            <div className="text-2xl font-bold font-mono text-yellow-400 mt-2 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-yellow-500"></span>
              {pendingAccountsCount} <span className="text-xs text-gray-500 font-normal">acc</span>
            </div>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 shadow-lg">
            <div className="text-xs text-gray-400 font-medium">Tổng vốn ACC đang chạy</div>
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
          <h2 className="text-lg font-bold text-white border-b border-gray-800 pb-3">➕ Thêm tài khoản thủ công lên hệ thống</h2>
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
              <label className="block text-xs font-medium text-gray-400 mb-1">Server broker (Sàn)</label>
              <input
                type="text"
                placeholder="Ví dụ: Exness-Real15"
                value={serverBroker}
                onChange={(e) => setServerBroker(e.target.value)}
                className="w-full bg-gray-950 border border-gray-800 rounded-xl p-2.5 text-sm text-white outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1">Vốn / Số dư ban đầu ($)</label>
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

        {/* DANH SÁCH CHI TIẾT TỪNG TÀI KHOẢN & HIỆU SUẤT */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 border-b border-gray-800 pb-4">
            <h2 className="text-lg font-bold text-white">📋 Danh sách chi tiết tài khoản & Hiệu suất thực tế</h2>
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

          <div className="border border-gray-800 rounded-xl overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead className="bg-gray-950 text-gray-400 border-b border-gray-800">
                <tr>
                  <th className="p-3.5">Tài khoản (ID)</th>
                  <th className="p-3.5">Pass</th>
                  <th className="p-3.5">Email / Sàn</th>
                  <th className="p-3.5">Yêu cầu setup</th>
                  <th className="p-3.5 text-center">Trạng thái Bot</th>
                  <th className="p-3.5 text-right">Lệnh (Buy / Sell / Tổng)</th>
                  <th className="p-3.5 text-right">Tổng Lot</th>
                  <th className="p-3.5 text-right">Số dư / Lợi nhuận</th>
                  <th className="p-3.5 text-center">Hành động</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800 text-gray-300">
                {loading ? (
                  <tr>
                    <td colSpan={9} className="p-8 text-center text-gray-500">Đang tải dữ liệu hệ thống...</td>
                  </tr>
                ) : currentAccounts.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="p-8 text-center text-gray-500">Chưa có dữ liệu tài khoản nào trong hệ thống.</td>
                  </tr>
                ) : (
                  currentAccounts.map((acc: any) => {
                    const balanceVal = Number(acc.balance || 0);
                    const initVal = Number(acc.initial_balance || balanceVal);
                    const profitVal = balanceVal - initVal;

                    // Các thông số lệnh mới từ EA đẩy lên (nếu có)
                    const totalTrades = acc.total_trades || 0;
                    const buyTrades = acc.buy_trades || 0;
                    const sellTrades = acc.sell_trades || 0;
                    const totalLots = acc.total_lots || 0;

                    return (
                      <tr key={acc.id} className="hover:bg-gray-950/60 transition">
                        <td className="p-3.5 font-mono font-bold text-blue-400">{acc.account_number}</td>
                        <td className="p-3.5 font-mono text-gray-400">{acc.account_pass}</td>
                        <td className="p-3.5">
                          <div className="text-white">{acc.user_email}</div>
                          <div className="text-xs text-gray-500">{acc.server_broker}</div>
                        </td>
                        <td className="p-3.5 font-medium text-purple-400 max-w-xs truncate">
                          {acc.custom_notes ? acc.custom_notes : <span className="text-gray-600">—</span>}
                        </td>
                        <td className="p-3.5 text-center">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold border ${
                            acc.bot_status === 'Running' ? 'bg-green-950/60 text-green-400 border-green-800' :
                            acc.bot_status === 'Stopped' ? 'bg-yellow-950/60 text-yellow-400 border-yellow-800' :
                            'bg-blue-950/60 text-blue-400 border-blue-800'
                          }`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${acc.bot_status === 'Running' ? 'bg-green-400 animate-pulse' : 'bg-blue-400'}`}></span>
                            {acc.bot_status || 'Pending'}
                          </span>
                        </td>
                        <td className="p-3.5 text-right font-mono text-xs">
                          <span className="text-blue-400">B: {buyTrades}</span> / <span className="text-red-400">S: {sellTrades}</span> <br/>
                          <span className="text-gray-400 font-bold">Tổng: {totalTrades}</span>
                        </td>
                        <td className="p-3.5 text-right font-mono font-bold text-yellow-400">
                          {Number(totalLots).toFixed(2)} Lot
                        </td>
                        <td className="p-3.5 text-right font-mono">
                          <div className="font-bold text-white">${balanceVal.toLocaleString()}</div>
                          <div className={`text-xs ${profitVal >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                            {profitVal >= 0 ? '+' : ''}${profitVal.toLocaleString()}
                          </div>
                        </td>
                        <td className="p-3.5 text-center">
                          <button
                            onClick={() => handleDelete(acc.id)}
                            className="bg-red-600/80 hover:bg-red-600 text-white px-3 py-1 rounded-lg text-xs transition font-semibold"
                          >
                            Xóa
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* PHÂN TRANG */}
          {totalPages > 1 && (
            <div className="flex justify-between items-center pt-2">
              <span className="text-xs text-gray-400">Trang {currentPage} / {totalPages}</span>
              <div className="space-x-1">
                <button
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1 bg-gray-950 border border-gray-800 rounded-lg text-xs hover:bg-gray-800 disabled:opacity-50"
                >
                  Trang trước
                </button>
                <button
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 bg-gray-950 border border-gray-800 rounded-lg text-xs hover:bg-gray-800 disabled:opacity-50"
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
