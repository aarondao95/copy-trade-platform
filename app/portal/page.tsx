'use client';

import { createClient } from '@supabase/supabase-js';
import { useEffect, useState } from 'react';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

export default function PortalPage() {
  const [email, setEmail] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  // Danh sách tài khoản của khách hàng
  const [myAccounts, setMyAccounts] = useState<any[]>([]);
  const [loadingAccounts, setLoadingAccounts] = useState(false);

  // Form input (Đã thêm platform: MT4 hoặc MT5)
  const [platform, setPlatform] = useState('MT5');
  const [accountNumber, setAccountNumber] = useState('');
  const [accountPass, setAccountPass] = useState('');
  const [serverBroker, setServerBroker] = useState('');
  const [broker, setBroker] = useState('');
  const [initialBalance, setInitialBalance] = useState('');
  const [botType, setBotType] = useState('Gold Scalping V3');
  const [customNotes, setCustomNotes] = useState('');
  
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  // Hàm tải danh sách tài khoản
  const fetchMyAccounts = async (clientEmail: string) => {
    setLoadingAccounts(true);
    const { data, error } = await supabase
      .from('trading_accounts')
      .select('*')
      .ilike('user_email', clientEmail.trim())
      .order('id', { ascending: false });

    if (!error) {
      setMyAccounts(data || []);
    }
    setLoadingAccounts(false);
  };

  // Đăng nhập bằng Email
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      alert('Vui lòng nhập Email của bạn!');
      return;
    }
    setIsLoggedIn(true);
    await fetchMyAccounts(email);
  };

  // Gửi thông tin tài khoản mới
  const handleSubmitRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!accountNumber || !accountPass || !serverBroker || !broker || !initialBalance) {
      alert('Vui lòng điền đầy đủ tất cả các trường!');
      return;
    }

    setSubmitting(true);
    const parsedBalance = parseFloat(initialBalance);

    const { error } = await supabase.from('trading_accounts').insert([
      {
        user_email: email.trim(),
        platform: platform.trim(), // MT4 hoặc MT5
        account_number: accountNumber.trim(),
        account_pass: accountPass.trim(),
        server_broker: serverBroker.trim(),
        broker: broker.trim(),
        initial_balance: parsedBalance,
        balance: parsedBalance,
        equity: parsedBalance,
        bot_name: botType,
        custom_notes: customNotes,
        bot_status: 'Pending', // Chờ Admin đưa lên VPS
      },
    ]);

    if (error) {
      alert('Lỗi gửi thông tin: ' + error.message);
    } else {
      setSuccessMsg('Gửi thông tin tài khoản thành công! Đội ngũ kỹ thuật sẽ tiến hành cài đặt Bot lên VPS.');
      // Reset form
      setAccountNumber('');
      setAccountPass('');
      setServerBroker('');
      setBroker('');
      setInitialBalance('');
      setCustomNotes('');
      // Tải lại danh sách
      await fetchMyAccounts(email);
    }
    setSubmitting(false);
  };

  return (
    <main className="min-h-screen bg-gray-950 text-gray-100 p-6 md:p-12">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* HEADER */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 flex justify-between items-center shadow-lg">
          <div>
            <h1 className="text-2xl font-bold text-white">Nền tảng Quản lý & Cài đặt Bot Tự động</h1>
            <p className="text-sm text-gray-400 mt-1">Cổng dịch vụ VPS & Bot Trading chuyên nghiệp</p>
          </div>
          {isLoggedIn && (
            <div className="text-sm bg-blue-900/40 text-blue-400 border border-blue-700/50 px-4 py-2 rounded-xl">
              Tài khoản: <span className="font-semibold text-white">{email}</span>
            </div>
          )}
        </div>

        {/* BƯỚC 1: ĐĂNG NHẬP */}
        {!isLoggedIn ? (
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 max-w-md mx-auto shadow-xl">
            <h2 className="text-xl font-bold text-white mb-4">Đăng nhập cổng khách hàng</h2>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Email của bạn</label>
                <input
                  type="email"
                  required
                  placeholder="name@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-gray-950 border border-gray-800 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-blue-500"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition shadow-lg shadow-blue-600/20"
              >
                Tiếp tục
              </button>
            </form>
          </div>
        ) : (
          <div className="space-y-8">
            
            {/* BƯỚC 2: FORM NHẬP THÔNG TIN TÀI KHOẢN */}
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 shadow-xl space-y-6">
              <div>
                <h2 className="text-xl font-bold text-white">➕ Thêm tài khoản trade & Đăng ký cài Bot</h2>
                <p className="text-sm text-gray-400 mt-1">Nhập thông tin nền tảng MT4/MT5 để hệ thống đưa lên VPS chạy tự động.</p>
              </div>

              {successMsg && (
                <div className="bg-green-900/40 border border-green-700 text-green-300 p-4 rounded-xl text-sm">
                  {successMsg}
                </div>
              )}

              <form onSubmit={handleSubmitRequest} className="space-y-5">
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Nền tảng MT4/MT5 */}
                  <div className="md:col-span-3">
                    <label className="block text-sm font-medium text-gray-300 mb-1">Nền tảng giao dịch (Platform)</label>
                    <select
                      value={platform}
                      onChange={(e) => setPlatform(e.target.value)}
                      className="w-full bg-gray-950 border border-gray-800 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-blue-500 font-semibold text-blue-400"
                    >
                      <option value="MT5">MetaTrader 5 (MT5)</option>
                      <option value="MT4">MetaTrader 4 (MT4)</option>
                    </select>
                  </div>

                  {/* Tài khoản */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Số tài khoản (ID)</label>
                    <input
                      type="text"
                      required
                      placeholder="Ví dụ: 88392011"
                      value={accountNumber}
                      onChange={(e) => setAccountNumber(e.target.value)}
                      className="w-full bg-gray-950 border border-gray-800 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-blue-500 font-mono"
                    />
                  </div>

                  {/* Pass */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Mật khẩu giao dịch (Pass)</label>
                    <input
                      type="text"
                      required
                      placeholder="Mật khẩu tài khoản"
                      value={accountPass}
                      onChange={(e) => setAccountPass(e.target.value)}
                      className="w-full bg-gray-950 border border-gray-800 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-blue-500 font-mono"
                    />
                  </div>

                  {/* Vốn ban đầu */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Vốn ban đầu ($)</label>
                    <input
                      type="number"
                      step="0.01"
                      required
                      placeholder="Ví dụ: 1000"
                      value={initialBalance}
                      onChange={(e) => setInitialBalance(e.target.value)}
                      className="w-full bg-gray-950 border border-gray-800 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-blue-500 font-mono text-green-400 font-bold"
                    />
                  </div>

                  {/* Server */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Server sàn</label>
                    <input
                      type="text"
                      required
                      placeholder="Ví dụ: Exness-Real15"
                      value={serverBroker}
                      onChange={(e) => setServerBroker(e.target.value)}
                      className="w-full bg-gray-950 border border-gray-800 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  {/* Sàn */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-300 mb-1">Tên sàn (Broker)</label>
                    <input
                      type="text"
                      required
                      placeholder="Ví dụ: Exness, Vantage..."
                      value={broker}
                      onChange={(e) => setBroker(e.target.value)}
                      className="w-full bg-gray-950 border border-gray-800 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                {/* Chọn gói Bot */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Chọn gói Bot muốn cài</label>
                  <select
                    value={botType}
                    onChange={(e) => setBotType(e.target.value)}
                    className="w-full bg-gray-950 border border-gray-800 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="Gold Scalping V3">Gold Scalping V3 (Chuyên Vàng XAU/USD)</option>
                    <option value="DCA Grid Matrix">DCA Grid Matrix (Lưới đa tầng an toàn vốn)</option>
                    <option value="Asian Session Range">Asian Session Range (Scalping phiên Á)</option>
                    <option value="Custom Bot theo yêu cầu">Cài Bot tùy chỉnh riêng theo yêu cầu</option>
                  </select>
                </div>

                {/* Yêu cầu setup thêm */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Yêu cầu setup / Thông số tùy chỉnh (Không bắt buộc)</label>
                  <input
                    type="text"
                    placeholder="Ví dụ: Khối lượng 0.01 lot, quản lý vốn 2%..."
                    value={customNotes}
                    onChange={(e) => setCustomNotes(e.target.value)}
                    className="w-full bg-gray-950 border border-gray-800 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-3.5 rounded-xl transition shadow-lg shadow-blue-600/25"
                >
                  {submitting ? 'Đang gửi thông tin...' : '🚀 Gửi thông tin tài khoản lên hệ thống VPS'}
                </button>

              </form>
            </div>

            {/* BƯỚC 3: KHU VỰC HIỂN THỊ DANH SÁCH TÀI KHOẢN THEO DÕI */}
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 shadow-xl space-y-6">
              <div className="flex justify-between items-center border-b border-gray-800 pb-4">
                <div>
                  <h2 className="text-xl font-bold text-white">📊 Danh sách tài khoản & Hiệu suất theo dõi</h2>
                  <p className="text-sm text-gray-400 mt-0.5">Các tài khoản thuộc quyền quản lý của email: <span className="text-blue-400 font-semibold">{email}</span></p>
                </div>
                <button
                  onClick={() => fetchMyAccounts(email)}
                  className="bg-gray-800 hover:bg-gray-700 text-gray-300 text-xs px-3 py-2 rounded-lg transition"
                >
                  🔄 Làm mới dữ liệu
                </button>
              </div>

              {loadingAccounts ? (
                <div className="text-center py-8 text-gray-500">Đang tải danh sách tài khoản...</div>
              ) : myAccounts.length === 0 ? (
                <div className="text-center py-8 text-gray-500">Bạn chưa có tài khoản nào được thêm vào hệ thống. Hãy điền form phía trên để gửi lên nhé!</div>
              ) : (
                <div className="space-y-6">
                  {myAccounts.map((acc: any) => {
                    const initial = Number(acc.initial_balance || acc.balance || 0);
                    const currentBalance = Number(acc.balance || 0);
                    const totalProfit = currentBalance - initial;
                    const totalProfitPercent = initial > 0 ? (totalProfit / initial) * 100 : 0;

                    return (
                      <div key={acc.id} className="bg-gray-950 border border-gray-800 rounded-xl p-5 space-y-4">
                        
                        {/* Hàng trên: Platform, Số tài khoản & Trạng thái Bot */}
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 border-b border-gray-800/80 pb-3">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs bg-blue-900/60 text-blue-400 border border-blue-700/50 px-2.5 py-0.5 rounded font-bold">
                                {acc.platform || 'MT5'}
                              </span>
                              <span className="text-lg font-mono font-bold text-white">{acc.account_number}</span>
                            </div>
                            <span className="text-xs text-gray-400 mt-1 block">Sàn: {acc.broker} ({acc.server_broker})</span>
                          </div>

                          <div className="flex items-center gap-3">
                            <span className="text-xs bg-gray-900 border border-gray-800 px-3 py-1 rounded-lg text-purple-400 font-semibold">
                              Bot: {acc.bot_name || 'Standard EA'}
                            </span>
                            <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-lg bg-gray-900 border border-gray-800 ${
                              acc.bot_status === 'Running' ? 'text-green-400' :
                              acc.bot_status === 'Stopped' ? 'text-yellow-400' : 'text-blue-400'
                            }`}>
                              <span className={`w-2 h-2 rounded-full ${
                                acc.bot_status === 'Running' ? 'bg-green-500 animate-pulse' :
                                acc.bot_status === 'Stopped' ? 'bg-yellow-500' : 'bg-blue-500 animate-bounce'
                              }`}></span>
                              {acc.bot_status === 'Pending' ? 'Đang chờ cài VPS' : acc.bot_status}
                            </span>
                          </div>
                        </div>

                        {/* Hàng các chỉ số tài chính */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                          <div className="bg-gray-900 p-3 rounded-lg">
                            <div className="text-xs text-gray-400">Vốn ban đầu</div>
                            <div className="font-mono font-bold text-gray-200 mt-0.5">${initial.toLocaleString()}</div>
                          </div>
                          <div className="bg-gray-900 p-3 rounded-lg">
                            <div className="text-xs text-gray-400">Balance (Số dư)</div>
                            <div className="font-mono font-bold text-white mt-0.5">${currentBalance.toLocaleString()}</div>
                          </div>
                          <div className="bg-gray-900 p-3 rounded-lg">
                            <div className="text-xs text-gray-400">Equity hiện tại</div>
                            <div className="font-mono font-bold text-blue-400 mt-0.5">${Number(acc.equity || currentBalance).toLocaleString()}</div>
                          </div>
                          <div className="bg-gray-900 p-3 rounded-lg">
                            <div className="text-xs text-gray-400">P/L Tổng lợi nhuận</div>
                            <div className={`font-mono font-bold mt-0.5 ${totalProfit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                              {totalProfit >= 0 ? '+' : ''}${totalProfit.toLocaleString()} ({totalProfitPercent.toFixed(2)}%)
                            </div>
                          </div>
                        </div>

                      </div>
                    );
                  })}
                </div>
              )}
            </div>

          </div>
        )}

      </div>
    </main>
  );
}