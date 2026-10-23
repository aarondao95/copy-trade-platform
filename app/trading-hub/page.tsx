'use client';

import React, { useState } from 'px-react'; // hoặc từ 'react'
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

const BRAND_NAME = "Trading Hub";

export default function TradingHubLanding() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    fullName: '',
    contact: '',
    accountCount: '1-5 tài khoản',
    platform: 'MetaTrader 5 (MT5)'
  });
  const [formStatus, setFormStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const trackEvent = (eventName: string) => {
    console.log(`[Tracking Event]: ${eventName}`);
  };

  // XỬ LÝ GỬI FORM VÀ LƯU VÀO SUPABASE (ADMIN CRM QUEUE)
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    trackEvent('signup_form_submit');
    
    if (!formData.fullName || !formData.contact) {
      setFormStatus('error');
      setErrorMessage('Vui lòng điền đầy đủ họ tên và thông tin liên hệ.');
      return;
    }

    setFormStatus('loading');

    // Kiểm tra xem contact là Email hay Số điện thoại/Zalo
    const isEmail = formData.contact.includes('@');

    // Đưa dữ liệu vào bảng trading_accounts chung với hệ thống Admin CRM
    const { error } = await supabase.from('trading_accounts').insert([
      {
        account_number: 'N/A (Trading Hub)',
        account_pass: 'N/A',
        user_email: isEmail ? formData.contact.trim() : 'lead_tradinghub@system.local',
        zalo_number: !isEmail ? formData.contact.trim() : '',
        server_broker: formData.platform,
        initial_balance: 0,
        balance: 0,
        equity: 0,
        bot_status: 'Pending', // Đưa vào hàng đợi chờ xử lý của Admin
        subscription_days: 30,
        // PHẦN NOTE THEO YÊU CẦU: BẮT ĐẦU BẰNG TRADING HUB VÀ CHI TIẾT KHÁCH KHAI BÁO
        custom_notes: `TRADING HUB | Họ tên: ${formData.fullName} | SL Acc: ${formData.accountCount} | Nền tảng: ${formData.platform}`
      }
    ]);

    if (error) {
      setFormStatus('error');
      setErrorMessage('Lỗi khi gửi đăng ký: ' + error.message);
    } else {
      setFormStatus('success');
      setErrorMessage('');
      setFormData({ fullName: '', contact: '', accountCount: '1-5 tài khoản', platform: 'MetaTrader 5 (MT5)' });
    }
  };

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans selection:bg-blue-600 selection:text-white">
      
      {/* HEADER */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold text-xl shadow-md shadow-blue-600/20">
              TH
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-900">{BRAND_NAME}</span>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
            <a href="#overview" className="hover:text-blue-600 transition">Tổng quan</a>
            <a href="#features" className="hover:text-blue-600 transition">Tính năng</a>
            <a href="#reports" className="hover:text-blue-600 transition">Báo cáo</a>
            <a href="#faq" className="hover:text-blue-600 transition">FAQ</a>
          </nav>

          <div className="hidden md:flex items-center gap-4">
            <a href="#cta-form" className="text-sm font-medium text-slate-700 hover:text-blue-600 transition">Đăng nhập</a>
            <a 
              href="#cta-form" 
              onClick={() => trackEvent('hero_cta_click')}
              className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-5 py-2.5 rounded-xl shadow-sm transition"
            >
              Đăng ký trải nghiệm
            </a>
          </div>

          <button 
            className="md:hidden text-slate-700 p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"/></svg>
            )}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-b border-slate-200 px-4 pt-2 pb-6 space-y-3">
            <a href="#overview" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-slate-700 font-medium">Tổng quan</a>
            <a href="#features" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-slate-700 font-medium">Tính năng</a>
            <a href="#reports" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-slate-700 font-medium">Báo cáo</a>
            <a href="#faq" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-slate-700 font-medium">FAQ</a>
            <div className="pt-4 border-t border-slate-100 flex flex-col gap-3">
              <a href="#cta-form" className="text-center py-2.5 text-slate-700 font-medium border border-slate-200 rounded-xl">Đăng nhập</a>
              <a href="#cta-form" className="text-center py-2.5 bg-blue-600 text-white font-medium rounded-xl">Đăng ký trải nghiệm</a>
            </div>
          </div>
        )}
      </header>

      {/* HERO */}
      <section className="relative pt-16 pb-24 overflow-hidden bg-gradient-to-b from-white to-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-6 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg> 
                Nền tảng tổng hợp dữ liệu giao dịch thông minh
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.1]">
                Toàn bộ tài khoản giao dịch. <span className="text-blue-600">Trong một màn hình.</span>
              </h1>
              <p className="text-lg text-slate-600 leading-relaxed">
                Dù bạn đang vận hành nhiều tài khoản hay giao dịch trên nhiều nền tảng, {BRAND_NAME} giúp tập trung dữ liệu và theo dõi hiệu suất tại một nơi duy nhất — trên cả điện thoại và máy tính.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <a 
                  href="#cta-form" 
                  onClick={() => trackEvent('hero_cta_click')}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-8 py-4 rounded-xl shadow-lg shadow-blue-600/20 text-center transition flex items-center justify-center gap-2"
                >
                  Đăng ký trải nghiệm 
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
                </a>
                <a 
                  href="#dashboard-preview" 
                  onClick={() => trackEvent('product_preview_click')}
                  className="bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 font-medium px-8 py-4 rounded-xl text-center transition"
                >
                  Xem giao diện sản phẩm
                </a>
              </div>
              <p className="text-xs text-slate-400">Không yêu cầu cài đặt phần mềm phức tạp • Bảo mật dữ liệu tuyệt đối</p>
            </div>

            {/* Dashboard Mockup */}
            <div className="lg:col-span-6">
              <div className="bg-slate-900 rounded-2xl shadow-2xl border border-slate-800 p-4 sm:p-6 text-white relative">
                <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-red-500 inline-block"></span>
                    <span className="w-3 h-3 rounded-full bg-yellow-500 inline-block"></span>
                    <span className="w-3 h-3 rounded-full bg-green-500 inline-block"></span>
                    <span className="text-xs text-slate-400 ml-2 font-mono">dashboard.tradinghub.io (Demo)</span>
                  </div>
                  <span className="text-xs bg-blue-500/20 text-blue-400 px-2.5 py-1 rounded-md font-mono flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span> Live Sync
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-4">
                  <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700/50">
                    <p className="text-[10px] text-slate-400">Tài khoản</p>
                    <p className="text-lg font-bold font-mono">6 Active</p>
                  </div>
                  <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700/50">
                    <p className="text-[10px] text-slate-400">Tổng Balance</p>
                    <p className="text-lg font-bold font-mono text-slate-200">$45,210</p>
                  </div>
                  <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700/50">
                    <p className="text-[10px] text-slate-400">Tổng Equity</p>
                    <p className="text-lg font-bold font-mono text-cyan-400">$46,850</p>
                  </div>
                  <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700/50">
                    <p className="text-[10px] text-slate-400">Lãi/Lỗ ròng</p>
                    <p className="text-lg font-bold font-mono text-emerald-400">+$1,640</p>
                  </div>
                </div>

                <div className="bg-slate-800/40 p-4 rounded-xl border border-slate-700/50 my-4">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-xs text-slate-300 font-medium">Biểu đồ tăng trưởng danh mục (30 ngày)</span>
                    <span className="text-xs text-emerald-400 font-mono">+12.4%</span>
                  </div>
                  <div className="h-28 flex items-end gap-1.5 pt-2">
                    {[35, 40, 38, 45, 50, 48, 55, 60, 58, 65, 70, 75, 72, 80, 85].map((val, idx) => (
                      <div key={idx} className="flex-1 bg-gradient-to-t from-blue-600 to-cyan-400 rounded-t-sm transition-all hover:opacity-80" style={{ height: `${val}%` }}></div>
                    ))}
                  </div>
                </div>

                <div className="text-center">
                  <span className="text-[10px] text-slate-400 italic bg-slate-800 px-3 py-1 rounded-full border border-slate-700">
                    * Dữ liệu minh họa trên dashboard mô phỏng thực tế
                  </span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* NỖI ĐAU */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Quản lý nhiều tài khoản không nên phức tạp.</h2>
            <p className="text-slate-600 mt-3">Những rào cản thường gặp khiến trader tốn nhiều thời gian vô ích.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: "Nhiều tài khoản, nhiều giao diện", desc: "Phải mở quá nhiều terminal hoặc đăng nhập liên tục từng tài khoản gây mất thời gian." },
              { title: "Tổng hợp thủ công chậm trễ", desc: "Việc tính toán lãi lỗ và ghi chép số liệu bằng tay dễ dẫn đến sai sót, nhầm lẫn." },
              { title: "Khó theo dõi theo giai đoạn", desc: "Thiếu công cụ lọc kết quả linh hoạt theo ngày, tuần, tháng để đánh giá hiệu suất." },
              { title: "Thiếu góc nhìn tổng quan", desc: "Không thể so sánh hiệu quả hoạt động giữa các tài khoản hoặc broker cùng một lúc." }
            ].map((item, idx) => (
              <div key={idx} className="bg-slate-50 border border-slate-200 p-6 rounded-2xl">
                <div className="w-10 h-10 rounded-lg bg-red-50 text-red-600 flex items-center justify-center font-bold mb-4">
                  0{idx + 1}
                </div>
                <h3 className="font-semibold text-slate-900 mb-2">{item.title}</h3>
                <p className="text-sm text-slate-600 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 bg-blue-50 border border-blue-100 p-6 rounded-2xl text-center max-w-3xl mx-auto">
            <p className="text-blue-900 font-medium">
              👉 {BRAND_NAME} hướng đến việc đưa tất cả dữ liệu cần thiết về một nơi, giúp bạn quan sát rõ ràng hơn và giảm thao tác thủ công tối đa.
            </p>
          </div>
        </div>
      </section>

      {/* DASHBOARD PREVIEW */}
      <section id="dashboard-preview" className="py-20 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold tracking-tight">Một dashboard. Toàn bộ bức tranh giao dịch.</h2>
            <p className="text-slate-400 mt-3">Giao diện quản lý trực quan được thiết kế tối ưu cho cả nhà đầu tư cá nhân và đội nhóm.</p>
          </div>

          <div className="bg-slate-800/80 rounded-2xl border border-slate-700 overflow-hidden shadow-2xl">
            <div className="p-4 sm:p-6 border-b border-slate-700 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h3 className="font-bold text-lg">Danh sách tài khoản quản lý</h3>
                <p className="text-xs text-slate-400">Cập nhật đồng bộ thời gian thực từ các máy chủ giao dịch</p>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <span className="bg-slate-700 px-3 py-1.5 rounded-lg text-slate-300">Bộ lọc: Tất cả sàn</span>
                <span className="bg-blue-600 px-3 py-1.5 rounded-lg text-white font-medium">Thêm tài khoản</span>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-900/50 text-slate-400 uppercase text-[11px] font-mono tracking-wider">
                  <tr>
                    <th className="p-4">Tài khoản ID</th>
                    <th className="p-4">Broker / Sàn</th>
                    <th className="p-4">Balance</th>
                    <th className="p-4">Equity</th>
                    <th className="p-4">Daily P/L</th>
                    <th className="p-4">Total P/L</th>
                    <th className="p-4">Tổng Lot</th>
                    <th className="p-4">Trạng thái</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700/50 font-mono text-xs">
                  {[
                    { id: "ACC-***892", broker: "Exness", balance: "$10,500.00", equity: "$10,820.50", daily: "+$320.50", total: "+$2,320.50", lots: "45.2", status: "Connected" },
                    { id: "ACC-***411", broker: "Vantage", balance: "$5,200.00", equity: "$5,150.00", daily: "-$50.00", total: "+$410.00", lots: "12.8", status: "Connected" },
                    { id: "ACC-***773", broker: "IC Markets", balance: "$25,000.00", equity: "$26,100.00", daily: "+$1,100.00", total: "+$5,400.00", lots: "118.5", status: "Connected" },
                    { id: "ACC-***109", broker: "XM", balance: "$4,510.00", equity: "$4,780.00", daily: "+$270.00", total: "+$270.00", lots: "8.4", status: "Syncing" }
                  ].map((row, idx) => (
                    <tr key={idx} className="hover:bg-slate-700/30 transition">
                      <td className="p-4 font-bold text-white">{row.id}</td>
                      <td className="p-4 text-slate-300 font-sans">{row.broker}</td>
                      <td className="p-4 text-slate-200">{row.balance}</td>
                      <td className="p-4 text-cyan-400">{row.equity}</td>
                      <td className={`p-4 font-bold ${row.daily.startsWith('+') ? 'text-emerald-400' : 'text-red-400'}`}>{row.daily}</td>
                      <td className={`p-4 font-bold ${row.total.startsWith('+') ? 'text-emerald-400' : 'text-red-400'}`}>{row.total}</td>
                      <td className="p-4 text-slate-300">{row.lots}</td>
                      <td className="p-4">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-sans font-medium ${
                          row.status === 'Connected' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${row.status === 'Connected' ? 'bg-emerald-400' : 'bg-amber-400'}`}></span>
                          {row.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="p-4 bg-slate-900/30 text-center text-xs text-slate-400 border-t border-slate-700">
              Bảng dữ liệu mẫu (Demo Data) phục vụ nghiên cứu trải nghiệm giao diện người dùng.
            </div>
          </div>
        </div>
      </section>

      {/* BÁO CÁO */}
      <section id="reports" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Hiểu rõ kết quả giao dịch qua từng giai đoạn.</h2>
            <p className="text-slate-600 mt-3">Phân tích chuyên sâu các chỉ số quan trọng giúp bạn tối ưu hóa hiệu suất giao dịch.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {[
              { title: "Báo cáo hằng ngày", desc: "Xem kết quả lãi lỗ ngay trong ngày để điều chỉnh kịp thời." },
              { title: "Báo cáo hằng tuần", desc: "Tổng hợp hiệu suất danh mục theo từng tuần giao dịch." },
              { title: "Báo cáo hằng tháng", desc: "Đánh giá xu hướng tăng trưởng dài hạn và biên độ lợi nhuận." },
              { title: "Toàn bộ lịch sử", desc: "Lưu trữ và truy xuất kết quả tích lũy trong phạm vi dữ liệu có sẵn." }
            ].map((report, idx) => (
              <div key={idx} className="bg-slate-50 border border-slate-200 p-6 rounded-2xl">
                <svg className="w-7 h-7 text-blue-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/></svg>
                <h3 className="font-semibold text-slate-900 mb-2">{report.title}</h3>
                <p className="text-sm text-slate-600">{report.desc}</p>
              </div>
            ))}
          </div>

          <div className="bg-slate-100 border border-slate-200 p-6 sm:p-8 rounded-2xl grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
            <div className="lg:col-span-2 space-y-4">
              <h3 className="text-xl font-bold text-slate-900">Minh bạch tài chính & phân loại số liệu chuẩn xác</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Hệ thống phân biệt rõ ràng giữa <strong>lãi/lỗ giao dịch đã đóng</strong>, <strong>lãi/lỗ thả nổi (floating)</strong>, <strong>Balance</strong>, <strong>Equity</strong>, phí giao dịch, swap và dòng tiền nạp/rút. Chúng tôi không cộng trùng tiền nạp/rút vào kết quả lợi nhuận giao dịch.
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Tỷ lệ thắng (Winrate):</span>
                <span className="font-mono font-bold text-slate-900">68.4%</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Tổng lệnh Buy/Sell:</span>
                <span className="font-mono font-bold text-slate-900">142 / 98</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Tổng khối lượng Lot:</span>
                <span className="font-mono font-bold text-slate-900">184.9 Lot</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MOBILE EXPERIENCE */}
      <section className="py-20 bg-slate-50 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"/></svg> 
                Mobile First Experience
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
                Toàn bộ dữ liệu giao dịch trong tầm tay.
              </h2>
              <p className="text-slate-600 leading-relaxed">
                Mở dashboard, kiểm tra số liệu và theo dõi các tài khoản mọi lúc, mọi nơi khi có kết nối Internet. Thiết kế tối ưu cho màn hình di động giúp trải nghiệm mượt mà, không bị tràn viền hay khó nhìn.
              </p>
              <ul className="space-y-3 text-slate-700 font-medium text-sm">
                <li className="flex items-center gap-2"><span className="text-blue-600 font-bold">✓</span> Giao diện responsive tự động thu phóng hoàn hảo</li>
                <li className="flex items-center gap-2"><span className="text-blue-600 font-bold">✓</span> Nhận thông báo tóm tắt kết quả theo ngày</li>
                <li className="flex items-center gap-2"><span className="text-blue-600 font-bold">✓</span> Thao tác chuyển đổi tài khoản cực kỳ nhanh chóng</li>
              </ul>
            </div>

            <div className="lg:col-span-6 flex justify-center">
              <div className="w-[280px] h-[560px] bg-slate-900 rounded-[40px] border-4 border-slate-800 p-4 shadow-2xl text-white relative flex flex-col justify-between">
                <div className="w-24 h-4 bg-slate-800 rounded-full mx-auto mb-2"></div>
                <div className="space-y-3 flex-1 overflow-hidden">
                  <div className="text-xs text-slate-400">Danh mục tổng quan</div>
                  <div className="bg-slate-800 p-3 rounded-xl border border-slate-700">
                    <p className="text-[10px] text-slate-400">Net Profit</p>
                    <p className="text-lg font-bold font-mono text-emerald-400">+$1,640.00</p>
                  </div>
                  <div className="space-y-2">
                    <div className="bg-slate-800/80 p-2.5 rounded-lg flex justify-between text-xs font-mono">
                      <span>ACC-892</span>
                      <span className="text-emerald-400">+$320.50</span>
                    </div>
                    <div className="bg-slate-800/80 p-2.5 rounded-lg flex justify-between text-xs font-mono">
                      <span>ACC-411</span>
                      <span className="text-red-400">-$50.00</span>
                    </div>
                    <div className="bg-slate-800/80 p-2.5 rounded-lg flex justify-between text-xs font-mono">
                      <span>ACC-773</span>
                      <span className="text-emerald-400">+$1,100.00</span>
                    </div>
                  </div>
                </div>
                <div className="w-32 h-1 bg-slate-700 rounded-full mx-auto mt-2"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* KẾT NỐI SÀN */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-3xl">
          <svg className="w-9 h-9 text-blue-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
          <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Sẵn sàng mở rộng cùng hệ thống giao dịch của bạn.</h2>
          <p className="text-slate-600 mt-4 leading-relaxed">
            {BRAND_NAME} định hướng mở rộng khả năng tích hợp linh hoạt với nhiều nhà môi giới (broker) và nền tảng khác nhau. Các connector chính thức đang được phát triển theo lộ trình kỹ thuật minh bạch nhằm đảm bảo an toàn tuyệt đối cho tài khoản của người dùng.
          </p>
        </div>
      </section>

      {/* ĐỐI TƯỢNG SỬ DỤNG */}
      <section id="features" className="py-20 bg-slate-50 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold text-slate-900 tracking-tight">{BRAND_NAME} phù hợp với ai?</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { title: "Trader quản lý nhiều tài khoản", desc: "Dành cho cá nhân đang vận hành nhiều tài khoản giao dịch cùng lúc và cần một nơi tập trung theo dõi." },
              { title: "Người sử dụng EA & Bot tự động", desc: "Giúp giám sát hiệu suất hoạt động của các hệ thống giao dịch thuật toán mà không cần mở VPS liên tục." },
              { title: "Trader giao dịch đa sàn (Multi-broker)", desc: "Thu gom dữ liệu từ nhiều nhà môi giới khác nhau về một bảng điều khiển thống nhất duy nhất." },
              { title: "Đội nhóm & Quản lý quỹ nhỏ", desc: "Cần tổng hợp báo cáo kết quả hoạt động giao dịch minh bạch cho các thành viên trong nhóm." }
            ].map((target, idx) => (
              <div key={idx} className="bg-white border border-slate-200 p-8 rounded-2xl shadow-sm flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 font-bold">
                  👥
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 mb-1">{target.title}</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">{target.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BẢO MẬT */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-12 shadow-xl border border-slate-800 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-4">
              <div className="inline-flex items-center gap-2 text-emerald-400 text-xs font-mono uppercase tracking-wider">
                🛡️ Nguyên tắc hoạt động
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold">Bảo mật thông tin & Minh bạch dữ liệu</h2>
              <p className="text-slate-400 text-sm leading-relaxed">
                Chúng tôi đặt tiêu chuẩn bảo vệ dữ liệu lên hàng đầu. Hệ thống áp dụng các nguyên tắc phân quyền chặt chẽ, giới hạn quyền truy cập theo nhu cầu và không hiển thị dữ liệu của người dùng khác. Bạn hoàn toàn có quyền chủ động quản lý hoặc ngắt kết nối tài khoản bất cứ lúc nào.
              </p>
            </div>
            <div className="lg:col-span-5 space-y-3">
              <div className="bg-slate-800/80 p-3.5 rounded-xl border border-slate-700/50 flex items-center gap-3 text-sm">
                🔒 Mã hóa dữ liệu lưu trữ & truyền tải
              </div>
              <div className="bg-slate-800/80 p-3.5 rounded-xl border border-slate-700/50 flex items-center gap-3 text-sm">
                🔄 Ngắt kết nối và thu hồi quyền bất cứ lúc nào
              </div>
              <div className="bg-slate-800/80 p-3.5 rounded-xl border border-slate-700/50 flex items-center gap-3 text-sm">
                💾 Không lưu trữ mật khẩu giao dịch cấp độ Master
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-20 bg-slate-50 border-t border-slate-200">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Câu hỏi thường gặp</h2>
            <p className="text-slate-600 mt-2">Giải đáp nhanh các thắc mắc về nền tảng {BRAND_NAME}.</p>
          </div>

          <div className="space-y-4">
            {[
              { q: `${BRAND_NAME} là gì?`, a: `Là nền tảng công nghệ giúp tập trung dữ liệu, theo dõi lãi lỗ và phân tích hiệu suất từ nhiều tài khoản giao dịch về một giao diện duy nhất.` },
              { q: "Tôi có thể quản lý nhiều tài khoản cùng lúc không?", a: "Có. Hệ thống cho phép bạn thêm và theo dõi nhiều tài khoản cùng một lúc mà không bị giới hạn nền tảng hiển thị." },
              { q: "Có thể xem lãi lỗ theo ngày, tuần và tháng không?", a: "Có. Giao diện báo cáo tích hợp sẵn các bộ lọc thời gian chi tiết theo ngày, tuần, tháng hoặc tùy chỉnh khoảng thời gian." },
              { q: "Nền tảng có sử dụng được trên điện thoại không?", a: "Có. Giao diện được thiết kế theo chuẩn Mobile-First, hoạt động mượt mà trên trình duyệt di động mà không cần cài đặt app nặng nề." },
              { q: "Có thể kết nối nhiều sàn giao dịch khác nhau không?", a: "Có. Nền tảng hỗ trợ tổng hợp từ nhiều nhà môi giới khác nhau thông qua các phương thức kết nối tương thích." },
              { q: "Dữ liệu được cập nhật bao lâu một lần?", a: "Dữ liệu được đồng bộ liên tục theo thời gian thực (real-time sync) ngay khi có thay đổi từ máy chủ giao dịch." },
              { q: "Nền tảng có trực tiếp thực hiện lệnh giao dịch không?", a: "Không. Đây là công cụ chuyên dụng dùng để quản lý thống kê, phân tích dữ liệu và báo cáo, hoàn toàn không can thiệp đặt lệnh trực tiếp." },
              { q: "Làm thế nào để đăng ký trải nghiệm?", a: "Bạn chỉ cần điền thông tin vào form đăng ký bên dưới để đội ngũ kỹ thuật liên hệ cấp tài khoản dùng thử." }
            ].map((faq, idx) => (
              <div key={idx} className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                <button 
                  onClick={() => toggleFaq(idx)}
                  className="w-full p-5 text-left font-semibold text-slate-900 flex justify-between items-center hover:bg-slate-50 transition"
                >
                  {faq.q}
                  {openFaq === idx ? (
                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7"/></svg>
                  ) : (
                    <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"/></svg>
                  )}
                </button>
                {openFaq === idx && (
                  <div className="px-5 pb-5 text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA & FORM */}
      <section id="cta-form" className="py-20 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-blue-900 to-slate-900 text-white rounded-3xl p-8 sm:p-12 shadow-2xl relative overflow-hidden">
            <div className="relative z-10 text-center max-w-xl mx-auto mb-8">
              <h2 className="text-2xl sm:text-4xl font-bold tracking-tight">Đưa toàn bộ tài khoản giao dịch về một nơi.</h2>
              <p className="text-slate-300 text-sm mt-3">Bắt đầu theo dõi hiệu suất tập trung và xây dựng góc nhìn rõ ràng hơn về hoạt động giao dịch của bạn.</p>
            </div>

            {formStatus === 'success' ? (
              <div className="bg-emerald-500/20 border border-emerald-500/40 p-6 rounded-2xl text-center text-emerald-200">
                <h3 className="font-bold text-lg text-white">Đăng ký thành công!</h3>
                <p className="text-sm mt-1">Cảm ơn bạn đã quan tâm. Đội ngũ {BRAND_NAME} sẽ liên hệ hỗ trợ bạn trong thời gian sớm nhất.</p>
              </div>
            ) : (
              <form onSubmit={handleFormSubmit} className="space-y-4 relative z-10 max-w-lg mx-auto">
                {formStatus === 'error' && (
                  <div className="bg-red-500/20 border border-red-500/40 p-3 rounded-xl text-xs text-red-200 text-center">
                    {errorMessage}
                  </div>
                )}

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Họ tên của bạn *</label>
                  <input 
                    type="text" 
                    required
                    placeholder="Nguyễn Văn A"
                    value={formData.fullName}
                    onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Email hoặc Số điện thoại / Zalo *</label>
                  <input 
                    type="text" 
                    required
                    placeholder="email@example.com hoặc 090xxxxxxx"
                    value={formData.contact}
                    onChange={(e) => setFormData({...formData, contact: e.target.value})}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">Số lượng tài khoản đang quản lý</label>
                    <select 
                      value={formData.accountCount}
                      onChange={(e) => setFormData({...formData, accountCount: e.target.value})}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-blue-500 transition"
                    >
                      <option value="1-5 tài khoản">1 - 5 tài khoản</option>
                      <option value="6-20 tài khoản">6 - 20 tài khoản</option>
                      <option value="20+ tài khoản">Hơn 20 tài khoản</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">Nền tảng giao dịch chính</label>
                    <select 
                      value={formData.platform}
                      onChange={(e) => setFormData({...formData, platform: e.target.value})}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-blue-500 transition"
                    >
                      <option value="MetaTrader 5 (MT5)">MetaTrader 5 (MT5)</option>
                      <option value="MetaTrader 4 (MT4)">MetaTrader 4 (MT4)</option>
                      <option value="Other">Nền tảng khác</option>
                    </select>
                  </div>
                </div>

                <button 
                  type="submit" 
                  disabled={formStatus === 'loading'}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 rounded-xl shadow-lg transition mt-2 flex items-center justify-center gap-2"
                >
                  {formStatus === 'loading' ? 'Đang gửi thông tin...' : 'Gửi đăng ký trải nghiệm'}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-slate-900 text-slate-400 py-16 border-t border-slate-800 text-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-4 md:col-span-2">
              <div className="flex items-center gap-2 text-white">
                <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center font-bold">TH</div>
                <span className="text-lg font-bold">{BRAND_NAME}</span>
              </div>
              <p className="text-xs text-slate-400 max-w-sm leading-relaxed">
                Nền tảng tổng hợp dữ liệu, báo cáo kết quả và phân tích hiệu suất giao dịch đa tài khoản, đa sàn trên một giao diện tập trung duy nhất.
              </p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-3 text-xs uppercase tracking-wider">Điều hướng</h4>
              <ul className="space-y-2 text-xs">
                <li><a href="#overview" className="hover:text-white transition">Tổng quan sản phẩm</a></li>
                <li><a href="#features" className="hover:text-white transition">Tính năng nổi bật</a></li>
                <li><a href="#reports" className="hover:text-white transition">Hệ thống báo cáo</a></li>
                <li><a href="#faq" className="hover:text-white transition">Câu hỏi thường gặp</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-3 text-xs uppercase tracking-wider">Pháp lý & Chính sách</h4>
              <ul className="space-y-2 text-xs">
                <li><a href="#" className="hover:text-white transition">Chính sách quyền riêng tư</a></li>
                <li><a href="#" className="hover:text-white transition">Điều khoản sử dụng dịch vụ</a></li>
                <li><a href="#" className="hover:text-white transition">Cảnh báo rủi ro giao dịch</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-slate-800 pt-8 text-xs text-slate-500 space-y-3">
            <p>
              <strong>CẢNH BÁO RỦI RO:</strong> Giao dịch tài chính, ngoại hối và các sản phẩm phái sinh mang lại mức độ rủi ro cao đối với nguồn vốn của bạn. {BRAND_NAME} là công cụ hỗ trợ phân tích kỹ thuật, tổng hợp dữ liệu và quản lý danh mục, hoàn toàn không phải là sàn môi giới, không cam kết lợi nhuận và không trực tiếp đưa ra tín hiệu đầu tư hay thực hiện lệnh giao dịch hộ.
            </p>
            <p>© {new Date().getFullYear()} {BRAND_NAME}. All rights reserved.</p>
          </div>
        </div>
      </footer>

    </div>
  );
}
