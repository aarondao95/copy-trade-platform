'use client';

import { createClient } from '@supabase/supabase-js';
import { useState } from 'react';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

export default function ClientDashboard() {
  const [accounts, setAccounts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Quản lý trạng thái màn hình: Đã đăng nhập hay chưa?
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [emailInput, setEmailInput] = useState(''); // Email người dùng nhập vào
  const [clientEmail, setClientEmail] = useState(''); // Email đang được hiển thị dữ liệu

  // 1. Hàm xử lý Đăng nhập & Tải dữ liệu riêng của email đó
  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (!emailInput.trim()) {
      alert('Vui lòng nhập email để tra cứu!');
      return;
    }

    setLoading(true);
    setErrorMessage('');

    // CHỈ lấy các tài khoản khớp với email khách nhập
    const { data, error } = await supabase
      .from('trading_accounts')
      .select('*')
      .eq('user_email', emailInput.trim())
      .order('id', { ascending: false });

    if (error) {
      setErrorMessage(error.message);
      setLoading(false);
      return;
    }

    if (data && data.length > 0) {
      setAccounts(data);
      setClientEmail(emailInput.trim());
      setIsLoggedIn(true);
    } else {
      setErrorMessage(`Không tìm thấy tài khoản giao dịch nào gắn với email: ${emailInput}`);
    }
    
    setLoading(false);
  }

  // 2. Hàm xử lý Thoát (Đăng xuất)
  function handleLogout(e: React.MouseEvent) {
    e.preventDefault();
    setIsLoggedIn(false);
    setClientEmail('');
    setEmailInput('');
    setAccounts([]);
    setErrorMessage('');
  }

  // ==========================================
  // NẾU CHƯA ĐĂNG NHẬP -> CHỈ HIỆN FORM LOGIN
  // ==========================================
  if (!isLoggedIn) {
    return (
      <main className="min-h-screen bg-gray-950 flex flex-col items-center justify-center p-6">
        <div className="max-w-md w-full bg-gray-900 border border-gray-800 rounded-3xl p-8 shadow-2xl space-y-6">
          <div className="text-center space-y-2">
            <h1 className="text-2xl font-bold text-white">🔐 Investor Dashboard</h1>
            <p className="text-sm text-gray-400">Nhập email của bạn để xem báo cáo hiệu suất giao dịch và các thông số Bot</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5 mt-8">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Email tài khoản</label>
              <input
                type="email"
                placeholder="Ví dụ: khachhang@gmail.com"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                className="w-full bg-gray-950 border border-gray-800 rounded-xl p-3.5 text-sm text-white outline-none focus:border-blue-500 font-mono transition"
                required
              />
            </div>

            {errorMessage && (
              <div className="bg-red-950/50 border border-red-800 text-red-400 px-4 py-3 rounded-xl text-sm text-center">
                {errorMessage}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl transition shadow-lg shadow-blue-600/30 disabled:bg-gray-700 disabled:shadow-none"
            >
              {loading ? 'Đang tải dữ liệu...' : 'Xem Báo Cáo Hiệu Suất'}
            </button>
          </form>
        </div>
      </main>
    );
  }

  // ==========================================
  // NẾU ĐÃ ĐĂNG NHẬP -> HIỆN DASHBOARD CỦA KHÁCH
  // ==========================================
  
  // Tính toán Thống kê Tổng quan (Chỉ tính trên các account của khách này)
  const totalAccountsCount = accounts.length;
  const runningAccountsCount = accounts.filter(acc => acc.bot_status === 'Running').length;
  const pendingAccountsCount = accounts.filter(acc => acc.bot_status === 'Pending' || !acc.bot_status).length;
  
  const totalCapital = accounts.reduce((sum, acc) => sum + Number(acc.initial_balance || acc.balance || 0), 0);
  const currentTotalBalance = accounts.reduce((sum, acc) => sum + Number(acc.balance || 0), 0);
  const totalSystemProfit = currentTotalBalance - totalCapital;

  return (
    <main className="min-h-screen bg-gray-950 text-gray-100 p-6 md:p-10">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* HEADER DASHBOARD */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 flex flex-col md:flex-row justify-between items-center gap-4 shadow-xl">
          <div>
            <h1 className="text-2xl font-bold text-white">Báo cáo Hiệu suất Giao dịch</h1>
            <p className="text-sm text-gray-400 mt-1">Cập nhật Real-time từ hệ thống máy chủ VPS</p>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="text-sm bg-blue-900/40 text-blue-400 border border-blue-700/50 px-4 py-2.5 rounded-xl">
              Khách hàng: <span className="font-semibold text-white">{clientEmail}</span>
            </div>
            <button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition shadow-lg shadow-red-600/20"
              title="Thoát tài khoản"
            >
              🚪 Thoát
            </button>
          </div>
        </div>

        {/* 1. THỐNG KÊ TỔNG QUAN (CỦA RIÊNG KHÁCH HÀNG NÀY) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 shadow-lg">
            <div className="text-sm text-gray-400 font-medium">Tổng số tài khoản của bạn</div>
            <div className="text-3xl font-bold font-mono text-white mt-2 flex items-center gap-2">
              {totalAccountsCount} <span className="text-sm text-gray-500 font-normal">tài khoản</span>
            </div>
            <div className="text-xs text-gray-500 mt-2 flex gap-3">
              <span className="text-green-400">● {runningAccountsCount} Running</span>
              <span className="text-yellow-400">● {pendingAccountsCount} Pending</span>
            </div>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 shadow-lg">
            <div className="text-sm text-gray-400 font-medium">Tổng Vốn Đầu Tư</div>
            <div className="text-3xl font-bold font-mono text-white mt-2">
              ${totalCapital.toLocaleString()}
            </div>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 shadow-lg">
            <div className="text-sm text-gray-400 font-medium">Tổng Balance Hiện Tại</div>
            <div className="text-3xl font-bold font-mono text-blue-400 mt-2">
              ${currentTotalBalance.toLocaleString()}
            </div>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 shadow-lg">
            <div className="text-sm text-gray-400 font-medium">Tổng Lợi Nhuận Gộp</div>
            <div className={`text-3xl font-bold font-mono mt-2 ${totalSystemProfit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {totalSystemProfit >= 0 ? '+' : ''}${totalSystemProfit.toLocaleString()}
            </div>
            <div className="text-xs text-gray-500 mt-2">Tính trên toàn bộ các tài khoản đang chạy</div>
          </div>
        </div>

        {/* 2. THỐNG KÊ CHI TIẾT TỪNG ACC (12 TRƯỜNG) */}
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-white pl-2 border-l-4 border-blue-500">Chi tiết Từng Tài Khoản</h2>
          
          <div className="space-y-6">
            {accounts.map((acc: any) => {
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
                <div key={acc.id} className="bg-gray-900 border border-gray-800 rounded-2xl p-6 shadow-xl space-y-5 hover:border-gray-700 transition">
                  
                  {/* HÀNG ĐẦU MỖI CARD */}
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-gray-800 pb-4">
                    <div className="flex items-center gap-3">
                      <span className="text-xs bg-blue-900/60 text-blue-400 border border-blue-700/50 px-3 py-1.5 rounded-lg font-bold">
                        {acc.platform || 'MT5'}
                      </span>
                      <div>
                        <div className="text-2xl font-mono font-bold text-white flex items-center gap-2">
                          {acc.account_number}
                        </div>
                        <div className="text-sm text-gray-400 mt-1">
                          Sàn giao dịch: <span className="text-white font-medium">{acc.server_broker || 'N/A'}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
                      <span className="text-sm bg-gray-950 border border-gray-800 px-4 py-2 rounded-xl text-purple-400 font-semibold">
                        Cấu hình: {acc.bot_name || acc.custom_notes || 'Standard Setup'}
                      </span>
                      <span className={`inline-flex items-center gap-2 text-sm font-bold px-4 py-2 rounded-xl border ${
                        acc.bot_status === 'Running' ? 'bg-green-950/60 text-green-400 border-green-800' : 'bg-yellow-950/60 text-yellow-400 border-yellow-800'
                      }`}>
                        <span className={`w-2.5 h-2.5 rounded-full ${acc.bot_status === 'Running' ? 'bg-green-400 animate-pulse' : 'bg-yellow-400'}`}></span>
                        {acc.bot_status || 'Pending'}
                      </span>
                    </div>
                  </div>

                  {/* 12 Ô CHỈ SỐ THÔNG TIN CHO KHÁCH */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 text-sm">
                    <div className="bg-gray-950 border border-gray-800/80 p-4 rounded-xl">
                      <div className="text-xs text-gray-400 mb-1">1. Vốn ban đầu</div>
                      <div className="font-mono font-bold text-white text-base">${initVal.toLocaleString()}</div>
                    </div>

                    <div className="bg-gray-950 border border-gray-800/80 p-4 rounded-xl">
                      <div className="text-xs text-gray-400 mb-1">2. Balance (Số dư)</div>
                      <div className="font-mono font-bold text-white text-base">${balanceVal.toLocaleString()}</div>
                    </div>

                    <div className="bg-gray-950 border border-gray-800/80 p-4 rounded-xl">
                      <div className="text-xs text-gray-400 mb-1">3. Equity hiện tại</div>
                      <div className="font-mono font-bold text-blue-400 text-base">${equityVal.toLocaleString()}</div>
                    </div>

                    <div className="bg-gray-950 border border-gray-800/80 p-4 rounded-xl">
                      <div className="text-xs text-gray-400 mb-1">4. Drawdown (Sụt giảm)</div>
                      <div className="font-mono font-bold text-red-400 text-base">{drawdown}</div>
                    </div>

                    <div className="bg-gray-950 border border-gray-800/80 p-4 rounded-xl">
                      <div className="text-xs text-gray-400 mb-1">5. Lợi nhuận Hôm nay</div>
                      <div className={`font-mono font-bold text-base ${profitDay >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {profitDay >= 0 ? '+' : ''}${profitDay.toLocaleString()}
                      </div>
                    </div>

                    <div className="bg-gray-950 border border-gray-800/80 p-4 rounded-xl">
                      <div className="text-xs text-gray-400 mb-1">6. Lợi nhuận Tuần này</div>
                      <div className={`font-mono font-bold text-base ${profitWeek >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {profitWeek >= 0 ? '+' : ''}${profitWeek.toLocaleString()}
                      </div>
                    </div>

                    <div className="bg-gray-950 border border-gray-800/80 p-4 rounded-xl">
                      <div className="text-xs text-gray-400 mb-1">7. Lợi nhuận Tháng này</div>
                      <div className={`font-mono font-bold text-base ${profitMonth >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {profitMonth >= 0 ? '+' : ''}${profitMonth.toLocaleString()}
                      </div>
                    </div>

                    <div className="bg-gray-950 border border-gray-800/80 p-4 rounded-xl">
                      <div className="text-xs text-gray-400 mb-1">8. TỔNG LỢI NHUẬN</div>
                      <div className={`font-mono font-bold text-base ${profitVal >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {profitVal >= 0 ? '+' : ''}${profitVal.toLocaleString()} ({profitPercent.toFixed(2)}%)
                      </div>
                    </div>

                    <div className="bg-gray-950 border border-gray-800/80 p-4 rounded-xl">
                      <div className="text-xs text-gray-400 mb-1">9. Tổng lệnh đã giao dịch</div>
                      <div className="font-mono font-bold text-white text-base">{totalTrades} lệnh</div>
                    </div>

                    <div className="bg-gray-950 border border-gray-800/80 p-4 rounded-xl">
                      <div className="text-xs text-gray-400 mb-1">10. Tỷ lệ lệnh Buy / Sell</div>
                      <div className="font-mono font-bold text-sm flex gap-2">
                        <span className="text-blue-400">Buy: {buyTrades}</span>
                        <span className="text-gray-500">|</span>
                        <span className="text-red-400">Sell: {sellTrades}</span>
                      </div>
                    </div>

                    <div className="bg-gray-950 border border-gray-800/80 p-4 rounded-xl">
                      <div className="text-xs text-gray-400 mb-1">11. Tổng khối lượng (Lot)</div>
                      <div className="font-mono font-bold text-yellow-400 text-base">{totalLots.toFixed(2)} Lot</div>
                    </div>

                    <div className="bg-gray-950 border border-gray-800/80 p-4 rounded-xl">
                      <div className="text-xs text-gray-400 mb-1">12. Số lệnh đang mở (Open)</div>
                      <div className="font-mono font-bold text-purple-400 text-base">{openOrders} lệnh</div>
                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        </div>

      </div>
    </main>
  );
}
