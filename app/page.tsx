import Link from 'next/link';
import Image from 'next/image';

export default function LandingPage() {
  const zaloLink = "https://zalo.me/g/t3mp48v01wxyk6fcvx0d"; // Đổi thành link thật của bạn

  return (
    <main className="min-h-screen bg-gray-950 text-gray-100 font-sans selection:bg-blue-500/30">
      
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
      <section className="max-w-5xl mx-auto px-6 py-20 md:py-32 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-900/30 border border-blue-800/50 text-blue-400 text-sm font-medium mb-6">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
          </span>
          Nền tảng đang mở cho anh em trải nghiệm
        </div>
        <h1 className="text-4xl md:text-6xl font-black text-white leading-tight mb-6">
          Muốn Chạy EA Nhưng <br className="hidden md:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">Ngại Kỹ Thuật?</span>
        </h1>
        <p className="text-lg md:text-xl text-gray-400 mb-10 max-w-3xl mx-auto leading-relaxed">
          Nền tảng sinh ra để biến việc vận hành Bot giao dịch trở nên đơn giản. Bạn chỉ cần đưa yêu cầu – EA HELPER sẽ lo toàn bộ khâu setup, hạ tầng VPS và quản lý kỹ thuật.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a href={zaloLink} target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white text-lg font-bold px-8 py-4 rounded-xl transition shadow-lg shadow-blue-600/30">
            🚀 Inbox Đăng Ký Ngay
          </a>
          <Link href="/dashboard" className="w-full sm:w-auto bg-gray-900 border border-gray-700 hover:bg-gray-800 text-white text-lg font-bold px-8 py-4 rounded-xl transition">
            📊 Xem Dashboard Mẫu
          </Link>
        </div>
      </section>

      {/* NỖI ĐAU (THE PROBLEM) */}
      <section className="bg-gray-900 border-y border-gray-800 py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">Vì sao anh em có EA ngon <br className="sm:hidden" /> nhưng mãi chưa dám chạy?</h2>
            <p className="text-gray-400">Rào cản lớn nhất không phải là không có Bot, mà là những câu hỏi đau đầu:</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {['Thuê và cấu hình VPS ở đâu cho mượt?', 'Cài đặt phần mềm MT5 trên máy chủ thế nào?', 'EA bỏ vào thư mục nào mới đúng chuẩn?', 'Set thông số (Parameters) ra sao để không lỗi?', 'Kết nối tài khoản giao dịch như thế nào?', '“Cài kiểu gì đây?” 😅'].map((item, i) => (
              <div key={i} className="bg-gray-950 border border-gray-800 p-6 rounded-2xl flex items-start gap-4">
                <div className="text-red-400 text-xl mt-1">❌</div>
                <div className="text-gray-300 font-medium">{item}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* GIẢI PHÁP (THE SOLUTION) */}
      <section className="py-20 max-w-6xl mx-auto px-6">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          <div className="lg:w-1/2 space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold text-white leading-tight">
              EA HELPER – Giải pháp <br />
              <span className="text-blue-500">"Zero Kỹ Thuật"</span> dành cho bạn
            </h2>
            <p className="text-gray-400 text-lg leading-relaxed">
              Chúng tôi mang đến một nền tảng quản lý dành riêng cho những nhà đầu tư muốn tận dụng sức mạnh của Auto-Trading mà không muốn biến mình thành dân IT.
            </p>
            <ul className="space-y-4">
              <li className="flex items-center gap-3 text-gray-300">
                <span className="w-6 h-6 rounded-full bg-green-900/50 text-green-400 flex items-center justify-center text-sm font-bold">✓</span>
                Không rành cài đặt? Đội ngũ kỹ thuật hỗ trợ setup chuẩn 100%.
              </li>
              <li className="flex items-center gap-3 text-gray-300">
                <span className="w-6 h-6 rounded-full bg-green-900/50 text-green-400 flex items-center justify-center text-sm font-bold">✓</span>
                Không cần tự thuê hay duy trì máy chủ VPS đắt đỏ, phức tạp.
              </li>
              <li className="flex items-center gap-3 text-gray-300">
                <span className="w-6 h-6 rounded-full bg-green-900/50 text-green-400 flex items-center justify-center text-sm font-bold">✓</span>
                Chạy vốn nhỏ, 1-2 tài khoản hệ thống vẫn hỗ trợ nhiệt tình.
              </li>
              <li className="flex items-center gap-3 text-gray-300">
                <span className="w-6 h-6 rounded-full bg-green-900/50 text-green-400 flex items-center justify-center text-sm font-bold">✓</span>
                Kiểm soát real-time P/L, Drawdown qua Client Dashboard mọi nơi.
              </li>
            </ul>
          </div>
          
          <div className="lg:w-1/2 w-full">
            <div className="bg-gradient-to-tr from-blue-900/20 to-purple-900/20 border border-gray-800 p-8 rounded-3xl shadow-2xl">
              <div className="bg-gray-950 border border-gray-800 rounded-2xl p-6 space-y-4">
                <div className="flex items-center justify-between border-b border-gray-800 pb-4">
                  <div className="text-white font-bold">Client Dashboard</div>
                  <div className="text-green-400 text-sm font-mono flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span> Online
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-900 p-4 rounded-xl border border-gray-800">
                    <div className="text-xs text-gray-500">Lợi nhuận hôm nay</div>
                    <div className="text-lg font-bold text-green-400 mt-1">+$145.50</div>
                  </div>
                  <div className="bg-gray-900 p-4 rounded-xl border border-gray-800">
                    <div className="text-xs text-gray-500">Drawdown</div>
                    <div className="text-lg font-bold text-red-400 mt-1">1.25%</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="bg-gray-900 border-y border-gray-800 py-20">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-white mb-12">3 Bước Đơn Giản Để Bắt Đầu</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gray-950 border border-gray-800 p-8 rounded-3xl relative">
              <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-black text-xl border-4 border-gray-900">1</div>
              <h3 className="text-xl font-bold text-white mt-4 mb-2">Cung Cấp Thông Tin</h3>
              <p className="text-gray-400 text-sm">Gửi ID, Pass, Server và yêu cầu chiến thuật (VD: DCA 15 giá) qua hệ thống tiếp nhận.</p>
            </div>
            <div className="bg-gray-950 border border-gray-800 p-8 rounded-3xl relative">
              <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-black text-xl border-4 border-gray-900">2</div>
              <h3 className="text-xl font-bold text-white mt-4 mb-2">Hệ Thống Setup</h3>
              <p className="text-gray-400 text-sm">EA HELPER tiếp nhận, cấu hình máy chủ VPS, cài đặt MT5 và khởi chạy EA đúng thông số.</p>
            </div>
            <div className="bg-gray-950 border border-gray-800 p-8 rounded-3xl relative">
              <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-black text-xl border-4 border-gray-900">3</div>
              <h3 className="text-xl font-bold text-white mt-4 mb-2">Theo Dõi Lợi Nhuận</h3>
              <p className="text-gray-400 text-sm">Đăng nhập email vào Cổng Khách Hàng (Client Portal) để xem báo cáo 12 thông số Real-time.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA & FOOTER (TÍCH HỢP MÃ QR) */}
      <section className="py-24 max-w-4xl mx-auto px-6 text-center">
        <h2 className="text-3xl font-bold text-white mb-6">Sẵn Sàng Để EA Làm Việc Thay Bạn?</h2>
        <p className="text-gray-400 mb-10 text-lg">Đừng để rào cản kỹ thuật làm chậm tốc độ kiếm tiền của bạn. Hãy để chúng tôi lo phần khó nhất.</p>
        
        <div className="bg-gradient-to-b from-gray-900 to-gray-950 border border-gray-800 p-8 md:p-12 rounded-3xl shadow-2xl flex flex-col items-center">
          
          {/* KHU VỰC QR CODE */}
          <div className="bg-white p-4 rounded-2xl mb-6 inline-block shadow-lg">
            {/* THAY SRC BẰNG LINK ẢNH QR ZALO CỦA BẠN HOẶC BỎ THẺ <Image/> CHÈN THẺ <img/> THƯỜNG VÀO ĐÂY */}
            <div className="w-48 h-48 bg-gray-200 border-2 border-dashed border-gray-400 flex items-center justify-center rounded-xl text-gray-500 font-medium">
              Chèn ảnh QR Zalo vào đây
              {/* <img src="/qr-zalo.png" alt="Zalo QR Code" className="w-full h-full object-cover rounded-xl" /> */}
            </div>
          </div>

          <h3 className="text-xl font-bold text-white mb-2">Quét mã QR hoặc Bấm vào Link</h3>
          <p className="text-gray-400 mb-6 text-sm">Inbox Zalo <span className="text-blue-400 font-semibold">EA Helper System</span> để nhận hỗ trợ ngay lập tức.</p>
          
          <a href={zaloLink} target="_blank" rel="noopener noreferrer" className="bg-blue-600 hover:bg-blue-700 text-white text-lg font-bold px-10 py-4 rounded-xl transition shadow-lg shadow-blue-600/30 w-full sm:w-auto">
            💬 Tham Gia Zalo Group
          </a>
        </div>
      </section>

      <footer className="border-t border-gray-800 py-8 text-center text-sm text-gray-500">
        <p>© {new Date().getFullYear()} EA HELPER PLATFORM. All rights reserved.</p>
      </footer>

    </main>
  );
}
