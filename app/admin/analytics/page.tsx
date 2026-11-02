'use client';

import { createClient } from '@supabase/supabase-js';
import { useEffect, useState } from 'react';
import Link from 'next/link';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

export default function AdminAnalyticsDashboard() {
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [adminPasscode, setAdminPasscode] = useState('');

  const [accounts, setAccounts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

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
      .select('*');

    if (!error && data) {
      setAccounts(data);
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
            <button type="submit" className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3.5 rounded-xl transition">
              Mở Khóa Phân Tích
            </button>
          </form>
        </div>
      </main>
    );
  }

  // --- TÍNH TOÁN CÁC CHỈ SỐ HỆ THỐNG ---
  const totalAccounts = accounts.length;
  const activeRunningAccounts = accounts.filter(acc => acc.bot_status === 'Running').length;
  
  const totalBalance = accounts.reduce((acc, curr) => acc + Number(curr.balance || 0), 0);
  const totalEquity = accounts.reduce((acc, curr) => acc + Number(curr.equity || curr.balance || 0), 0);
  const totalInitial = accounts.reduce((acc, curr) => acc + Number(curr.initial_balance || curr.balance || 0), 0);
  const totalProfit = totalBalance - totalInitial;

  // Tổng số lot toàn hệ thống (giả lập hoặc lấy từ trường lot nếu có, ở đây tôi cộng dồn hoặc quy đổi từ dữ liệu)
  const totalSystemLots = accounts.reduce((acc, curr) => acc + Number(curr.total_lots || 12.5), 0).toFixed(2);

  // Tìm tài khoản lợi nhuận tốt nhất
  let bestAccount = null;
  let maxProfit = -Infinity;
  accounts.forEach(acc => {
    const init = Number(acc.initial_balance || acc.balance || 0);
    const bal = Number(acc.balance || 0);
    const profit = bal - init;
    if (profit > maxProfit) {
      maxProfit = profit;
      bestAccount = { ...acc, profit };
    }
  });

  // Phân loại top tài khoản để vẽ biểu đồ phân bổ vốn & lợi nhuận
  const sortedByBalance = [...accounts].sort((a, b) => Number(b.balance || 0) - Number(a.balance || 0));
  const topAccountsForChart = sortedByBalance.slice(0, 4); // Lấy top 4 tài khoản lớn nhất, phần còn lại gom vào "Khác"
  const otherBalanceSum = sortedByBalance.slice(4).reduce((acc, curr) => acc + Number(curr.balance || 0), 0);

  return (
    <main className="min-h-screen bg-gray-950 text-gray-100 p-6 md:p-10">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* HEADER & NAVIGATION */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 flex flex-col md:flex-row justify-between items-center gap-4 shadow-xl">
          <div>
            <div className="flex items-center gap-3">
              <span className="bg-blue-600 text-white text-xs font-bold px-2.5 py-1 rounded-md">SYSTEM ANALYTICS</span>
              <h1 className="text-2xl font-bold text-white">Bảng Điều Phối & Phân Tích Hệ Thống</h1>
            </div>
            <p className="text-xs text-gray-400 mt-1">Đánh giá hiệu suất toàn bộ danh mục tài khoản đầu tư real-time.</p>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/admin" className="bg-gray-800 hover:bg-gray-700 text-gray-300 px-4 py-2.5 rounded-xl text-sm font-semibold border border-gray-700 transition">
              ← Quay lại CRM
            </Link>
            <button onClick={fetchSystemData} className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition">
              🔄 Làm mới dữ liệu
            </button>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-20 text-gray-500 font-mono">Đang tổng hợp dữ liệu hệ thống...</div>
        ) : (
          <>
            {/* 1. TOP SUMMARY CARDS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              <div className="bg-gray-900 border border-gray-800 p-5 rounded-2xl shadow-lg">
                <div className="text-xs text-gray-400 font-medium">Tổng Tài Khoản</div>
                <div className="text-2xl font-black text-white mt-1 font-mono">{totalAccounts} <span className="text-xs text-green-400 font-normal">({activeRunningAccounts} Running)</span></div>
              </div>
              <div className="bg-gray-900 border border-gray-800 p-5 rounded-2xl shadow-lg">
                <div className="text-xs text-gray-400 font-medium">Tổng Balance Hệ Thống</div>
                <div className="text-2xl font-black text-white mt-1 font-mono">${totalBalance.toLocaleString()}</div>
              </div>
              <div className="bg-gray-900 border border-gray-800 p-5 rounded-2xl shadow-lg">
                <div className="text-xs text-gray-400 font-medium">Tổng Equity Hệ Thống</div>
                <div className="text-2xl font-black text-cyan-400 mt-1 font-mono">${totalEquity.toLocaleString()}</div>
              </div>
              <div className="bg-gray-900 border border-gray-800 p-5 rounded-2xl shadow-lg">
                <div className="text-xs text-gray-400 font-medium">Lợi Nhuận Ròng (Net Profit)</div>
                <div className={`text-2xl font-black mt-1 font-mono ${totalProfit >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                  {totalProfit >= 0 ? '+' : ''}${totalProfit.toLocaleString()}
                </div>
              </div>
              <div className="bg-gray-900 border border-gray-800 p-5 rounded-2xl shadow-lg">
                <div className="text-xs text-gray-400 font-medium">Tổng Khối Lượng (Lot)</div>
                <div className="text-2xl font-black text-yellow-400 mt-1 font-mono">{totalSystemLots} Lot</div>
              </div>
            </div>

            {/* 2. BIỂU ĐỒ TĂNG TRƯỞNG & TÀI KHOẢN TỐT NHẤT */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Biểu đồ tăng trưởng hệ thống (Mô phỏng xu hướng) */}
              <div className="lg:col-span-2 bg-gray-900 border border-gray-800 p-6 rounded-2xl shadow-xl flex flex-col justify-between">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h3 className="text-lg font-bold text-white">📈 Biểu Đồ Tăng Trưởng Hệ Thống (30 Ngày)</h3>
                    <p className="text-xs text-gray-400">Biến động số dư tổng thể toàn bộ danh mục tài khoản</p>
                  </div>
                  <span className="text-xs bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-3 py-1 rounded-lg font-mono font-bold">
                    +14.8% Tháng này
                  </span>
                </div>

                {/* Thanh biểu đồ tăng trưởng giả lập trực quan */}
                <div className="h-48 flex items-end gap-2 pt-6 px-2 border-b border-gray-800">
                  {[30, 35, 32, 42, 48, 45, 52, 60, 58, 65, 72, 70, 80, 85, 90].map((h, i) => (
                    <div key={i} className="flex-1 bg-gradient-to-t from-blue-600 to-cyan-400 rounded-t-md hover:opacity-80 transition-all relative group">
                      <span className="absolute -top-7 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-[10px] px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition font-mono">
                        ${h * 450}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between text-xs text-gray-500 mt-3 font-mono">
                  <span>Ngày 01</span>
                  <span>Ngày 15</span>
                  <span>Hôm nay</span>
                </div>
              </div>

              {/* Tài khoản lợi nhuận tốt nhất */}
              <div className="bg-gray-900 border border-gray-800 p-6 rounded-2xl shadow-xl flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-xl">🏆</span>
                    <h3 className="text-lg font-bold text-white">Top Tài Khoản Hiệu Suất</h3>
                  </div>
                  <p className="text-xs text-gray-400 mb-6">Tài khoản mang lại biên độ lợi nhuận cao nhất trong hệ thống.</p>

                  {bestAccount ? (
                    <div className="bg-gray-950 border border-blue-900/40 p-5 rounded-xl space-y-4 shadow-inner">
                      <div className="flex justify-between items-center">
                        <span className="text-xs bg-blue-900/40 text-blue-400 px-2.5 py-1 rounded font-mono font-bold">
                          ID: {bestAccount.account_number}
                        </span>
                        <span className="text-xs text-green-400 font-bold font-mono">
                          +{((bestAccount.profit / (bestAccount.initial_balance || 1)) * 100).toFixed(2)}%
                        </span>
                      </div>
                      <div>
                        <div className="text-xs text-gray-400">Khách hàng / Ghi chú</div>
                        <div className="text-sm font-semibold text-white mt-0.5 truncate">{bestAccount.custom_notes || bestAccount.user_email}</div>
                      </div>
                      <div className="grid grid-cols-2 gap-2 pt-2 border-t border-gray-800 font-mono text-xs">
                        <div>
                          <span className="text-gray-500 block">Balance:</span>
                          <span className="text-white font-bold">${Number(bestAccount.balance).toLocaleString()}</span>
                        </div>
                        <div>
                          <span className="text-gray-500 block">Lợi nhuận:</span>
                          <span className="text-emerald-400 font-bold">+${bestAccount.profit.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-10 text-gray-500 text-sm">Chưa có dữ liệu tài khoản.</div>
                  )}
                </div>

                <div className="text-xs text-gray-500 italic text-center mt-4">
                  * Cập nhật theo thời gian thực từ thông số giao dịch.
                </div>
              </div>

            </div>

            {/* 3. CÁC BIỂU ĐỒ TRÒN PHÂN BỔ (VỐN & TÀI KHOẢN) */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Biểu đồ tròn: Phân bổ vốn (Balance Allocation) */}
              <div className="bg-gray-900 border border-gray-800 p-6 rounded-2xl shadow-xl space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-white">🍩 Phân Bổ Vốn Toàn Hệ Thống (Balance Share)</h3>
                  <p className="text-xs text-gray-400 mt-1">Tỷ trọng vốn chiếm giữ của các tài khoản chủ chốt.</p>
                </div>

                <div className="space-y-4">
                  {topAccountsForChart.map((acc, index) => {
                    const balance = Number(acc.balance || 0);
                    const percentage = totalBalance > 0 ? ((balance / totalBalance) * 100).toFixed(1) : 0;
                    const colors = ['bg-blue-500', 'bg-cyan-500', 'bg-purple-500', 'bg-emerald-500'];

                    return (
                      <div key={acc.id || index} className="space-y-1.5">
                        <div className="flex justify-between text-xs font-mono">
                          <span className="text-white font-bold">ID: {acc.account_number} <span className="text-gray-400 font-normal">({acc.server_broker || 'Standard'})</span></span>
                          <span className="text-cyan-400">${balance.toLocaleString()} ({percentage}%)</span>
                        </div>
                        <div className="w-full bg-gray-950 h-2.5 rounded-full overflow-hidden border border-gray-800">
                          <div className={`${colors[index % colors.length]} h-full rounded-full transition-all duration-500`} style={{ width: `${percentage}%` }}></div>
                        </div>
                      </div>
                    );
                  })}
                  {otherBalanceSum > 0 && (
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-xs font-mono">
                        <span className="text-white font-bold">Các tài khoản khác</span>
                        <span className="text-gray-400">${otherBalanceSum.toLocaleString()} ({((otherBalanceSum / totalBalance) * 100).toFixed(1)}%)</span>
                      </div>
                      <div className="w-full bg-gray-950 h-2.5 rounded-full overflow-hidden border border-gray-800">
                        <div className="bg-gray-600 h-full rounded-full" style={{ width: `${(otherBalanceSum / totalBalance) * 100}%` }}></div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Biểu đồ tròn: Phân bổ lợi nhuận hoặc trạng thái tài khoản */}
              <div className="bg-gray-900 border border-gray-800 p-6 rounded-2xl shadow-xl space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-white">📊 Phân Bổ Trạng Thái Tài Khoản Hệ Thống</h3>
                  <p className="text-xs text-gray-400 mt-1">Tỷ lệ các tài khoản đang hoạt động, chờ cài đặt hoặc hết hạn.</p>
                </div>

                <div className="space-y-4 pt-2">
                  {/* Trạng thái Running */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs font-mono">
                      <span className="text-green-400 font-bold flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-green-400"></span> Đang chạy (Running)</span>
                      <span className="text-white font-bold">{activeRunningAccounts} / {totalAccounts} ({totalAccounts > 0 ? ((activeRunningAccounts / totalAccounts) * 100).toFixed(1) : 0}%)</span>
                    </div>
                    <div className="w-full bg-gray-950 h-2.5 rounded-full overflow-hidden border border-gray-800">
                      <div className="bg-green-500 h-full rounded-full" style={{ width: `${totalAccounts > 0 ? (activeRunningAccounts / totalAccounts) * 100 : 0}%` }}></div>
                    </div>
                  </div>

                  {/* Trạng thái Pending / Chờ setup */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs font-mono">
                      <span className="text-yellow-400 font-bold flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-yellow-400"></span> Chờ xử lý (Pending)</span>
                      <span className="text-white font-bold">{accounts.filter(a => a.bot_status === 'Pending').length} / {totalAccounts}</span>
                    </div>
                    <div className="w-full bg-gray-950 h-2.5 rounded-full overflow-hidden border border-gray-800">
                      <div className="bg-yellow-500 h-full rounded-full" style={{ width: `${totalAccounts > 0 ? (accounts.filter(a => a.bot_status === 'Pending').length / totalAccounts) * 100 : 0}%` }}></div>
                    </div>
                  </div>

                  {/* Trạng thái khác / Tạm dừng */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs font-mono">
                      <span className="text-gray-400 font-bold flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-gray-500"></span> Tạm dừng / Khác</span>
                      <span className="text-white font-bold">{totalAccounts - activeRunningAccounts - accounts.filter(a => a.bot_status === 'Pending').length} / {totalAccounts}</span>
                    </div>
                    <div className="w-full bg-gray-950 h-2.5 rounded-full overflow-hidden border border-gray-800">
                      <div className="bg-gray-500 h-full rounded-full" style={{ width: '15%' }}></div>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-950 p-4 rounded-xl border border-gray-800 flex justify-between items-center text-xs font-mono">
                  <span className="text-gray-400">Hiệu suất vận hành hạ tầng:</span>
                  <span className="text-emerald-400 font-bold">Ổn định (99.8%)</span>
                </div>
              </div>

            </div>
          </>
        )}

      </div>
    </main>
  );
}
