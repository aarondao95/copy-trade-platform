'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function LandingPage() {
  const zaloLink = "https://zalo.me/g/t3mp48v01wxyk6fcvx0d";
  const portalLink = "https://eahelper-admin.vercel.app/portal";
  const dashboardLink = "/dashboard";

  // State cho Navbar & FAQ
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  // Xử lý hiệu ứng Sticky Navbar
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const faqs = [
    { q: "Tôi không biết cài EA thì sao?", a: "EA HELPER hỗ trợ phần setup theo quy trình của hệ thống. Bạn chỉ cần cung cấp tài khoản." },
    { q: "Tôi chỉ chạy 1 tài khoản có được không?", a: "Có. Chúng tôi hỗ trợ cả những nhà đầu tư cá nhân chạy từ 1 tài khoản với vốn nhỏ." },
    { q: "Tôi có cần tự quản lý VPS không?", a: "Nếu sử dụng hạ tầng của EA HELPER, bạn không cần tự thuê hay quản lý VPS. Chúng tôi lo toàn bộ hạ tầng 24/7." },
    { q: "Tôi có thể theo dõi EA ở đâu?", a: "Tất cả thông số lợi nhuận, drawdown, số lệnh sẽ được cập nhật real-time trên Dashboard cá nhân của bạn." },
    { q: "EA HELPER có đảm bảo lợi nhuận không?", a: "Không. EA HELPER là nền tảng quản lý hạ tầng. Lợi nhuận phụ thuộc vào cấu hình EA và thị trường." },
  ];

  return (
    <main className="min-h-screen bg-[#0B0F19] text-gray-300 font-sans selection:bg-blue-500/30 overflow-x-hidden relative">
      
      {/* BACKGROUND GLOWS (Style Vercel/Linear) */}
      <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-blue-600/10 blur-[120px] rounded-full pointer-events-none z-0"></div>
      
      {/* 1. SECTION: NAVBAR */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 border-b ${isScrolled ? 'bg-[#0B0F19]/80 backdrop-blur-lg border-white/10 py-3' : 'bg-transparent border-transparent py-5'}`}>
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          <div className="flex items-center gap-8">
            <Link href="/" className="font-black text-2xl tracking-tighter text-white flex items-center gap-2 z-50">
              EA<span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">HELPER</span>
            </Link>
            <div className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-400">
              <a href="#features" className="hover:text-white transition">Tính năng</a>
              <a href="#how-it-works" className="hover:text-white transition">Cách hoạt động</a>
              <a href="#pricing" className="hover:text-white transition">Bảng giá</a>
              <a href="#faq" className="hover:text-white transition">FAQ</a>
            </div>
          </div>
          
          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-4">
            <Link href={dashboardLink} className="text-sm font-semibold text-gray-300 hover:text-white transition">
              Đăng nhập Dashboard
            </Link>
            <Link href={portalLink} className="bg-white hover:bg-gray-100 text-[#0B0F19] text-sm font-bold px-5 py-2.5 rounded-lg transition shadow-[0_0_20px_rgba(255,255,255,0.1)]">
              Bắt đầu ngay
            </Link>
          </div>

          {/* Mobile Hamburger */}
          <button className="md:hidden text-white z-50" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={mobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}></path></svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden absolute top-0 left-0 w-full h-screen bg-[#0B0F19] flex flex-col items-center justify-center gap-6 text-lg font-medium z-40 border-b border-white/10">
            <Link href={portalLink} className="bg-blue-600 text-white px-8 py-3 rounded-xl w-[80%] text-center font-bold">🚀 Đăng ký tài khoản</Link>
            <Link href={dashboardLink} className="w-[80%] text-center py-3 border border-gray-700 rounded-xl">Đăng nhập Dashboard</Link>
            <a href="#features" onClick={() => setMobileMenuOpen(false)}>Tính năng</a>
            <a href="#pricing" onClick={() => setMobileMenuOpen(false)}>Bảng giá</a>
            <a href={zaloLink} target="_blank" className="text-blue-400">Hỗ trợ Zalo</a>
          </div>
        )}
      </nav>

      {/* 2. HERO SECTION */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 px-6 max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-12 z-10">
        <div className="lg:w-1/2 space-y-8">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold uppercase tracking-wider">
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span> Nền tảng quản lý EA hiện đại
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-white leading-[1.1] tracking-tight">
            CHẠY EA. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-400 to-teal-400">KHÔNG CẦN LO PHẦN KỸ THUẬT.</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-400 leading-relaxed max-w-xl">
            EA HELPER giúp bạn triển khai và quản lý EA Trading đơn giản hơn — từ setup tài khoản, hạ tầng VPS đến theo dõi trạng thái Real-time trên Dashboard.
          </p>
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <Link href={portalLink} className="w-full sm:w-auto bg-blue-600 hover:bg-blue-500 text-white text-lg font-bold px-8 py-4 rounded-xl transition shadow-lg shadow-blue-900/50 text-center">
              🚀 Bắt đầu với EA HELPER
            </Link>
            <Link href={dashboardLink} className="w-full sm:w-auto bg-transparent border border-gray-700 hover:bg-white/5 text-white text-lg font-bold px-8 py-4 rounded-xl transition text-center">
              Xem Dashboard Demo
            </Link>
          </div>
          <p className="text-sm text-gray-500">Dành cho nhà đầu tư cá nhân đang sử dụng EA trên MT4/MT5.</p>
        </div>
        
        {/* Mockup Dashboard SaaS */}
        <div className="lg:w-1/2 w-full perspective-1000">
          <div className="bg-[#131B2C] border border-white/10 rounded-2xl p-6 shadow-2xl shadow-blue-900/20 rotate-y-[-5deg] rotate-x-[5deg] transform-gpu hover:rotate-0 transition-transform duration-700">
            <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-4">
              <div className="text-white font-bold flex items-center gap-2">
                <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path></svg>
                Performance
              </div>
              <div className="flex gap-2">
                <span className="flex items-center gap-1.5 text-xs font-semibold px-2 py-1 bg-green-500/10 text-green-400 border border-green-500/20 rounded-md">
                   VPS: ONLINE
                </span>
                <span className="flex items-center gap-1.5 text-xs font-semibold px-2 py-1 bg-green-500/10 text-green-400 border border-green-500/20 rounded-md">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></span> EA: ONLINE
                </span>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="bg-white/5 border border-white/5 rounded-xl p-4">
                <div className="text-xs text-gray-500 mb-1">Balance</div>
                <div className="text-2xl font-bold font-mono text-white">$10,325.50</div>
              </div>
              <div className="bg-white/5 border border-white/5 rounded-xl p-4">
                <div className="text-xs text-gray-500 mb-1">Equity</div>
                <div className="text-2xl font-bold font-mono text-cyan-400">$10,284.20</div>
              </div>
              <div className="bg-white/5 border border-white/5 rounded-xl p-4">
                <div className="text-xs text-gray-500 mb-1">P/L Today</div>
                <div className="text-xl font-bold font-mono text-green-400">+$32.50</div>
              </div>
              <div className="bg-white/5 border border-white/5 rounded-xl p-4">
                <div className="text-xs text-gray-500 mb-1">Drawdown</div>
                <div className="text-xl font-bold font-mono text-red-400">2.15%</div>
              </div>
            </div>
            <div className="bg-white/5 border border-white/5 rounded-xl p-4 flex justify-between items-center">
               <div className="text-sm text-gray-400">Current Strategy:</div>
               <div className="text-sm font-semibold text-white">Gold EA V2.1 (DCA)</div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. PAIN POINT SECTION */}
      <section className="py-24 bg-[#0F1423] border-y border-white/5">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-16">Bạn muốn chạy EA nhưng <span className="text-blue-400">ngại phần kỹ thuật?</span></h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { t: "VPS", d: "Không muốn tự thuê, bảo mật và quản lý máy chủ VPS phức tạp." },
              { t: "MT5", d: "Không rành cài đặt, tối ưu hóa và cấu hình nền tảng MT5." },
              { t: "EA Setup", d: "Không biết set Input, thông số rủi ro sao cho EA không bị lỗi." },
              { t: "Monitoring", d: "Không muốn cắm mặt vào màn hình 24/7 để kiểm tra hệ thống." }
            ].map((p, i) => (
              <div key={i} className="bg-[#131B2C] border border-white/5 p-6 rounded-2xl text-left hover:border-white/20 transition">
                <div className="w-10 h-10 rounded-lg bg-red-500/10 flex items-center justify-center text-red-400 font-bold mb-4">✕</div>
                <h3 className="text-lg font-bold text-white mb-2">{p.t}</h3>
                <p className="text-sm text-gray-400">{p.d}</p>
              </div>
            ))}
          </div>
          <div className="mt-16 text-xl font-medium text-gray-300">
            👉 <span className="text-white font-bold">EA HELPER</span> được xây dựng để đơn giản hóa tất cả những phần này.
          </div>
        </div>
      </section>

      {/* 4. TARGET USER */}
      <section className="py-24 max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">EA HELPER dành cho ai?</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gradient-to-br from-[#131B2C] to-[#0B0F19] border border-white/5 p-8 rounded-2xl flex gap-6 items-start">
            <div className="w-12 h-12 shrink-0 rounded-full bg-blue-500/10 flex items-center justify-center text-2xl">👤</div>
            <div>
              <h3 className="text-xl font-bold text-white mb-2">Chạy ít tài khoản</h3>
              <p className="text-gray-400">Phù hợp với nhà đầu tư cá nhân chỉ chạy 1–5 tài khoản, không muốn mua VPS đắt đỏ.</p>
            </div>
          </div>
          <div className="bg-gradient-to-br from-[#131B2C] to-[#0B0F19] border border-white/5 p-8 rounded-2xl flex gap-6 items-start">
            <div className="w-12 h-12 shrink-0 rounded-full bg-blue-500/10 flex items-center justify-center text-2xl">⚡</div>
            <div>
              <h3 className="text-xl font-bold text-white mb-2">Không rành kỹ thuật</h3>
              <p className="text-gray-400">Không muốn mất thời gian học quản trị VPS, MT5 và cài đặt EA.</p>
            </div>
          </div>
          <div className="bg-gradient-to-br from-[#131B2C] to-[#0B0F19] border border-white/5 p-8 rounded-2xl flex gap-6 items-start">
            <div className="w-12 h-12 shrink-0 rounded-full bg-blue-500/10 flex items-center justify-center text-2xl">🤖</div>
            <div>
              <h3 className="text-xl font-bold text-white mb-2">Đã có sẵn EA</h3>
              <p className="text-gray-400">Bạn đã có chiến lược EA ngon và chỉ cần một nơi để triển khai nó thuận tiện nhất.</p>
            </div>
          </div>
          <div className="bg-gradient-to-br from-[#131B2C] to-[#0B0F19] border border-white/5 p-8 rounded-2xl flex gap-6 items-start">
            <div className="w-12 h-12 shrink-0 rounded-full bg-blue-500/10 flex items-center justify-center text-2xl">📊</div>
            <div>
              <h3 className="text-xl font-bold text-white mb-2">Muốn quản lý tập trung</h3>
              <p className="text-gray-400">Theo dõi trạng thái, lợi nhuận của tất cả tài khoản trên một Dashboard duy nhất.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. WHAT IS EA HELPER (Visual Flow) */}
      <section className="py-24 bg-[#0F1423] border-y border-white/5 text-center overflow-hidden">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">EA HELPER là gì?</h2>
          <p className="text-gray-400 text-lg mb-16 max-w-2xl mx-auto">
            EA HELPER là nền tảng hỗ trợ triển khai và quản lý EA Trading dành cho nhà đầu tư cá nhân.
          </p>
          
          <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8 font-mono text-sm md:text-base font-bold">
            <div className="bg-[#131B2C] border border-white/10 py-4 px-6 rounded-xl text-white shadow-lg">MT5 ACCOUNT</div>
            <div className="text-blue-500 hidden md:block">→</div><div className="text-blue-500 md:hidden">↓</div>
            <div className="bg-blue-600 border border-blue-500 py-4 px-6 rounded-xl text-white shadow-lg shadow-blue-600/30">EA HELPER</div>
            <div className="text-blue-500 hidden md:block">→</div><div className="text-blue-500 md:hidden">↓</div>
            <div className="bg-[#131B2C] border border-white/10 py-4 px-6 rounded-xl text-white shadow-lg">VPS / INFRA</div>
            <div className="text-blue-500 hidden md:block">→</div><div className="text-blue-500 md:hidden">↓</div>
            <div className="bg-[#131B2C] border border-white/10 py-4 px-6 rounded-xl text-white shadow-lg">EA EXECUTION</div>
            <div className="text-blue-500 hidden md:block">→</div><div className="text-blue-500 md:hidden">↓</div>
            <div className="bg-green-600/20 border border-green-500/30 text-green-400 py-4 px-6 rounded-xl shadow-lg">DASHBOARD</div>
          </div>

          <p className="mt-16 text-xl text-white font-medium">
            Bạn tập trung vào chiến lược. <span className="text-blue-400">EA HELPER hỗ trợ phần hệ thống.</span>
          </p>
        </div>
      </section>

      {/* 6. FEATURES */}
      <section id="features" className="py-24 max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Mọi thứ cần thiết để vận hành EA, đơn giản hơn.</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { i: "⚙️", t: "EA Setup", d: "Hỗ trợ cấu hình và triển khai EA chuẩn xác lên tài khoản MT5 của bạn." },
            { i: "🖥️", t: "VPS Infrastructure", d: "Hạ tầng máy chủ 24/7 ổn định, phục vụ riêng cho vận hành EA Trading." },
            { i: "👥", t: "Account Management", d: "Quản lý nhiều tài khoản giao dịch khác nhau trên cùng một hệ thống." },
            { i: "📡", t: "EA Monitoring", d: "Theo dõi trạng thái kết nối của EA và cảnh báo khi mất tín hiệu." },
            { i: "📈", t: "Performance Dashboard", d: "Tổng hợp Balance, Equity, Profit, Drawdown Real-time đẹp mắt." },
            { i: "👨‍💻", t: "Technical Support", d: "Hỗ trợ xử lý nhanh chóng khi gặp sự cố máy chủ hoặc lỗi kỹ thuật." }
          ].map((f, i) => (
            <div key={i} className="bg-[#131B2C] border border-white/5 p-8 rounded-2xl hover:bg-white/[0.02] transition cursor-default group">
              <div className="text-3xl mb-4 group-hover:scale-110 transition-transform origin-left">{f.i}</div>
              <h3 className="text-lg font-bold text-white mb-2">{f.t}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{f.d}</p>
            </div>
          ))}
        </div>
        <div className="text-center mt-12">
           <Link href={portalLink} className="inline-block bg-white hover:bg-gray-200 text-[#0B0F19] text-base font-bold px-8 py-3.5 rounded-xl transition">
              Bắt đầu với EA HELPER
           </Link>
        </div>
      </section>

      {/* 7. DASHBOARD DEMO */}
      <section className="py-24 bg-[#0F1423] border-y border-white/5 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Theo dõi EA của bạn trên một Dashboard duy nhất.</h2>
          <p className="text-gray-400 mb-12">Giao diện quản lý trực quan, không cần đăng nhập VPS.</p>
          
          <div className="bg-[#0B0F19] border border-white/10 rounded-2xl p-2 md:p-6 shadow-2xl mx-auto max-w-5xl">
            {/* Header Demo */}
            <div className="flex justify-between items-center bg-[#131B2C] p-4 rounded-xl border border-white/5 mb-4">
               <div className="text-white font-bold">Trading Overview (Demo Data)</div>
               <div className="text-sm bg-blue-500/20 text-blue-400 px-3 py-1 rounded-md">Live Update</div>
            </div>
            
            {/* Stats Demo */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
               {['Balance: $12,450', 'Profit Today: +$125', 'Drawdown: 1.2%', 'Open Orders: 5'].map((s, i) => (
                 <div key={i} className="bg-[#131B2C] border border-white/5 p-4 rounded-xl text-left">
                   <div className="text-white font-mono text-sm md:text-base font-bold">{s.split(':')[0]}</div>
                   <div className="text-gray-400 text-sm mt-1">{s.split(':')[1]}</div>
                 </div>
               ))}
            </div>

            {/* Table Demo */}
            <div className="overflow-x-auto bg-[#131B2C] border border-white/5 rounded-xl">
              <table className="w-full text-left text-sm whitespace-nowrap">
                <thead className="bg-white/5 text-gray-400">
                  <tr>
                    <th className="p-4 font-medium">Account</th>
                    <th className="p-4 font-medium">Broker</th>
                    <th className="p-4 font-medium">EA Status</th>
                    <th className="p-4 font-medium">Profit</th>
                  </tr>
                </thead>
                <tbody className="text-white">
                  <tr className="border-t border-white/5">
                    <td className="p-4 font-mono">1188204</td>
                    <td className="p-4">Exness-Real15</td>
                    <td className="p-4"><span className="text-green-400">Running</span></td>
                    <td className="p-4 text-green-400">+$82.50</td>
                  </tr>
                  <tr className="border-t border-white/5">
                    <td className="p-4 font-mono">3099121</td>
                    <td className="p-4">Vantage-Live</td>
                    <td className="p-4"><span className="text-green-400">Running</span></td>
                    <td className="p-4 text-green-400">+$42.00</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          
          <div className="mt-12">
            <Link href={dashboardLink} className="inline-block bg-transparent border border-gray-600 hover:border-white text-white text-base font-bold px-8 py-3.5 rounded-xl transition">
              👀 Xem Demo Thực Tế
            </Link>
          </div>
        </div>
      </section>

      {/* 8. HOW IT WORKS */}
      <section id="how-it-works" className="py-24 max-w-5xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Bắt đầu chỉ với 3 bước</h2>
        </div>
        <div className="relative border-l border-white/10 ml-4 md:ml-12 space-y-12 pb-4">
           
           <div className="relative pl-8 md:pl-16">
              <div className="absolute top-0 left-[-16px] w-8 h-8 bg-[#0B0F19] border-2 border-blue-500 rounded-full flex items-center justify-center text-xs font-bold text-blue-400">01</div>
              <h3 className="text-xl font-bold text-white mb-2">Khai báo tài khoản</h3>
              <p className="text-gray-400">Đăng ký thành viên trên EA HELPER và thêm thông tin tài khoản MT5 của bạn vào hệ thống.</p>
           </div>
           
           <div className="relative pl-8 md:pl-16">
              <div className="absolute top-0 left-[-16px] w-8 h-8 bg-[#0B0F19] border-2 border-blue-500 rounded-full flex items-center justify-center text-xs font-bold text-blue-400">02</div>
              <h3 className="text-xl font-bold text-white mb-2">Gửi yêu cầu setup</h3>
              <p className="text-gray-400">Chọn tệp EA của bạn và ghi chú các yêu cầu cấu hình (Input, thông số Lot, quản lý rủi ro).</p>
           </div>
           
           <div className="relative pl-8 md:pl-16">
              <div className="absolute top-0 left-[-16px] w-8 h-8 bg-[#0B0F19] border-2 border-blue-500 rounded-full flex items-center justify-center text-xs font-bold text-blue-400">03</div>
              <h3 className="text-xl font-bold text-white mb-2">Theo dõi</h3>
              <p className="text-gray-400">Chúng tôi tiến hành setup trên VPS riêng biệt. Bạn chỉ cần mở Dashboard để theo dõi kết quả giao dịch.</p>
           </div>

        </div>
      </section>

      {/* 9. VALUE STACK (Tự làm vs EA HELPER) */}
      <section className="py-24 bg-[#0F1423] border-y border-white/5">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-16">Thay vì tự xử lý tất cả...</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            <div className="bg-[#0B0F19] border border-red-900/30 p-8 rounded-2xl">
              <div className="text-gray-500 font-bold mb-6 tracking-widest text-sm">TỰ LÀM</div>
              <ul className="space-y-4 text-gray-400">
                <li className="flex gap-3"><span className="text-red-500 font-bold">✕</span> Tự tìm và mua VPS</li>
                <li className="flex gap-3"><span className="text-red-500 font-bold">✕</span> Tự cấu hình bảo mật máy chủ</li>
                <li className="flex gap-3"><span className="text-red-500 font-bold">✕</span> Tự tải và cài đặt MT5</li>
                <li className="flex gap-3"><span className="text-red-500 font-bold">✕</span> Chỉnh thông số EA thủ công</li>
                <li className="flex gap-3"><span className="text-red-500 font-bold">✕</span> Tự khắc phục lỗi khi sập nguồn</li>
                <li className="flex gap-3"><span className="text-red-500 font-bold">✕</span> Phải Login VPS liên tục để check</li>
              </ul>
            </div>

            <div className="bg-gradient-to-b from-[#131B2C] to-[#0B0F19] border border-blue-500/30 p-8 rounded-2xl relative shadow-[0_0_40px_rgba(59,130,246,0.1)]">
              <div className="text-blue-400 font-bold mb-6 tracking-widest text-sm">EA HELPER</div>
              <ul className="space-y-4 text-white">
                <li className="flex gap-3 items-center"><span className="w-5 h-5 rounded-full bg-green-500/20 text-green-400 flex items-center justify-center text-xs font-bold">✓</span> Hỗ trợ setup toàn bộ</li>
                <li className="flex gap-3 items-center"><span className="w-5 h-5 rounded-full bg-green-500/20 text-green-400 flex items-center justify-center text-xs font-bold">✓</span> Hạ tầng VPS tốc độ cao</li>
                <li className="flex gap-3 items-center"><span className="w-5 h-5 rounded-full bg-green-500/20 text-green-400 flex items-center justify-center text-xs font-bold">✓</span> Quản lý tài khoản tập trung</li>
                <li className="flex gap-3 items-center"><span className="w-5 h-5 rounded-full bg-green-500/20 text-green-400 flex items-center justify-center text-xs font-bold">✓</span> Bảng Dashboard Real-time</li>
                <li className="flex gap-3 items-center"><span className="w-5 h-5 rounded-full bg-green-500/20 text-green-400 flex items-center justify-center text-xs font-bold">✓</span> Giám sát kết nối (Monitoring)</li>
                <li className="flex gap-3 items-center"><span className="w-5 h-5 rounded-full bg-green-500/20 text-green-400 flex items-center justify-center text-xs font-bold">✓</span> Đội ngũ Technical Support</li>
              </ul>
            </div>

          </div>
        </div>
      </section>

      {/* 10. PRICING */}
      <section id="pricing" className="py-24 max-w-7xl mx-auto px-6 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Gói dịch vụ</h2>
        <p className="text-gray-400 mb-16">Chi phí linh hoạt phù hợp với quy mô đầu tư của bạn.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto text-left">
          {/* Starter */}
          <div className="bg-[#131B2C] border border-white/5 p-8 rounded-2xl flex flex-col">
            <h3 className="text-xl font-bold text-white mb-2">STARTER</h3>
            <p className="text-sm text-gray-400 mb-6 flex-1">Dành cho nhà đầu tư cá nhân muốn chạy 1-2 tài khoản EA thử nghiệm.</p>
            <div className="text-3xl font-black text-white mb-6">Liên hệ</div>
            <Link href={portalLink} className="w-full bg-white/10 hover:bg-white/20 text-white text-center py-3 rounded-lg font-bold transition">
              Đăng ký
            </Link>
          </div>
          
          {/* Pro */}
          <div className="bg-[#0B0F19] border border-blue-500/50 p-8 rounded-2xl flex flex-col relative shadow-[0_0_30px_rgba(59,130,246,0.15)] transform md:-translate-y-4">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full">POPULAR</div>
            <h3 className="text-xl font-bold text-white mb-2">PRO</h3>
            <p className="text-sm text-gray-400 mb-6 flex-1">Dành cho người có nhu cầu chạy nhiều tài khoản, yêu cầu VPS chuyên biệt và cấu hình riêng.</p>
            <div className="text-3xl font-black text-white mb-6">Liên hệ</div>
            <Link href={portalLink} className="w-full bg-blue-600 hover:bg-blue-500 text-white text-center py-3 rounded-lg font-bold transition">
              Đăng ký Pro
            </Link>
          </div>

          {/* Business */}
          <div className="bg-[#131B2C] border border-white/5 p-8 rounded-2xl flex flex-col">
            <h3 className="text-xl font-bold text-white mb-2">BUSINESS</h3>
            <p className="text-sm text-gray-400 mb-6 flex-1">Quản lý quỹ, IB hoặc khách hàng có nhu cầu custom setup toàn hệ thống lớn.</p>
            <div className="text-3xl font-black text-white mb-6">Liên hệ</div>
            <a href={zaloLink} target="_blank" className="w-full bg-white/10 hover:bg-white/20 text-white text-center py-3 rounded-lg font-bold transition">
              Liên hệ Zalo
            </a>
          </div>
        </div>
      </section>

      {/* 11. TRUST & SECURITY */}
      <section className="py-24 bg-[#0F1423] border-y border-white/5">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white mb-4">Tại sao chọn EA HELPER?</h2>
            <p className="text-gray-400">Bạn kiểm soát tài khoản của mình. Chúng tôi chỉ lo phần công nghệ.</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="bg-[#0B0F19] border border-white/5 p-6 rounded-xl">
               <h4 className="text-white font-bold mb-2 flex items-center gap-2"><span className="text-blue-500">🛡️</span> Phân quyền User/Admin</h4>
               <p className="text-sm text-gray-400">EA HELPER được thiết kế với hệ thống phân quyền rõ ràng, bạn chỉ xem được data của chính mình.</p>
            </div>
            <div className="bg-[#0B0F19] border border-white/5 p-6 rounded-xl">
               <h4 className="text-white font-bold mb-2 flex items-center gap-2"><span className="text-blue-500">🔒</span> Mật khẩu an toàn</h4>
               <p className="text-sm text-gray-400">Mật khẩu MT5 không hiển thị công khai trên UI, hạn chế tối đa rủi ro truy cập trái phép.</p>
            </div>
            <div className="bg-[#0B0F19] border border-white/5 p-6 rounded-xl">
               <h4 className="text-white font-bold mb-2 flex items-center gap-2"><span className="text-blue-500">🖥️</span> Quy trình setup minh bạch</h4>
               <p className="text-sm text-gray-400">Làm việc trực tiếp qua CRM nội bộ, cài đặt chuẩn chỉ trên các VPS sạch 100%.</p>
            </div>
            <div className="bg-[#0B0F19] border border-white/5 p-6 rounded-xl">
               <h4 className="text-white font-bold mb-2 flex items-center gap-2"><span className="text-blue-500">⚡</span> Hỗ trợ vận hành</h4>
               <p className="text-sm text-gray-400">Đội ngũ kỹ thuật hỗ trợ restart máy chủ, xử lý nghẽn mạng ngay khi phát sinh sự cố.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 12. FAQ */}
      <section id="faq" className="py-24 max-w-3xl mx-auto px-6">
        <h2 className="text-3xl font-bold text-white mb-10 text-center">Câu hỏi thường gặp</h2>
        <div className="space-y-4">
          {faqs.map((f, i) => (
            <div key={i} className="bg-[#131B2C] border border-white/5 rounded-xl overflow-hidden transition-all">
              <button 
                className="w-full text-left px-6 py-5 flex justify-between items-center text-white font-semibold hover:bg-white/5"
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
              >
                {f.q}
                <span className="text-blue-500 text-xl">{openFaq === i ? '−' : '+'}</span>
              </button>
              {openFaq === i && (
                <div className="px-6 pb-5 text-gray-400 text-sm leading-relaxed border-t border-white/5 pt-4">
                  {f.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* 13. FINAL CTA */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto bg-gradient-to-br from-blue-900/40 to-[#0B0F19] border border-blue-500/20 p-12 md:p-16 rounded-3xl text-center relative overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-blue-500/10 blur-[80px] -z-10"></div>
          <h2 className="text-3xl md:text-5xl font-black text-white mb-6">Sẵn sàng chạy EA đơn giản hơn?</h2>
          <p className="text-gray-400 text-lg mb-10">Không cần biến mình thành chuyên gia kỹ thuật. Hãy để EA HELPER hỗ trợ phần hệ thống.</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href={portalLink} className="w-full sm:w-auto bg-blue-600 hover:bg-blue-500 text-white text-lg font-bold px-10 py-4 rounded-xl transition shadow-xl shadow-blue-600/30">
              🚀 Bắt đầu với EA HELPER
            </Link>
            <a href={zaloLink} target="_blank" className="w-full sm:w-auto bg-white/5 hover:bg-white/10 border border-white/10 text-white text-lg font-bold px-8 py-4 rounded-xl transition">
              💬 Liên hệ Hỗ trợ
            </a>
          </div>
        </div>
      </section>

      {/* 14. FOOTER & DISCLAIMER */}
      <footer className="border-t border-white/5 pt-16 pb-8 bg-[#0B0F19]">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          <div className="md:col-span-2">
            <Link href="/" className="font-black text-2xl tracking-tighter text-white flex items-center gap-2 mb-4">
              EA<span className="text-blue-500">HELPER</span>
            </Link>
            <p className="text-gray-500 text-sm max-w-sm">Nền tảng hỗ trợ triển khai và quản lý EA Trading chuyên nghiệp dành cho nhà đầu tư cá nhân.</p>
          </div>
          <div>
            <h4 className="text-white font-bold mb-4">Navigation</h4>
            <ul className="space-y-2 text-sm text-gray-500">
              <li><a href="#" className="hover:text-white transition">Trang chủ</a></li>
              <li><a href="#features" className="hover:text-white transition">Tính năng</a></li>
              <li><a href="#pricing" className="hover:text-white transition">Bảng giá</a></li>
              <li><a href="#faq" className="hover:text-white transition">FAQ</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-bold mb-4">Support</h4>
            <ul className="space-y-2 text-sm text-gray-500">
              <li><Link href={dashboardLink} className="hover:text-white transition">Đăng nhập</Link></li>
              <li><Link href={portalLink} className="hover:text-white transition">Đăng ký tài khoản</Link></li>
              <li><a href={zaloLink} target="_blank" className="hover:text-blue-400 transition">Zalo Group</a></li>
            </ul>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 border-t border-white/5 pt-8 text-xs text-gray-600 text-center leading-relaxed">
          <p className="mb-4">
            <strong>DISCLAIMER:</strong> EA HELPER là nền tảng quản lý phần mềm và hạ tầng kỹ thuật. Chúng tôi <strong>không</strong> cam kết lợi nhuận, không lôi kéo đầu tư và không đảm bảo hiệu suất giao dịch. Kết quả giao dịch phụ thuộc hoàn toàn vào chiến lược EA của bạn, biến động thị trường và các yếu tố rủi ro liên quan.
          </p>
          <p>© {new Date().getFullYear()} EA HELPER. All rights reserved.</p>
        </div>
      </footer>

      {/* 15. MOBILE STICKY BOTTOM CTA */}
      <div className="md:hidden fixed bottom-0 left-0 w-full p-4 bg-[#0B0F19]/90 backdrop-blur-md border-t border-white/10 z-50">
         <Link href={portalLink} className="flex justify-center w-full bg-blue-600 text-white text-base font-bold px-4 py-3.5 rounded-xl shadow-[0_-5px_20px_rgba(37,99,235,0.2)]">
            🚀 Bắt đầu với EA HELPER
         </Link>
      </div>

    </main>
  );
}
