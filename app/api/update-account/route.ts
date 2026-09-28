import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { account_number, balance, equity, profit_today, profit_month, profit_total, drawdown, total_orders, bot_status } = body;

    // Kiểm tra xem có gửi số tài khoản lên không
    if (!account_number) {
      return NextResponse.json({ success: false, error: 'Thiếu số tài khoản (account_number)' }, { status: 400 });
    }

    // Cập nhật dữ liệu vào bảng trading_accounts dựa theo account_number
    const { error } = await supabase
      .from('trading_accounts')
      .update({
        balance: parseFloat(balance || 0),
        equity: parseFloat(equity || 0),
        profit_today: parseFloat(profit_today || 0),
        profit_month: parseFloat(profit_month || 0),
        profit_total: parseFloat(profit_total || 0),
        drawdown: parseFloat(drawdown || 0),
        total_orders: parseInt(total_orders || 0),
        bot_status: bot_status || 'Running',
      })
      .eq('account_number', String(account_number));

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: `Cập nhật tài khoản ${account_number} thành công!` });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}