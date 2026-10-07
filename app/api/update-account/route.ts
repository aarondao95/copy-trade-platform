import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Khởi tạo Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

export async function POST(request: Request) {
  try {
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

    if (!account_number) {
      return NextResponse.json({ error: 'Thiếu account_number' }, { status: 400 });
    }

    // Cập nhật dữ liệu (ĐÃ XÓA updated_at ĐỂ TRÁNH LỖI 500)
    const { data, error } = await supabase
      .from('trading_accounts')
      .update({
        balance: Number(balance || 0),
        equity: Number(equity || 0),
        profit_today: Number(profit_today || 0),
        profit_week: Number(profit_week || 0),
        profit_month: Number(profit_month || 0),
        profit_total: Number(profit_total || 0),
        drawdown: String(drawdown || '0.00%'),
        total_trades: Number(total_trades || 0),
        buy_trades: Number(buy_trades || 0),
        sell_trades: Number(sell_trades || 0),
        total_lots: Number(total_lots || 0),
        open_orders: Number(open_orders || 0),
        bot_status: String(bot_status || 'Running')
      })
      .eq('account_number', account_number.toString())
      .select();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (!data || data.length === 0) {
      return NextResponse.json({ error: 'Tài khoản không tồn tại trong DB' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Đã cập nhật thành công' }, { status: 200 });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ error: 'Chỉ chấp nhận phương thức POST' }, { status: 405 });
}
