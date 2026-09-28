'use client';

import { createClient } from '@supabase/supabase-js';
import { useEffect, useState } from 'react';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

export default function ClientDashboard() {
  const [emailInput, setEmailInput] = useState('');
  const [clientData, setClientData] = useState<any[]>([]);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);

  // Hàm lấy dữ liệu từ Supabase theo Email của khách
  async function fetchClientData(email: string) {
    if (!email) return;
    const { data, error } = await supabase
      .from('trading_accounts')
      .select('*')
      .ilike('user_email', email.trim());

    if (!error && data) {
      setClientData(data);
    }
  }

  // Khi khách bấm xem Dashboard
  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (!emailInput) {
      alert('Vui lòng nhập Email của bạn!');
      return;
    }

    setLoading(true);
    await fetchClientData(emailInput);
    setSearched(true);
    setLoading(false);
  }

  // TÍNH NĂNG REAL-TIME: Tự động gọi lại dữ liệu ngầm mỗi 5 giây một lần khi khách đã đăng nhập
  useEffect(() => {
    if (!searched || !emailInput) return;

    const interval = setInterval(() => {
      fetchClientData(emailInput);
    }, 5000); // Cứ 5 giây đồng bộ số liệu mới từ DB lên màn hình một lần

    return () => clearInterval(interval);
  }, [searched, emailInput]);

  return (
    <main className="min-h-screen bg-gray-900 text-gray-100 p-6 md:p-10">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-center bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-700 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white">Investor Dashboard - Theo dõi Hiệu suất</h1>
            <p className="text-sm text-gray-400 mt-1">Hệ thống đồng bộ dữ liệu Real-time từ VPS & MetaTrader</p>
          </div>

          {/* Form đăng nhập nhanh bằng Email */}
          <form onSubmit={handleLogin} className="flex gap-2 w-full md:w-auto">
            <input
              type="email"
              placeholder="Nhập email của bạn..."
              value={emailInput}
              onChange={(e) => setEmailInput(e.target.value)}
              className="bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-blue-500 w-full md:w-64"
            />
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg text-sm font-semibold transition whitespace-nowrap"
            >
              {loading ? 'Đang tải...' : 'Xem Dashboard'}
            </button>
          </form>
        </div>

        {/* NẾU CHƯA TÌM KIẾM HOẶC KHÔNG CÓ DỮ LIỆU */}
        {!searched ? (
          <div className="bg-gray-800 border border-gray-700 rounded-2xl p-12 text-center text-gray-400">
            <p className="text-lg">Vui lòng nhập Email đăng ký tài khoản ở góc trên để xem thông tin chi tiết.</p>
          </div>
        ) : clientData.length === 0 ? (
          <div className="bg-gray-800 border border-gray-700 rounded-2xl p-12 text-center text-gray-400">
            <p className="text-lg text-red-400">Không tìm thấy tài khoản nào gắn với email: <span className="font-semibold text-white">{emailInput}</span></p>
          </div>
        ) : (
          /* DANH SÁCH CÁC TÀI KHOẢN CỦA KHÁCH HÀNG */
          <div className="space-y-8">
            {clientData.map((acc: any) => {
              const initial = Number(acc.initial_balance || acc.balance || 0);
              const currentBalance = Number(acc.balance || 0);
              const totalProfit = currentBalance - initial;
              const totalProfitPercent = initial > 0 ? (totalProfit / initial) * 100 : 0;

              return (
                <div key={acc.id} className="bg-gray-800 border border-gray-700 rounded-2xl p-6 shadow-xl space-y-6">
                  
                  {/* THÔNG TIN TÀI KHOẢN & TRẠNG THÁI BOT */}
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-gray-700 pb-4 gap-4">
                    <div>
                      <div className="text-xs text-gray-400 uppercase tracking-wider">Tài khoản giao dịch</div>
                      <div className="text-2xl font-mono font-bold text-blue-400 flex items-center gap-3 mt-1">
                        <span className="bg-blue-950 border border-blue-800 text-xs px-2 py-0.5 rounded text-blue-300">
                          {acc.platform || 'MT5'}
                        </span>
                        {acc.account_number}
                        <span className="text-xs bg-gray-700 text-gray-300 px-2.5 py-1 rounded-md font-sans">
                          Sàn: {acc.broker || 'N/A'} ({acc.server_broker || 'N/A'})
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                      {/* Bot đang sử dụng */}
                      <div className="bg-gray-900 border border-gray-700 px-3 py-1.5 rounded-lg text-sm">
                        <span className="text-gray-400 text-xs block">Bot sử dụng:</span>
                        <span className="font-semibold text-purple-400">{acc.bot_name || 'Standard EA'}</span>
                      </div>

                      {/* Trạng thái Bot */}
                      <div className="bg-gray-900 border border-gray-700 px-4 py-1.5 rounded-lg text-sm flex items-center gap-2">
                        <span className="text-gray-400 text-xs">Trạng thái:</span>
                        <span className={`inline-flex items-center gap-1.5 font-bold ${
                          acc.bot_status === 'Running' ? 'text-green-400' :
                          acc.bot_status === 'Stopped' ? 'text-yellow-400' : 'text-red-400'
                        }`}>
                          <span className={`w-2.5 h-2.5 rounded-full animate-pulse ${
                            acc.bot_status === 'Running' ? 'bg-green-500' :
                            acc.bot_status === 'Stopped' ? 'bg-yellow-500' : 'bg-red-500'
                          }`}></span>
                          {acc.bot_status || 'Running'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* CÁC CHỈ SỐ TÀI CHÍNH (GRID CARDS) */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    
                    {/* Vốn ban đầu */}
                    <div className="bg-gray-900/60 border border-gray-700/60 p-4 rounded-xl">
                      <div className="text-xs text-gray-400">Vốn ban đầu</div>
                      <div className="text-xl font-bold font-mono text-gray-200 mt-1">
                        ${Number(acc.initial_balance || acc.balance || 0).toLocaleString()}
                      </div>
                    </div>

                    {/* Balance */}
                    <div className="bg-gray-900/60 border border-gray-700/60 p-4 rounded-xl">
                      <div className="text-xs text-gray-400">Balance (Số dư)</div>
                      <div className="text-xl font-bold font-mono text-white mt-1">
                        ${Number(acc.balance || 0).toLocaleString()}
                      </div>
                    </div>

                    {/* Equity */}
                    <div className="bg-gray-900/60 border border-gray-700/60 p-4 rounded-xl">
                      <div className="text-xs text-gray-400">Equity hiện tại</div>
                      <div className="text-xl font-bold font-mono text-blue-400 mt-1">
                        ${Number(acc.equity || acc.balance || 0).toLocaleString()}
                      </div>
                    </div>

                    {/* Drawdown */}
                    <div className="bg-gray-900/60 border border-gray-700/60 p-4 rounded-xl">
                      <div className="text-xs text-gray-400">Drawdown (Sụt giảm)</div>
                      <div className="text-xl font-bold font-mono text-red-400 mt-1">
                        {acc.drawdown ? `${acc.drawdown}%` : '0.00%'}
                      </div>
                    </div>

                  </div>

                  {/* LÃI LỖ (P/L) & SỐ LỆNH */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    
                    {/* P/L hôm nay */}
                    <div className="bg-gray-900/40 border border-gray-700/40 p-4 rounded-xl">
                      <div className="text-xs text-gray-400">P/L Hôm nay</div>
                      <div className={`text-lg font-bold font-mono mt-1 ${Number(acc.profit_today || 0) >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {Number(acc.profit_today || 0) >= 0 ? '+' : ''}${Number(acc.profit_today || 0).toLocaleString()}
                      </div>
                    </div>

                    {/* P/L tháng */}
                    <div className="bg-gray-900/40 border border-gray-700/40 p-4 rounded-xl">
                      <div className="text-xs text-gray-400">P/L Tháng này</div>
                      <div className={`text-lg font-bold font-mono mt-1 ${Number(acc.profit_month || 0) >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {Number(acc.profit_month || 0) >= 0 ? '+' : ''}${Number(acc.profit_month || 0).toLocaleString()}
                      </div>
                    </div>

                    {/* P/L tổng */}
                    <div className="bg-gray-900/40 border border-gray-700/40 p-4 rounded-xl">
                      <div className="text-xs text-gray-400">P/L Tổng lợi nhuận</div>
                      <div className={`text-lg font-bold font-mono mt-1 ${totalProfit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {totalProfit >= 0 ? '+' : ''}${totalProfit.toLocaleString()} ({totalProfitPercent.toFixed(2)}%)
                      </div>
                    </div>

                    {/* Số lệnh */}
                    <div className="bg-gray-900/40 border border-gray-700/40 p-4 rounded-xl">
                      <div className="text-xs text-gray-400">Tổng số lệnh đang mở</div>
                      <div className="text-lg font-bold font-mono text-yellow-400 mt-1">
                        {acc.total_orders || 0} lệnh
                      </div>
                    </div>

                  </div>

                </div>
              );
            })}
          </div>
        )}

      </div>
    </main>
  );
}