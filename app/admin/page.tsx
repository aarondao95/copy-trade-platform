'use client';

import { createClient } from '@supabase/supabase-js';
import { useEffect, useState } from 'react';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

export default function AdminDashboard() {
  // BẢO MẬT ADMIN
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [adminPasscode, setAdminPasscode] = useState('');

  const [accounts, setAccounts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  // Form thêm thông tin khách hàng vào Hàng Đợi (Queue)
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
  const rowsPerPage = 5; // Tăng lên 5 người mỗi trang để dễ nhìn danh sách hàng đợi

  useEffect(() => {
    const savedAdminAuth = localStorage.getItem('admin_auth_status');
    if (savedAdminAuth === 'verified') {
      setIsAdminAuthenticated(true);
      fetchAccounts();
    }
  }, []);

  function handleAdminLogin(e: React.FormEvent) {
    e.preventDefault();
    if (adminPasscode === 'admin123456') { // Pass đăng nhập Admin
      setIsAdminAuthenticated(true);
      localStorage.setItem('admin_auth_status', 'verified');
      fetchAccounts();
    } else {
      alert('❌ Sai mật khẩu quản trị viên!');
    }
  }

  function handleAdminLogout() {
    setIsAdminAuthenticated(false);
    localStorage.removeItem('admin_auth_status');
    setAdminPasscode('');
  }

  async function fetchAccounts() {
    setLoading(true);
    // Sắp xếp ID TĂNG DẦN (ascending: true) -> Ai đăng ký trước sẽ xếp trên cùng (STT 1)
    const { data, error } = await supabase
      .from('trading_accounts')
      .select('*')
      .order('id', { ascending: true });

    if (error) {
      setErrorMessage(error.message);
    } else {
      setAccounts(data || []);
    }
    setLoading(false);
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
        bot_status: 'Pending', // Mặc định vào hàng đợi là Pending
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
      fetchAccounts(); // Tự động load lại danh sách để cấp STT mới
    }
    setSubmitting(false);
  }

  async function handleDelete(id: any) {
    if (!confirm('Bạn có chắc chắn muốn xóa tài khoản này khỏi hàng đợi?')) return;

    const { error } = await supabase.from('trading_accounts').delete().eq('id', id);
    if (error) {
      alert('Lỗi khi xóa: ' + error.message);
    } else {
      fetchAccounts();
    }
  }

  // MÀN HÌNH KHÓA ADMIN
  if (!isAdminAuthenticated) {
    return (
      <main className="min-h-screen bg-gray-950 flex flex-col items-center justify-center p-6">
        <div className="max-w-sm w-full bg-gray-900 border border-red-900/50 rounded-3xl p-8 shadow-2xl shadow-red-900/20 text-center space-y-6">
          <div className="mx-auto w-16 h-16 bg-red-900/30 rounded-full flex items-center justify-center mb-4 border border-red-800">
            <span className="text-3xl">🔒</span>
          </div>
          <h1 className="text-2xl font-bold text-white">Hệ Thống Quản Trị CRM</h1>
          <p className="text-xs text-gray-400">Dành riêng cho Admin quản lý thông tin khách hàng & Setup VPS.</p>
          
          <form onSubmit={handleAdminLogin} className="space-y-4 pt-4">
            <input
              type="password"
              placeholder="Nhập mã truy cập (*****)..."
              value={adminPasscode}
              onChange={(e) => setAdminPasscode(e.target.value)}
              className="w-full bg-gray-950 border border-gray-800 rounded-xl p-3.5 text-center text-white outline-none focus:border-red-500 transition tracking-widest"
              required
            />
            <button
              type="submit"
              className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3.5 rounded-xl transition shadow-lg shadow-red-600/30"
            >
              Mở Khóa Quản Trị
            </button>
          </form>
          <div className="pt-4 border-t border-gray-800">
             <a href="/dashboard" className="text-xs text-blue-400 hover:underline">👉 Đi tới Báo cáo Hiệu suất Khách hàng</a>
          </div>
        </div>
      </main>
    );
  }

  // ==========================================
  // GIAO DIỆN CHÍNH TRANG QUẢN TRỊ ADMIN CRM
  // ==========================================
  const totalAccountsCount = accounts.length;
  const pendingAccountsCount = accounts.filter(acc => acc.bot_status === 'Pending' || !acc.bot_status).length;
  const runningAccountsCount = accounts.filter(acc => acc.bot_status === 'Running').length;

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
        
        {/* HEADER */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 flex flex-col md:flex-row justify-between items-center gap-4 shadow-xl">
          <div>
            <div className="flex items-center gap-3">
              <span className="bg-red-600 text-white text-xs font-bold px-2 py-1 rounded">ADMIN</span>
              <h1 className="text-2xl font-bold text-white">Quản lý Hàng Đợi (CRM Queue)</h1>
            </div>
            <p className="text-sm text-gray-400 mt-1">Lưu trữ thông tin khách hàng - Cấp phát STT xử lý</p>
          </div>
          <div className="flex gap-3">
            <button 
              onClick={handleAdminLogout}
              className="bg-gray-800 hover:bg-gray-700 text-red-400 px-4 py-2.5 rounded-xl text-sm font-semibold transition border border-gray-700"
            >
              🔒 Khóa Panel
            </button>
          </div>
        </div>

        {/* THỐNG KÊ NHANH HÀNG ĐỢI */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 shadow-lg flex items-center justify-between">
            <div>
              <div className="text-xs text-gray-400 font-medium">Tổng Khách Hàng</div>
              <div className="text-2xl font-bold text-white mt-1">{totalAccountsCount} <span className="text-sm font-normal text-gray-500">người</span></div>
            </div>
            <div className="w-12 h-12 bg-blue-900/30 rounded-full flex items-center justify-center text-blue-500 text-xl">👥</div>
          </div>
          
          <div className="bg-gray-900 border border-yellow-900/50 rounded-2xl p-5 shadow-lg flex items-center justify-between">
            <div>
              <div className="text-xs text-yellow-500 font-medium">Hàng Đợi Setup (Pending)</div>
              <div className="text-2xl font-bold text-yellow-400 mt-1">{pendingAccountsCount} <span className="text-sm font-normal text-yellow-700">chờ xử lý</span></div>
            </div>
            <div className="w-12 h-12 bg-yellow-900/30 rounded-full flex items-center justify-center text-yellow-500 text-xl">⏳</div>
          </div>

          <div className="bg-gray-900 border border-green-900/50 rounded-2xl p-5 shadow-lg flex items-center justify-between">
            <div>
              <div className="text-xs text-green-500 font-medium">Đã Lên VPS (Running)</div>
              <div className="text-2xl font-bold text-green-400 mt-1">{runningAccountsCount} <span className="text-sm font-normal text-green-700">đang chạy</span></div>
            </div>
            <div className="w-12 h-12 bg-green-900/30 rounded-full flex items-center justify-center text-green-500 text-xl">🚀</div>
          </div>
        </div>

        {/* FORM LƯU THÔNG TIN KHÁCH */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 shadow-xl space-y-4">
          <h2 className="text-lg font-bold text-white border-b border-gray-800 pb-3">➕ Đăng ký khách hàng mới vào hàng đợi</h2>
          <form onSubmit={handleAddAccount} className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1">Tài khoản ID (MT4/MT5)</label>
              <input type="text" placeholder="Ví dụ: 88392011" value={accountNumber} onChange={(e) => setAccountNumber(e.target.value)} className="w-full bg-gray-950 border border-gray-800 rounded-xl p-2.5 text-sm text-white outline-none focus:border-blue-500 font-mono" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1">Mật khẩu giao dịch (Pass)</label>
              <input type="text" placeholder="Mật khẩu tài khoản" value={accountPass} onChange={(e) => setAccountPass(e.target.value)} className="w-full bg-gray-950 border border-gray-800 rounded-xl p-2.5 text-sm text-white outline-none focus:border-blue-500 font-mono" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1">Server Broker</label>
              <input type="text" placeholder="Ví dụ: Exness-Real15" value={serverBroker} onChange={(e) => setServerBroker(e.target.value)} className="w-full bg-gray-950 border border-gray-800 rounded-xl p-2.5 text-sm text-white outline-none focus:border-blue-500" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1">Email Khách</label>
              <input type="email" placeholder="khachhang@gmail.com" value={userEmail} onChange={(e) => setUserEmail(e.target.value)} className="w-full bg-gray-950 border border-gray-800 rounded-xl p-2.5 text-sm text-white outline-none focus:border-blue-500" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1">Vốn Của Khách ($)</label>
              <input type="number" step="0.01" placeholder="1000" value={balance} onChange={(e) => setBalance(e.target.value)} className="w-full bg-gray-950 border border-gray-800 rounded-xl p-2.5 text-sm text-white outline-none focus:border-blue-500 font-mono text-green-400 font-bold" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1">Yêu cầu cài đặt (Setup Notes)</label>
              <input type="text" placeholder="Ví dụ: Cài Bot DCA 15 giá..." value={customNotes} onChange={(e) => setCustomNotes(e.target.value)} className="w-full bg-gray-950 border border-gray-800 rounded-xl p-2.5 text-sm text-white outline-none focus:border-blue-500" />
            </div>
            <div className="md:col-span-3 pt-2">
              <button type="submit" disabled={submitting} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-xl transition duration-200 shadow-lg shadow-blue-600/20">
                {submitting ? 'Đang lưu...' : 'Lưu Thông Tin & Cấp Số Thứ Tự (STT)'}
              </button>
            </div>
          </form>
        </div>

        {/* DANH SÁCH QUẢN LÝ (SẮP XẾP THEO STT TỪ CŨ TỚI MỚI) */}
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-gray-900 border border-gray-800 rounded-2xl p-6 shadow-xl">
            <h2 className="text-lg font-bold text-white">📋 Danh Sách Khách Hàng (Đăng Ký Trước Được Xếp Trên)</h2>
            <div className="w-full md:w-80">
              <input type="text" placeholder="🔍 Tìm kiếm nhanh..." value={searchTerm} onChange={(e) => {setSearchTerm(e.target.value); setCurrentPage(1);}} className="w-full bg-gray-950 border border-gray-800 rounded-xl px-3 py-2 text-sm text-white outline-none focus:border-blue-500" />
            </div>
          </div>

          {loading ? (
            <div className="text-center py-12 text-gray-500 bg-gray-900 border border-gray-800 rounded-2xl">Đang tải hàng đợi...</div>
          ) : currentAccounts.length === 0 ? (
            <div className="text-center py-12 text-gray-500 bg-gray-900 border border-gray-800 rounded-2xl">Chưa có dữ liệu nào.</div>
          ) : (
            <div className="space-y-4">
              {currentAccounts.map((acc: any, index: number) => {
                // Tính số thứ tự tuyệt đối trên toàn bộ danh sách
                const stt = indexOfFirstRow + index + 1;
                
                return (
                  <div key={acc.id} className={`bg-gray-900 border ${acc.bot_status === 'Pending' ? 'border-yellow-900/50' : 'border-gray-800'} rounded-2xl p-5 shadow-xl relative overflow-hidden`}>
                    
                    {/* Băng rôn cảnh báo nếu Pending */}
                    {acc.bot_status === 'Pending' && (
                      <div className="absolute top-0 right-0 bg-yellow-600 text-white text-[10px] font-bold px-3 py-1 rounded-bl-xl z-10">
                        CẦN XỬ LÝ
                      </div>
                    )}

                    <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
                      
                      {/* KHỐI SỐ THỨ TỰ TO BÊN TRÁI */}
                      <div className="flex flex-col items-center justify-center bg-gray-950 border border-gray-800 rounded-xl w-24 h-24 shrink-0">
                        <span className="text-xs text-gray-500 font-bold mb-1">STT</span>
                        <span className="text-4xl font-black text-blue-500">#{stt}</span>
                      </div>

                      {/* KHỐI THÔNG TIN BẢO MẬT ĐỂ COPY PASTE VÀO VPS */}
                      <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
                        <div>
                          <div className="text-xs text-gray-500 font-medium">Tài khoản ID</div>
                          <div className="text-lg font-mono font-bold text-white">{acc.account_number}</div>
                          <div className="text-xs font-mono text-gray-400 mt-1 break-all">Pass: <span className="text-red-400">{acc.account_pass}</span></div>
                        </div>

                        <div>
                          <div className="text-xs text-gray-500 font-medium">Server Broker</div>
                          <div className="text-sm font-medium text-white mt-1">{acc.server_broker || 'Chưa nhập'}</div>
                          <div className="text-xs text-blue-400 mt-1">{acc.user_email}</div>
                        </div>

                        <div>
                          <div className="text-xs text-gray-500 font-medium">Yêu Cầu Cài Đặt (Notes)</div>
                          <div className="text-sm font-medium text-yellow-400 mt-1">{acc.custom_notes || 'Mặc định'}</div>
                          <div className="text-xs text-gray-400 mt-1">Vốn: <span className="text-green-400 font-bold">${Number(acc.initial_balance || 0).toLocaleString()}</span></div>
                        </div>

                        <div className="flex flex-col items-start lg:items-end justify-center gap-2">
                           <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-xl border ${
                            acc.bot_status === 'Running' ? 'bg-green-950/60 text-green-400 border-green-800' : 'bg-yellow-950/60 text-yellow-400 border-yellow-800'
                          }`}>
                            <span className={`w-2 h-2 rounded-full ${acc.bot_status === 'Running' ? 'bg-green-400 animate-pulse' : 'bg-yellow-400'}`}></span>
                            {acc.bot_status || 'Pending'}
                          </span>
                          <button onClick={() => handleDelete(acc.id)} className="text-xs text-red-500 hover:text-red-400 underline">
                            Xóa khỏi hệ thống
                          </button>
                        </div>
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
                <button onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))} disabled={currentPage === 1} className="px-4 py-2 bg-gray-950 border border-gray-800 rounded-xl text-xs font-semibold hover:bg-gray-800 disabled:opacity-50 transition">Trước</button>
                <button onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages} className="px-4 py-2 bg-gray-950 border border-gray-800 rounded-xl text-xs font-semibold hover:bg-gray-800 disabled:opacity-50 transition">Sau</button>
              </div>
            </div>
          )}
        </div>

      </div>
    </main>
  );
}

