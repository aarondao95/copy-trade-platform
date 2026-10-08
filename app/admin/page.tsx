'use client';

import { createClient } from '@supabase/supabase-js';
import { useEffect, useState } from 'react';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

export default function AdminDashboard() {
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [adminPasscode, setAdminPasscode] = useState('');

  const [accounts, setAccounts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  // Form Thêm tài khoản
  const [accountNumber, setAccountNumber] = useState('');
  const [accountPass, setAccountPass] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [serverBroker, setServerBroker] = useState('');
  const [balance, setBalance] = useState('');
  const [customNotes, setCustomNotes] = useState('');
  const [subscriptionDays, setSubscriptionDays] = useState('30');
  const [submitting, setSubmitting] = useState(false);

  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 5;

  // Cập nhật đếm ngược mỗi phút
  const [currentTime, setCurrentTime] = useState(new Date());
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const savedAdminAuth = localStorage.getItem('admin_auth_status');
    if (savedAdminAuth === 'verified') {
      setIsAdminAuthenticated(true);
      fetchAccounts();
    }
  }, []);

  function handleAdminLogin(e: React.FormEvent) {
    e.preventDefault();
    if (adminPasscode === 'admin123456') { 
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
    const { data, error } = await supabase
      .from('trading_accounts')
      .select('*')
      .order('id', { ascending: true });

    if (error) setErrorMessage(error.message);
    else setAccounts(data || []);
    setLoading(false);
  }

  async function handleAddAccount(e: React.FormEvent) {
    e.preventDefault();
    if (!accountNumber || !userEmail || !balance) {
      alert('Vui lòng điền đủ thông tin cơ bản!');
      return;
    }
    setSubmitting(true);
    const { error } = await supabase.from('trading_accounts').insert([
      {
        account_number: accountNumber,
        account_pass: accountPass,
        user_email: userEmail,
        server_broker: serverBroker,
        initial_balance: parseFloat(balance),
        balance: parseFloat(balance),
        equity: parseFloat(balance),
        custom_notes: customNotes,
        subscription_days: parseInt(subscriptionDays) || 30,
        bot_status: 'Pending',
        running_start_date: null
      },
    ]);

    if (error) alert('Lỗi khi thêm: ' + error.message);
    else {
      setAccountNumber(''); setAccountPass(''); setUserEmail(''); setServerBroker(''); setBalance(''); setCustomNotes(''); setSubscriptionDays('30');
      fetchAccounts();
    }
    setSubmitting(false);
  }

  async function handleDelete(id: any) {
    if (!confirm('Chắc chắn muốn xóa tài khoản này?')) return;
    const { error } = await supabase.from('trading_accounts').delete().eq('id', id);
    if (!error) fetchAccounts();
  }

  async function handleStartTimer(id: any) {
    if (!confirm('Bắt đầu tính giờ sử dụng từ thời điểm này?')) return;
    const { error } = await supabase
      .from('trading_accounts')
      .update({ running_start_date: new Date().toISOString() })
      .eq('id', id);
    if (!error) fetchAccounts();
  }

  async function handleRenew(id: any, currentDays: number) {
    const daysToAdd = prompt('Nhập số ngày muốn GIA HẠN thêm (Ví dụ: 30, 90, 365):', '30');
    if (!daysToAdd || isNaN(Number(daysToAdd))) return;
    
    const newTotalDays = (currentDays || 0) + parseInt(daysToAdd);
    const { error } = await supabase
      .from('trading_accounts')
      .update({ subscription_days: newTotalDays })
      .eq('id', id);
    
    if (error) alert('Lỗi gia hạn: ' + error.message);
    else {
      alert(`✅ Đã gia hạn thành công! Tổng số ngày: ${newTotalDays} ngày.`);
      fetchAccounts();
    }
  }

  // TÍNH NĂNG MỚI: CẬP NHẬT GHI CHÚ TRỰC TIẾP
  async function handleUpdateNote(id: any, currentNote: string) {
    const newNote = prompt('SỬA GHI CHÚ (Tên khách, Tên VPS, Bot, Trạng thái...):', currentNote || '');
    if (newNote !== null) { // Nếu bấm Cancel thì ko làm gì, nếu bấm OK thì lưu
      const { error } = await supabase
        .from('trading_accounts')
        .update({ custom_notes: newNote })
        .eq('id', id);
      
      if (error) alert('Lỗi khi lưu ghi chú: ' + error.message);
      else fetchAccounts();
    }
  }

  function getRemainingTime(startDate: string, subDays: number) {
    if (!startDate) return { status: 'waiting', text: 'Chưa kích hoạt tính giờ' };
    const start = new Date(startDate).getTime();
    const end = start + (subDays * 24 * 60 * 60 * 1000);
    const now = currentTime.getTime();
    const diff = end - now;

    if (diff <= 0) return { status: 'expired', text: '🔴 Đã Hết Hạn' };
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    
    if (days < 3) return { status: 'warning', text: `⚠️ Sắp hết hạn (Còn ${days} ngày ${hours}h)` };
    return { status: 'active', text: `🟢 Còn ${days} ngày ${hours} giờ` };
  }

  if (!isAdminAuthenticated) {
    return (
      <main className="min-h-screen bg-gray-950 flex flex-col items-center justify-center p-6">
        <div className="max-w-sm w-full bg-gray-900 border border-red-900/50 rounded-3xl p-8 shadow-2xl text-center space-y-6">
          <div className="mx-auto w-16 h-16 bg-red-900/30 rounded-full flex items-center justify-center mb-4 border border-red-800">
            <span className="text-3xl">🔒</span>
          </div>
          <h1 className="text-2xl font-bold text-white">Quản Trị CRM</h1>
          <form onSubmit={handleAdminLogin} className="space-y-4 pt-4">
            <input type="password" placeholder="Mã truy cập..." value={adminPasscode} onChange={(e) => setAdminPasscode(e.target.value)} className="w-full bg-gray-950 border border-gray-800 rounded-xl p-3.5 text-center text-white outline-none focus:border-red-500 tracking-widest" required />
            <button type="submit" className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3.5 rounded-xl">Mở Khóa</button>
          </form>
        </div>
      </main>
    );
  }

  const filteredAccounts = accounts.filter((acc) => {
    const searchLower = searchTerm.toLowerCase();
    return (acc.account_number?.toLowerCase().includes(searchLower) || acc.user_email?.toLowerCase().includes(searchLower) || acc.custom_notes?.toLowerCase().includes(searchLower));
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
              <span className="bg-red-600 text-white text-xs font-bold px-2 py-1 rounded">ADMIN CRM</span>
              <h1 className="text-2xl font-bold text-white">Quản lý Hàng Đợi & Thuê Bao</h1>
            </div>
          </div>
          <button onClick={handleAdminLogout} className="bg-gray-800 hover:bg-gray-700 text-red-400 px-4 py-2.5 rounded-xl text-sm font-semibold border border-gray-700">🔒 Khóa Panel</button>
        </div>

        {/* FORM THÊM KHÁCH HÀNG */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 shadow-xl space-y-4">
          <h2 className="text-lg font-bold text-white border-b border-gray-800 pb-3">➕ Đăng ký khách hàng & Cấp gói ngày</h2>
          <form onSubmit={handleAddAccount} className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div><label className="block text-xs text-gray-400 mb-1">ID (MT4/MT5)</label><input type="text" value={accountNumber} onChange={(e) => setAccountNumber(e.target.value)} className="w-full bg-gray-950 border border-gray-800 rounded-xl p-2.5 text-sm text-white outline-none focus:border-blue-500 font-mono" /></div>
            <div><label className="block text-xs text-gray-400 mb-1">Pass (Mật khẩu)</label><input type="text" value={accountPass} onChange={(e) => setAccountPass(e.target.value)} className="w-full bg-gray-950 border border-gray-800 rounded-xl p-2.5 text-sm text-white outline-none focus:border-blue-500 font-mono" /></div>
            <div><label className="block text-xs text-gray-400 mb-1">Server Broker</label><input type="text" value={serverBroker} onChange={(e) => setServerBroker(e.target.value)} className="w-full bg-gray-950 border border-gray-800 rounded-xl p-2.5 text-sm text-white outline-none focus:border-blue-500" /></div>
            <div><label className="block text-xs text-gray-400 mb-1">Email Khách</label><input type="email" value={userEmail} onChange={(e) => setUserEmail(e.target.value)} className="w-full bg-gray-950 border border-gray-800 rounded-xl p-2.5 text-sm text-white outline-none focus:border-blue-500" /></div>
            <div><label className="block text-xs text-gray-400 mb-1">Vốn Khách ($)</label><input type="number" value={balance} onChange={(e) => setBalance(e.target.value)} className="w-full bg-gray-950 border border-gray-800 rounded-xl p-2.5 text-sm text-white outline-none focus:border-blue-500 font-mono text-green-400" /></div>
            <div className="md:col-span-2"><label className="block text-xs text-gray-400 mb-1">Ghi chú (Tên khách, VPS, Yêu cầu...)</label><input type="text" value={customNotes} onChange={(e) => setCustomNotes(e.target.value)} className="w-full bg-gray-950 border border-gray-800 rounded-xl p-2.5 text-sm text-white outline-none focus:border-blue-500" /></div>
            
            <div>
              <label className="block text-xs text-yellow-500 font-bold mb-1">Số Ngày Mua</label>
              <input type="number" value={subscriptionDays} onChange={(e) => setSubscriptionDays(e.target.value)} className="w-full bg-yellow-900/20 border border-yellow-700/50 rounded-xl p-2.5 text-sm text-yellow-400 font-bold outline-none focus:border-yellow-500" />
            </div>

            <div className="md:col-span-4 pt-2">
              <button type="submit" disabled={submitting} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-xl transition shadow-lg shadow-blue-600/20">
                {submitting ? 'Đang lưu...' : 'Lưu Thông Tin & Đưa Vào Hàng Đợi'}
              </button>
            </div>
          </form>
        </div>

        {/* DANH SÁCH QUẢN LÝ */}
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-gray-900 border border-gray-800 rounded-2xl p-6 shadow-xl">
            <h2 className="text-lg font-bold text-white">📋 Quản Lý Thời Gian & Cài Đặt Khách Hàng</h2>
            <div className="w-full md:w-80">
              <input type="text" placeholder="🔍 Tìm ID, Email, Ghi chú..." value={searchTerm} onChange={(e) => {setSearchTerm(e.target.value); setCurrentPage(1);}} className="w-full bg-gray-950 border border-gray-800 rounded-xl px-3 py-2 text-sm text-white outline-none focus:border-blue-500" />
            </div>
          </div>

          {loading ? (
            <div className="text-center py-12 text-gray-500">Đang tải dữ liệu...</div>
          ) : currentAccounts.length === 0 ? (
            <div className="text-center py-12 text-gray-500">Chưa có dữ liệu nào.</div>
          ) : (
            <div className="space-y-4">
              {currentAccounts.map((acc: any, index: number) => {
                const stt = indexOfFirstRow + index + 1;
                const timeInfo = getRemainingTime(acc.running_start_date, acc.subscription_days || 0);
                
                return (
                  <div key={acc.id} className={`bg-gray-900 border ${acc.bot_status === 'Pending' ? 'border-yellow-900/50' : 'border-gray-800'} rounded-2xl p-5 shadow-xl relative overflow-hidden`}>
                    
                    <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
                      
                      {/* KHỐI SỐ THỨ TỰ */}
                      <div className="flex flex-col items-center justify-center bg-gray-950 border border-gray-800 rounded-xl w-24 h-24 shrink-0">
                        <span className="text-xs text-gray-500 font-bold mb-1">STT</span>
                        <span className="text-4xl font-black text-blue-500">#{stt}</span>
                      </div>

                      {/* KHỐI THÔNG TIN CHÍNH */}
                      <div className="flex-1 w-full flex flex-col gap-4">
                        
                        {/* Hàng 1: ID, Mật khẩu, Server, Đếm ngược */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
                          <div className="lg:col-span-1">
                            <div className="text-xs text-gray-500 font-medium">Tài khoản ID</div>
                            <div className="text-lg font-mono font-bold text-white">{acc.account_number}</div>
                            <div className="text-xs font-mono text-gray-400 mt-1 break-all">Pass: <span className="text-red-400">{acc.account_pass}</span></div>
                          </div>

                          <div className="lg:col-span-1">
                            <div className="text-xs text-gray-500 font-medium">Broker & Email</div>
                            <div className="text-sm font-medium text-white mt-1 break-all">{acc.server_broker || 'Chưa nhập'}</div>
                            <div className="text-xs text-blue-400 mt-1">{acc.user_email}</div>
                          </div>

                          {/* ĐẾM NGƯỢC THỜI GIAN */}
                          <div className="lg:col-span-1 bg-gray-950 border border-gray-800 p-3 rounded-xl flex flex-col justify-center">
                            <div className="text-xs text-gray-500 font-bold mb-1">GÓI THUÊ BAO ({acc.subscription_days} ngày)</div>
                            <div className={`font-mono font-bold text-sm ${
                              timeInfo.status === 'active' ? 'text-green-400' : 
                              timeInfo.status === 'warning' ? 'text-yellow-400 animate-pulse' :
                              timeInfo.status === 'expired' ? 'text-red-500' : 'text-gray-400'
                            }`}>
                              {timeInfo.text}
                            </div>
                            <div className="flex gap-2 mt-2">
                              {!acc.running_start_date && (
                                <button onClick={() => handleStartTimer(acc.id)} className="bg-blue-600 hover:bg-blue-500 text-white text-[10px] px-2 py-1 rounded">
                                  ▶ Tính giờ
                                </button>
                              )}
                              <button onClick={() => handleRenew(acc.id, acc.subscription_days)} className="bg-yellow-600/80 hover:bg-yellow-500 text-white text-[10px] px-2 py-1 rounded">
                                + Gia hạn
                              </button>
                            </div>
                          </div>

                          {/* ACTION & TRẠNG THÁI */}
                          <div className="flex flex-col items-start lg:items-end justify-center gap-2">
                             <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-xl border ${
                              acc.bot_status === 'Running' ? 'bg-green-950/60 text-green-400 border-green-800' : 'bg-yellow-950/60 text-yellow-400 border-yellow-800'
                            }`}>
                              <span className={`w-2 h-2 rounded-full ${acc.bot_status === 'Running' ? 'bg-green-400 animate-pulse' : 'bg-yellow-400'}`}></span>
                              {acc.bot_status || 'Pending'}
                            </span>
                            <button onClick={() => handleDelete(acc.id)} className="text-xs text-red-500 hover:text-red-400 underline">
                              Xóa tài khoản
                            </button>
                          </div>
                        </div>

                        {/* Hàng 2: GHI CHÚ NỘI BỘ (MỚI THÊM) */}
                        <div className="bg-gray-950 border border-gray-800 rounded-xl p-3 flex justify-between items-start gap-4 shadow-inner">
                          <div className="flex-1">
                            <div className="text-xs text-gray-500 font-bold mb-1">📝 GHI CHÚ (Tên khách / Tên VPS / Tên Bot / Tình trạng)</div>
                            <div className="text-sm text-yellow-400 font-medium whitespace-pre-wrap">
                              {acc.custom_notes || <span className="text-gray-600 italic">Chưa có ghi chú...</span>}
                            </div>
                          </div>
                          <button 
                            onClick={() => handleUpdateNote(acc.id, acc.custom_notes)}
                            className="bg-gray-800 hover:bg-gray-700 text-gray-300 text-[11px] font-bold px-3 py-1.5 rounded-lg border border-gray-700 shrink-0 transition"
                          >
                            ✏️ Sửa Note
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
                <button onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))} disabled={currentPage === 1} className="px-4 py-2 bg-gray-950 border border-gray-800 rounded-xl text-xs font-semibold hover:bg-gray-800 disabled:opacity-50">Trước</button>
                <button onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages} className="px-4 py-2 bg-gray-950 border border-gray-800 rounded-xl text-xs font-semibold hover:bg-gray-800 disabled:opacity-50">Sau</button>
              </div>
            </div>
          )}
        </div>

      </div>
    </main>
  );
}
