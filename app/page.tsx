import Link from 'next/link';

export default function LandingPage() {
  const zaloLink = "https://zalo.me/g/t3mp48v01wxyk6fcvx0d"; 

  return (
    <main className="min-h-screen bg-gray-950 text-gray-100 font-sans selection:bg-blue-500/30 overflow-hidden">
      
      {/* NAVBAR */}
      <nav className="border-b border-gray-800 bg-gray-900/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="font-black text-2xl tracking-tighter text-white">
            EA <span className="text-blue-500">HELPER</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="text-sm font-semibold text-gray-300 hover:text-white transition">
              Tra cứu hiệu suất
            </Link>
            <a href={zaloLink} target="_blank" rel="noopener noreferrer" className="hidden sm:inline-block bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold px-4 py-2 rounded-lg transition shadow-lg shadow-blue-600/20">
              Vào Group Zalo
            </a>
          </div>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section className="max-w-5xl mx-auto px-6 py-20 md:py-28 text-center relative">
        {/* Background Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/20 rounded-full blur-[120px] -z-10"></div>
        
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-900/30 border border-blue-800/50 text-blue-400 text-sm font-medium mb-8">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-blue-500"></span>
          </span>
          Hệ thống đang mở cho anh em trải nghiệm
        </div>
        
        <h1 className="text-5xl md:text-7xl font-black text-white leading-[1.1] mb-6 tracking-tight">
          Muốn Chạy EA Nhưng <br className="hidden md:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-500">Ngại Kỹ Thuật?</span>
        </h1>
        
        <p className="text-lg md:text-xl text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed">
          Nền tảng sinh ra để biến việc vận hành Bot giao dịch trở nên đơn giản. Bạn chỉ cần đưa yêu cầu – EA HELPER sẽ lo toàn bộ khâu setup, hạ tầng VPS và quản lý kỹ thuật từ A-Z.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a href={zaloLink} target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white text-lg font-bold px-8 py-4 rounded-xl transition shadow-lg shadow-blue-600/30">
            🚀 Inbox Đăng Ký Ngay
          </a>
          <Link href="/dashboard" className="w-full sm:w-auto bg-gray-900 border border-gray-700 hover:bg-gray-800 text-white text-lg font-bold px-8 py-4 rounded-xl transition">
            📊 Xem Dashboard Mẫu
          </Link>
        </div>

        {/* THỐNG KÊ NHANH (TRUST METRICS) */}
        <div className="mt-16 pt-8 border-t border-gray-800/50 flex flex-wrap justify-center gap-8 md:gap-16">
          <div className="text-center">
            <div className="text-4xl font-black text-white">300+</div>
            <div className="text-sm text-gray-500 font-medium mt-1">Tài khoản đang chạy</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-black text-white">24/7</div>
            <div className="text-sm text-gray-500 font-medium mt-1">Giám sát VPS</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-black text-white">0</div>
            <div className="text-sm text-gray-500 font-medium mt-1">Yêu cầu kỹ thuật</div>
          </div>
        </div>
      </section>

      {/* NỖI ĐAU (THE PROBLEM) */}
      <section className="bg-gray-900/50 border-y border-gray-800 py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Vì sao anh em có EA ngon <br className="sm:hidden" /> nhưng mãi chưa dám chạy?</h2>
            <p className="text-gray-400 text-lg">Rào cản lớn nhất không phải là không có Bot, mà là những câu hỏi đau đầu:</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 max-w-5xl mx-auto">
            {[
              'Thuê và cấu hình VPS ở đâu cho mượt?', 
              'Cài đặt phần mềm MT5 trên máy chủ thế nào?', 
              'EA bỏ vào thư mục nào mới đúng chuẩn?', 
              'Set thông số (Parameters) ra sao để không lỗi?', 
              'Kết nối tài khoản giao dịch như thế nào?', 
              '“Cài kiểu gì đây?” 😅'
            ].map((item, i) => (
              <div key={i} className="bg-gray-950 border border-gray-800 p-6 rounded-2xl flex items-start gap-4 hover:border-gray-700 transition">
                <div className="text-red-400 text-xl mt-0.5">❌</div>
                <div className="text-gray-300 font-medium leading-relaxed">{item}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* GIẢI PHÁP (THE SOLUTION) */}
      <section className="py-24 max-w-6xl mx-auto px-6">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          <div className="lg:w-1/2 space-y-6">
            <div className="inline-block px-3 py-1 bg-blue-900/40 text-blue-400 rounded-lg text-sm font-bold">GIẢI PHÁP TOÀN DIỆN</div>
            <h2 className="text-3xl md:text-4xl font-bold text-white leading-tight">
              EA HELPER – Nền tảng <br />
              <span className="text-blue-500">"Zero Kỹ Thuật"</span> dành cho bạn
            </h2>
            <p className="text-gray-400 text-lg leading-relaxed">
              Chúng tôi mang đến một nền tảng quản lý dành riêng cho những nhà đầu tư muốn tận dụng sức mạnh của Auto-Trading mà không cần phải tự mày mò.
            </p>
            <ul className="space-y-5 pt-4">
              <li className="flex items-start gap-4 text-gray-300">
                <span className="w-7 h-7 rounded-full bg-green-900/30 text-green-400 flex items-center justify-center font-bold shrink-0 mt-0.5">✓</span>
                <div><span className="text-white font-bold">Không rành cài đặt?</span> Đội ngũ hệ thống hỗ trợ setup chuẩn 100%.</div>
              </li>
              <li className="flex items-start gap-4 text-gray-300">
                <span className="w-7 h-7 rounded-full bg-green-900/30 text-green-400 flex items-center justify-center font-bold shrink-0 mt-0.5">✓</span>
                <div><span className="text-white font-bold">Tối ưu chi phí:</span> Không cần tự thuê hay duy trì máy chủ VPS đắt đỏ, phức tạp.</div>
              </li>
              <li className="flex items-start gap-4 text-gray-300">
                <span className="w-7 h-7 rounded-full bg-green-900/30 text-green-400 flex items-center justify-center font-bold shrink-0 mt-0.5">✓</span>
                <div><span className="text-white font-bold">Vốn nhỏ vẫn chạy:</span> Chạy 1-2 tài khoản hệ thống vẫn hỗ trợ nhiệt tình.</div>
              </li>
              <li className="flex items-start gap-4 text-gray-300">
                <span className="w-7 h-7 rounded-full bg-green-900/30 text-green-400 flex items-center justify-center font-bold shrink-0 mt-0.5">✓</span>
                <div><span className="text-white font-bold">Kiểm soát hoàn toàn:</span> Xem P/L, Drawdown qua Client Dashboard ở bất cứ đâu.</div>
              </li>
            </ul>
          </div>
          
          <div className="lg:w-1/2 w-full">
            <div className="bg-gradient-to-tr from-blue-900/20 to-purple-900/20 border border-gray-800 p-6 md:p-8 rounded-3xl shadow-2xl relative">
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-blue-500/20 blur-2xl rounded-full"></div>
              <div className="bg-gray-950 border border-gray-800 rounded-2xl p-6 space-y-4 shadow-xl">
                <div className="flex items-center justify-between border-b border-gray-800 pb-4">
                  <div className="text-white font-bold flex items-center gap-2">
                    <span className="text-xl">📊</span> Client Dashboard
                  </div>
                  <div className="text-green-400 text-xs font-mono flex items-center gap-2 px-2 py-1 bg-green-900/20 rounded-md border border-green-800/50">
                    <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span> Đồng bộ MT5
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-900 p-4 rounded-xl border border-gray-800">
                    <div className="text-xs text-gray-500">Lợi nhuận tuần này</div>
                    <div className="text-xl font-bold text-green-400 mt-1">+$325.50</div>
                  </div>
                  <div className="bg-gray-900 p-4 rounded-xl border border-gray-800">
                    <div className="text-xs text-gray-500">Drawdown cao nhất</div>
                    <div className="text-xl font-bold text-red-400 mt-1">2.15%</div>
                  </div>
                  <div className="bg-gray-900 p-4 rounded-xl border border-gray-800">
                    <div className="text-xs text-gray-500">Lệnh đang mở</div>
                    <div className="text-xl font-bold text-purple-400 mt-1">4 lệnh</div>
                  </div>
                  <div className="bg-gray-900 p-4 rounded-xl border border-gray-800">
                    <div className="text-xs text-gray-500">Tổng Lot</div>
                    <div className="text-xl font-bold text-yellow-400 mt-1">12.50</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="bg-gray-900/50 border-y border-gray-800 py-24">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-16">3 Bước Đơn Giản Để Bắt Đầu</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8">
            <div className="bg-gray-950 border border-gray-800 p-8 rounded-3xl relative hover:border-blue-500/50 transition duration-300">
              <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-black text-xl shadow-lg shadow-blue-600/30">1</div>
              <h3 className="text-xl font-bold text-white mt-6 mb-3">Cung Cấp Thông Tin</h3>
              <p className="text-gray-400 text-sm leading-relaxed">Gửi thông tin tài khoản MT5 và yêu cầu chiến thuật (VD: DCA 15 giá, rủi ro thấp...) qua hệ thống tiếp nhận của chúng tôi.</p>
            </div>
            <div className="bg-gray-950 border border-gray-800 p-8 rounded-3xl relative hover:border-blue-500/50 transition duration-300">
              <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-black text-xl shadow-lg shadow-blue-600/30">2</div>
              <h3 className="text-xl font-bold text-white mt-6 mb-3">Hệ Thống Setup</h3>
              <p className="text-gray-400 text-sm leading-relaxed">EA HELPER tiếp nhận, cấu hình máy chủ VPS tốc độ cao, cài đặt và khởi chạy Bot theo đúng thông số đã thỏa thuận.</p>
            </div>
            <div className="bg-gray-950 border border-gray-800 p-8 rounded-3xl relative hover:border-blue-500/50 transition duration-300">
              <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-black text-xl shadow-lg shadow-blue-600/30">3</div>
              <h3 className="text-xl font-bold text-white mt-6 mb-3">Theo Dõi Lợi Nhuận</h3>
              <p className="text-gray-400 text-sm leading-relaxed">Bạn được cấp link Dashboard. Chỉ cần nhập Email để xem 12 thông số hiệu suất cập nhật Real-time từ VPS.</p>
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS (ĐÁNH GIÁ TỪ KHÁCH HÀNG) */}
      <section className="py-24 max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Đánh giá từ anh em cộng đồng</h2>
          <p className="text-gray-400 text-lg">Hơn 300+ tài khoản đang được vận hành mượt mà mỗi ngày.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Card 1 */}
          <div className="bg-gray-900 border border-gray-800 p-6 rounded-2xl">
            <div className="flex text-yellow-400 text-sm mb-4">★★★★★</div>
            <p className="text-gray-300 text-sm italic mb-6 leading-relaxed">"Trước đây tự thuê VPS cài mãi không xong, mua EA về vứt xó. Giờ giao hết cho EA Helper, mỗi ngày chỉ việc mở web lên xem lãi. Quá nhàn!"</p>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-rose-500 rounded-full flex items-center justify-center text-white font-bold">L</div>
              <div>
                <div className="text-white font-bold text-sm">Chị Linh</div>
                <div className="text-xs text-gray-500">Khách hàng chạy 3 tài khoản</div>
              </div>
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-gray-900 border border-gray-800 p-6 rounded-2xl">
            <div className="flex text-yellow-400 text-sm mb-4">★★★★★</div>
            <p className="text-gray-300 text-sm italic mb-6 leading-relaxed">"Mình vốn nhỏ chỉ 500$ nhưng anh em support vẫn rất nhiệt tình. Tuyệt vời nhất là cái bảng Dashboard xem profit real-time trên điện thoại, rất chuyên nghiệp."</p>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-white font-bold">U</div>
              <div>
                <div className="text-white font-bold text-sm">Bạn Uyên</div>
                <div className="text-xs text-gray-500">Nhà đầu tư cá nhân</div>
              </div>
            </div>
          </div>

          {/* Card 3 */}
          <div className="bg-gray-900 border border-gray-800 p-6 rounded-2xl">
            <div className="flex text-yellow-400 text-sm mb-4">★★★★★</div>
            <p className="text-gray-300 text-sm italic mb-6 leading-relaxed">"Mình dân văn phòng không biết tí gì về code hay cách cài MT5. Chỉ cần gửi đúng cái số tài khoản và pass, admin lo từ A-Z. Vote 5 sao cho dịch vụ."</p>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center text-white font-bold">M</div>
              <div>
                <div className="text-white font-bold text-sm">Anh Minh</div>
                <div className="text-xs text-gray-500">Đầu tư dài hạn</div>
              </div>
            </div>
          </div>

          {/* Card 4 */}
          <div className="bg-gray-900 border border-gray-800 p-6 rounded-2xl">
            <div className="flex text-yellow-400 text-sm mb-4">★★★★★</div>
            <p className="text-gray-300 text-sm italic mb-6 leading-relaxed">"Chạy mượt, không bị miss lệnh do sập VPS như đợt trước mình tự làm. Rất yên tâm giao tài khoản cho anh em EA Helper vận hành. Sẽ còn giới thiệu thêm bạn bè."</p>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-full flex items-center justify-center text-white font-bold">Q</div>
              <div>
                <div className="text-white font-bold text-sm">Bạn Quang</div>
                <div className="text-xs text-gray-500">Quản lý quỹ nhỏ</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA FOOTER */}
      <section className="py-24 max-w-4xl mx-auto px-6 text-center">
        <div className="bg-gradient-to-b from-blue-900/20 to-gray-950 border border-blue-900/30 p-10 md:p-16 rounded-3xl shadow-2xl flex flex-col items-center relative overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-blue-500/10 blur-[100px] -z-10"></div>
          
          <h2 className="text-3xl md:text-5xl font-black text-white mb-6">Sẵn Sàng Để Bot Làm Việc Thay Bạn?</h2>
          <p className="text-gray-400 mb-10 text-lg max-w-2xl">Đừng để rào cản kỹ thuật làm chậm tốc độ kiếm tiền của bạn. Hãy để chúng tôi lo phần hệ thống khó nhất.</p>
          
          <div className="flex flex-col sm:flex-row items-center gap-4 w-full justify-center">
            <a href={zaloLink} target="_blank" rel="noopener noreferrer" className="bg-blue-600 hover:bg-blue-700 text-white text-xl font-bold px-10 py-5 rounded-2xl transition shadow-xl shadow-blue-600/30 w-full sm:w-auto flex items-center justify-center gap-3">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 2C6.48 2 2 6.48 2 12c0 1.7.45 3.31 1.25 4.75L2 22l5.36-1.12C8.75 21.6 10.33 22 12 22c5.52 0 10-4.48 10-10S17.52 2 12 2zm4.81 14.33c-.22.61-1.27 1.15-1.78 1.21-.42.05-1 .18-3.08-.68-2.5-1.03-4.14-3.6-4.27-3.77-.13-.18-1.02-1.36-1.02-2.6 0-1.23.64-1.84.87-2.09.23-.25.5-.31.67-.31.17 0 .34 0 .49.01.16.01.38-.06.59.45.22.52.71 1.74.77 1.87.06.13.11.28.02.46-.08.18-.13.28-.25.42-.13.14-.26.31-.38.42-.11.11-.23.23-.1.45.13.22.58.96 1.25 1.56.87.77 1.58 1.01 1.8 1.12.22.11.35.09.48-.05.14-.15.61-.71.77-.96.16-.25.33-.21.53-.13.21.08 1.32.62 1.54.74.22.11.37.17.42.27.06.1.06.56-.16 1.17z"/></svg>
              Inbox Zalo Ngay
            </a>
          </div>
          <p className="mt-6 text-sm text-gray-500">Hoặc liên hệ admin Zalo: <span className="text-blue-400 font-semibold">EA Helper System</span></p>
        </div>
      </section>

      <footer className="border-t border-gray-800/50 py-10 text-center text-sm text-gray-500">
        <p>© {new Date().getFullYear()} EA HELPER PLATFORM. Giải pháp tự động hóa giao dịch.</p>
      </footer>

    </main>
  );
}
