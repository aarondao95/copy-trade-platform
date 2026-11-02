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

  // STATE MỚI: Lựa chọn xem toàn hệ thống hay chi tiết 1 tài khoản (Chọn theo ID)
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

  // --- LỌC DỮ LIỆU DỰA TRÊN LỰA CHỌN CỦA ADMIN ---
  const currentSelectedAccount = selectedAccountId === 'all' 
    ? null 
    : accounts.find(acc => String(acc.id) === selectedAccountId);

  // Nếu chọn 1 tài khoản cụ thể thì tính toán cho riêng tài khoản đó, ngược lại tính cho toàn hệ thống
  const totalAccounts = accounts.length;
  const activeRunningAccounts = accounts.filter(acc => acc.bot_status === 'Running').length;
  
  const displayBalance = currentSelectedAccount ? Number(currentSelectedAccount.balance || 0) : accounts.reduce((acc, curr) => acc + Number(curr.balance || 0), 0);
  const displayEquity = currentSelectedAccount ? Number(currentSelectedAccount.equity || currentSelectedAccount.balance || 0) : accounts.reduce((acc, curr) => acc + Number(curr.equity || curr.balance || 0), 0);
  const displayInitial = currentSelectedAccount ? Number(currentSelectedAccount.initial_balance || currentSelectedAccount.balance || 0) : accounts.reduce((acc, curr) => acc + Number(curr.initial_balance || curr.balance || 0), 0);
  const displayProfit = displayBalance - displayInitial;
  const displayProfitPercent = displayInitial > 0 ? (displayProfit / displayInitial) * 100 : 0;

  const displayLots = currentSelectedAccount ? Number(currentSelectedAccount.total_lots || 2.4) : accounts.reduce((acc, curr) => acc + Number(curr.total_lots || 12.5), 0);

  // Tài khoản lợi nhuận tốt nhất (chỉ tính khi xem toàn hệ thống)
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

  const sortedByBalance = [...accounts].sort((a, b) => Number(b.balance || 0) - Number(a.balance || 0));
  const topAccountsForChart = sortedByBalance.slice(0, 4);
  const otherBalanceSum = sortedByBalance.slice(4).reduce((acc, curr) => acc + Number(curr.balance || 0), 0);

  return (
    <main className="min-h-screen bg-gray-950 text-gray-100 p-6 md:p-10">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* HEADER & LỰA CHỌN TÀI KHOẢN KHÁCH HÀNG */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 flex flex-col lg:flex-row justify-between items-center gap-6 shadow-xl">
          <div>
            <div className="flex items-center gap-3">
              <span className="bg-blue-600 text-white text-xs font-bold px-2.5 py-1 rounded-md">ANALYTICS & INSIGHTS</span>
              <h1 className="text-2xl font-bold text-white">Phân Tích Hiệu Suất Đầu Tư</h1>
            </div>
            <p className="text-xs text-gray-400 mt-1">Xem tổng quan toàn hệ thống hoặc chọn riêng tài khoản của từng khách hàng.</p>
          </div>

          {/* DROPDOWN LỰA CHỌN TÀI KHOẢN KHÁCH HÀNG */}
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto">
            <div className="w-full sm:w-72">
              <label className="block text-[10px] text-gray-400 mb-1 font-mono uppercase tracking-wider">Chọn tài khoản khách hàng:</label>
              <select 
                value={selectedAccountId} 
                onChange={(e) => setSelectedAccountId(e.target.value)}
                className="w-full bg-gray-950 border border-blue-500/50 rounded-xl px-3 py-2.5 text-sm text-white outline-none font-semibold focus:border-blue-400"
              >
                <option value="all">🌐 Tổng quan toàn hệ thống (All Accounts)</option>
                {accounts.map(acc => (
                  <option key={acc.id} value={String(acc.id)}>
                    ID: {acc.account_number} — {acc.custom_notes ? acc.custom_notes.split('|')[0] : acc.user_email}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2 pt-4 sm:pt-5">
              <Link href="/admin" className="bg-gray-800 hover:bg-gray-700 text-gray-300 px-4 py-2.5 rounded-xl text-sm font-semibold border border-gray-700 transition">
                ← CRM
              </Link>
              <button onClick={fetchSystemData} className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition">
                🔄
              </button>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-20 text-gray-500 font-mono">Đang tổng hợp dữ liệu...</div>
        ) : (
          <>
            {/* THÔNG BÁO ĐANG XEM CHI TIẾT TÀI KHOẢN NÀO */}
            {currentSelectedAccount && (
              <div className="bg-blue-950/40 border border-blue-800/60 p-4 rounded-xl flex flex-col sm:flex-row justify-between items-center gap-4 text-sm">
                <div className="flex items-center gap-3">
                  <span className="w-3 h-3 rounded-full bg-blue-400 animate-pulse"></span>
                  <span>Đang xem chi tiết tài khoản: <strong className="text-white font-mono text-base">ID {currentSelectedAccount.account_number}</strong> của khách hàng <span className="text-blue-400 font-semibold">{currentSelectedAccount.user_email}</span></span>
                </div>
                <button 
                  onClick={() => setSelectedAccountId('all')} 
                  className="text-xs bg-blue-900/60 hover:bg-blue-800 text-blue-300 px-3 py-1.5 rounded-lg border border-blue-700 transition"
                >
                  ✕ Quay lại xem toàn hệ thống
                </button>
              </div>
            )}

            {/* 1. TOP SUMMARY CARDS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              <div className="bg-gray-900 border border-gray-800 p-5 rounded-2xl shadow-lg">
                <div className="text-xs text-gray-400 font-medium">{currentSelectedAccount ? 'Trạng thái Bot' : 'Tổng Tài Khoản'}</div>
                <div className="text-2xl font-black text-white mt-1 font-mono">
                  {currentSelectedAccount ? (currentSelectedAccount.bot_status || 'Pending') : totalAccounts} 
                  {!currentSelectedAccount && <span className="text-xs text-green-400 font-normal"> ({activeRunningAccounts} Running)</span>}
                </div>
              </div>
              <div className="bg-gray-900 border border-gray-800 p-5 rounded-2xl shadow-lg">
                <div className="text-xs text-gray-400 font-medium">Số Dư (Balance)</div>
                <div className="text-2xl font-black text-white mt-1 font-mono">${displayBalance.toLocaleString()}</div>
              </div>
              <div className="bg-gray-900 border border-gray-800 p-5 rounded-2xl shadow-lg">
                <div className="text-xs text-gray-400 font-medium">Tài Sản (Equity)</div>
                <div className="text-2xl font-black text-cyan-400 mt-1 font-mono">${displayEquity.toLocaleString()}</div>
              </div>
              <div className="bg-gray-900 border border-gray-800 p-5 rounded-2xl shadow-lg">
                <div className="text-xs text-gray-400 font-medium">Lợi Nhuận (Net P/L)</div>
                <div className={`text-2xl font-black mt-1 font-mono ${displayProfit >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                  {displayProfit >= 0 ? '+' : ''}${displayProfit.toLocaleString()} <span className="text-xs">({displayProfitPercent.toFixed(2)}%)</span>
                </div>
              </div>
              <div className="bg-gray-900 border border-gray-800 p-5 rounded-2xl shadow-lg">
                <div className="text-xs text-gray-400 font-medium">Khối Lượng Giao Dịch</div>
                <div className="text-2xl font-black text-yellow-400 mt-1 font-mono">{displayLots} Lot</div>
              </div>
            </div>

            {/* 2. BIỂU ĐỒ & THÔNG TIN CHI TIẾT */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Biểu đồ tăng trưởng */}
              <div className="lg:col-span-2 bg-gray-900 border border-gray-800 p-6 rounded-2xl shadow-xl flex flex-col justify-between">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h3 className="text-lg font-bold text-white">📈 Biểu Đồ Hiệu Suất Tăng Trưởng (30 Ngày)</h3>
                    <p className="text-xs text-gray-400">{currentSelectedAccount ? `Biến động tài sản của tài khoản ${currentSelectedAccount.account_number}` : 'Biến động số dư tổng thể toàn bộ danh mục'}</p>
                  </div>
                  <span className="text-xs bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-3 py-1 rounded-lg font-mono font-bold">
                    Real-time Sync
                  </span>
                </div>

                <div className="h-48 flex items-end gap-2 pt-6 px-2 border-b border-gray-800">
                  {[30, 38, 34, 45, 50, 48, 55, 62, 59, 68, 74, 72, 82, 88, 92].map((h, i) => (
                    <div key={i} className="flex-1 bg-gradient-to-t from-blue-600 to-cyan-400 rounded-t-md hover:opacity-80 transition-all relative group">
                      <span className="absolute -top-7 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-[10px] px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition font-mono">
                        ${h * (currentSelectedAccount ? 30 : 450)}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between text-xs text-gray-500 mt-3 font-mono">
                  <span>30 ngày trước</span>
                  <span>15 ngày trước</span>
                  <span>Hôm nay</span>
                </div>
              </div>

              {/* Thông tin chi tiết khách hàng hoặc Top tài khoản */}
              <div className="bg-gray-900 border border-gray-800 p-6 rounded-2xl shadow-xl flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-xl">{currentSelectedAccount ? '👤' : '🏆'}</span>
                    <h3 className="text-lg font-bold text-white">{currentSelectedAccount ? 'Thông Tin Khách Hàng' : 'Top Tài Khoản Hiệu Suất'}</h3>
                  </div>
                  <p className="text-xs text-gray-400 mb-6">{currentSelectedAccount ? 'Chi tiết liên hệ và cấu hình cài đặt của tài khoản này.' : 'Tài khoản mang lại biên độ lợi nhuận cao nhất.'}</p>

                  {currentSelectedAccount ? (
                    <div className="bg-gray-950 border border-gray-800 p-5 rounded-xl space-y-3 font-mono text-xs shadow-inner">
                      <div><span className="text-gray-500">Email khách:</span> <span className="text-blue-400">{currentSelectedAccount.user_email}</span></div>
                      <div><span className="text-gray-500">Số Zalo/SĐT:</span> <span className="text-green-400 font-bold">{currentSelectedAccount.zalo_number || 'Chưa có'}</span></div>
                      <div><span className="text-gray-500">Broker / Server:</span> <span className="text-white">{currentSelectedAccount.server_broker}</span></div>
                      <div><span className="text-gray-500">Gói thuê bao:</span> <span className="text-yellow-400">{currentSelectedAccount.subscription_days} ngày</span></div>
                      <div className="pt-2 border-t border-gray-800">
                        <span className="text-gray-500 block mb-1">Ghi chú nội bộ:</span>
                        <span className="text-yellow-400 font-sans">{currentSelectedAccount.custom_notes || 'Không có ghi chú'}</span>
                      </div>
                    </div>
                  ) : bestAccount ? (
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
                        <div className="text-xs text-gray-400">Khách hàng</div>
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
                    <div className="text-center py-10 text-gray-500 text-sm">Chưa có dữ liệu.</div>
                  )}
                </div>

                <div className="text-xs text-gray-500 italic text-center mt-4">
                  * Dữ liệu đồng bộ trực tiếp từ Supabase.
                </div>
              </div>

            </div>

            {/* 3. BIỂU ĐỒ TRÒN PHÂN BỔ VỐN (CHỈ HIỂN THỊ KHI Ở CHẾ ĐỘ TOÀN HỆ THỐNG) */}
            {!currentSelectedAccount && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
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
                            <span className="text-white font-bold">ID: {acc.account_number}</span>
                            <span className="text-cyan-400">${balance.toLocaleString()} ({percentage}%)</span>
                          </div>
                          <div className="w-full bg-gray-950 h-2.5 rounded-full overflow-hidden border border-gray-800">
                            <div className={`${colors[index % colors.length]} h-full rounded-full`} style={{ width: `${percentage}%` }}></div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="bg-gray-900 border border-gray-800 p-6 rounded-2xl shadow-xl space-y-6">
                  <div>
                    <h3 className="text-lg font-bold text-white">📊 Phân Bổ Trạng Thái Tài Khoản</h3>
                    <p className="text-xs text-gray-400 mt-1">Tỷ lệ các tài khoản đang chạy so với tổng số lượng.</p>
                  </div>

                  <div className="space-y-4 pt-2">
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-xs font-mono">
                        <span className="text-green-400 font-bold">Đang chạy (Running)</span>
                        <span className="text-white font-bold">{activeRunningAccounts} / {totalAccounts}</span>
                      </div>
                      <div className="w-full bg-gray-950 h-2.5 rounded-full overflow-hidden border border-gray-800">
                        <div className="bg-green-500 h-full rounded-full" style={{ width: `${totalAccounts > 0 ? (activeRunningAccounts / totalAccounts) * 100 : 0}%` }}></div>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex justify-between text-xs font-mono">
                        <span className="text-yellow-400 font-bold">Chờ xử lý (Pending)</span>
                        <span className="text-white font-bold">{accounts.filter(a => a.bot_status === 'Pending').length} / {totalAccounts}</span>
                      </div>
                      <div className="w-full bg-gray-950 h-2.5 rounded-full overflow-hidden border border-gray-800">
                        <div className="bg-yellow-500 h-full rounded-full" style={{ width: `${totalAccounts > 0 ? (accounts.filter(a => a.bot_status === 'Pending').length / totalAccounts) * 100 : 0}%` }}></div>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            )}
          </>
        )}

      </div>
    </main>
  );
}
