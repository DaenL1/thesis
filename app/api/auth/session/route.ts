import { NextResponse } from 'next/server';
import { GetCurrentSession } from '@/lib/auth';

export async function GET() {
  try {
    const session = await GetCurrentSession();
    if (session) {
      // In a real app, you might fetch more user details here based on session.UserId
      return NextResponse.json({ success: true, user: session });
    } else {
      return NextResponse.json({ success: false, message: 'No active session' }, { status: 401 });
    }
  } catch (error) {
    console.error('API Error in /api/auth/session:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}