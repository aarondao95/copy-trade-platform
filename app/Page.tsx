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

  // Các trường thông tin chính
  const [accountNumber, setAccountNumber] = useState('');
  const [accountPass, setAccountPass] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [serverBroker, setServerBroker] = useState('');
  const [balance, setBalance] = useState('');
  const [customNotes, setCustomNotes] = useState(''); // Khớp với cột custom_notes trong Supabase
  const [submitting, setSubmitting] = useState(false);

  // Tìm kiếm & Phân trang
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 5;

  // Lấy dữ liệu từ Supabase (Đã sắp xếp theo id giảm dần để nhận diện khóa chính chuẩn)
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

  // 1. Thêm tài khoản mới
  async function handleAddAccount(e: React.FormEvent) {
    e.preventDefault();
    if (!accountNumber || !accountPass || !userEmail || !serverBroker || !balance) {
      alert('Vui lòng điền đầy đủ tất cả thông tin (bao gồm số dư)!');
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

  // 2. Xóa tài khoản dựa trên ID khóa chính
  async function handleDelete(id: any) {
    if (!confirm('Bạn có chắc chắn muốn xóa tài khoản này không?')) return;

    const { error } = await supabase.from('trading_accounts').delete().eq('id', id);
    if (error) {
      alert('Lỗi khi xóa: ' + error.message);
    } else {
      fetchAccounts();
    }
  }

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

  // Phân trang
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentAccounts = filteredAccounts.slice(indexOfFirstRow, indexOfLastRow);
  const totalPages = Math.ceil(filteredAccounts.length / rowsPerPage);

  // Tính tổng số dư của toàn bộ hệ thống
  const totalBalance = accounts.reduce((sum, acc) => sum + Number(acc.balance || 0), 0);

  return (
    <main className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* TIÊU ĐỀ & THỐNG KÊ TỔNG */}
        <div className="bg-white rounded-xl shadow-md p-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Quản lý Tài khoản Giao dịch</h1>
            <p className="text-sm text-gray-500 mt-1">Hệ thống quản trị thông tin tài khoản, mật khẩu, email, server và yêu cầu setup từ khách</p>
          </div>
          <div className="flex gap-3">
            <div className="bg-blue-50 text-blue-700 px-4 py-2 rounded-lg font-semibold text-sm">
              Tổng số: {accounts.length} tài khoản
            </div>
            <div className="bg-green-50 text-green-700 px-4 py-2 rounded-lg font-semibold text-sm">
              Tổng số dư: ${totalBalance.toLocaleString()}
            </div>
          </div>
        </div>

        {/* FORM THÊM MỚI */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2">➕ Thêm tài khoản mới</h2>
          
          <form onSubmit={handleAddAccount} className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tài khoản (ID MT4/MT5)</label>
              <input
                type="text"
                placeholder="Ví dụ: 88392011"
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
                className="w-full border rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Pass (Mật khẩu)</label>
              <input
                type="text"
                placeholder="Mật khẩu giao dịch"
                value={accountPass}
                onChange={(e) => setAccountPass(e.target.value)}
                className="w-full border rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                placeholder="khachhang@gmail.com"
                value={userEmail}
                onChange={(e) => setUserEmail(e.target.value)}
                className="w-full border rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Server broker</label>
              <input
                type="text"
                placeholder="Ví dụ: Exness-Real15"
                value={serverBroker}
                onChange={(e) => setServerBroker(e.target.value)}
                className="w-full border rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Số dư ($)</label>
              <input
                type="number"
                step="0.01"
                placeholder="1000"
                value={balance}
                onChange={(e) => setBalance(e.target.value)}
                className="w-full border rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Yêu cầu setup (Custom Notes)</label>
              <input
                type="text"
                placeholder="Ví dụ: DCA 15 giá, hệ số x1.2..."
                value={customNotes}
                onChange={(e) => setCustomNotes(e.target.value)}
                className="w-full border rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            <div className="md:col-span-3">
              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-blue-600 text-white font-medium py-2.5 rounded-lg hover:bg-blue-700 transition duration-200 disabled:bg-gray-400"
              >
                {submitting ? 'Đang thêm...' : 'Lưu tài khoản'}
              </button>
            </div>
          </form>
        </div>

        {/* DANH SÁCH & TÌM KIẾM */}
        <div className="bg-white rounded-xl shadow-md p-6 space-y-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <h2 className="text-lg font-bold text-gray-800">📋 Danh sách hệ thống</h2>
            <div className="w-full md:w-80">
              <input
                type="text"
                placeholder="🔍 Tìm kiếm tài khoản, email, yêu cầu..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
          </div>

          {errorMessage && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded text-sm">
              Lỗi: {errorMessage}
            </div>
          )}

          <div className="border rounded-lg overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead className="bg-gray-50 border-b text-gray-600">
                <tr>
                  <th className="p-3">Tài khoản</th>
                  <th className="p-3">Pass</th>
                  <th className="p-3">Email</th>
                  <th className="p-3">Server broker</th>
                  <th className="p-3">Yêu cầu setup</th>
                  <th className="p-3 text-right">Số dư</th>
                  <th className="p-3 text-center">Hành động</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={7} className="p-6 text-center text-gray-500">Đang tải dữ liệu...</td>
                  </tr>
                ) : currentAccounts.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-6 text-center text-gray-500">Chưa có dữ liệu phù hợp.</td>
                  </tr>
                ) : (
                  currentAccounts.map((acc: any) => (
                    <tr key={acc.id} className="border-b hover:bg-gray-50 transition">
                      <td className="p-3 font-mono font-bold text-blue-600">{acc.account_number}</td>
                      <td className="p-3 font-mono text-gray-600">{acc.account_pass}</td>
                      <td className="p-3 text-gray-800">{acc.user_email}</td>
                      <td className="p-3 font-medium text-gray-700">{acc.server_broker}</td>
                      <td className="p-3 font-medium text-purple-600">
                        {acc.custom_notes && acc.custom_notes.trim() !== '' ? acc.custom_notes : <span className="text-gray-400 font-normal">—</span>}
                      </td>
                      <td className="p-3 text-right font-bold text-green-600">
                        ${Number(acc.balance || 0).toLocaleString()}
                      </td>
                      <td className="p-3 text-center">
                        <button
                          onClick={() => handleDelete(acc.id)}
                          className="bg-red-500 text-white px-3 py-1 rounded text-xs hover:bg-red-600 transition"
                        >
                          Xóa
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* PHÂN TRANG */}
          {totalPages > 1 && (
            <div className="flex justify-between items-center pt-2">
              <span className="text-xs text-gray-500">
                Trang {currentPage} / {totalPages}
              </span>
              <div className="space-x-1">
                <button
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1 border rounded text-xs bg-white hover:bg-gray-100 disabled:opacity-50"
                >
                  Trang trước
                </button>
                <button
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 border rounded text-xs bg-white hover:bg-gray-100 disabled:opacity-50"
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
