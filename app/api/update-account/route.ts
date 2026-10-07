import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Khởi tạo Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

export async function POST(request: Request) {
  try {
    // 1. Đọc dữ liệu JSON từ EA gửi lên
    const body = await request.json();
    console.log("📥 Dữ liệu từ EA gửi lên:", body);

    const { 
      account_number, 
      balance, 
      equity, 
      profit_today, 
      profit_week, 
      profit_month, 
      profit_total, 
      drawdown, 
      total_trades, 
      buy_trades, 
      sell_trades, 
      total_lots, 
      open_orders, 
      bot_status 
    } = body;

    // Kiểm tra nếu không có ID tài khoản thì báo lỗi
    if (!account_number) {
      return NextResponse.json({ error: 'Thiếu account_number' }, { status: 400 });
    }

    // 2. Cập nhật dữ liệu vào Supabase dựa trên account_number
    const { data, error } = await supabase
      .from('trading_accounts')
      .update({
        balance: Number(balance || 0),
        equity: Number(equity || 0),
        profit_today: Number(profit_today || 0),
        profit_week: Number(profit_week || 0),
        profit_month: Number(profit_month || 0),
        profit_total: Number(profit_total || 0),
        drawdown: drawdown || '0.00%',
        total_trades: Number(total_trades || 0),
        buy_trades: Number(buy_trades || 0),
        sell_trades: Number(sell_trades || 0),
        total_lots: Number(total_lots || 0),
        open_orders: Number(open_orders || 0),
        bot_status: bot_status || 'Running',
        updated_at: new Date().toISOString() // Lưu vết thời gian cập nhật
      })
      .eq('account_number', account_number.toString()); // Khớp đúng số tài khoản MT4/MT5

    if (error) {
      console.error("❌ Lỗi Supabase:", error.message);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // 3. Trả về HTTP 200 (Thành công) cho EA
    return NextResponse.json({ success: true, message: 'Đã cập nhật 12 trường thông tin' }, { status: 200 });

  } catch (error: any) {
    console.error("❌ Lỗi Server:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// Chặn phương thức GET (Nếu EA gọi nhầm hoặc ai đó test bằng trình duyệt)
export async function GET() {
  return NextResponse.json({ error: 'Chỉ chấp nhận phương thức POST' }, { status: 405 });
}
