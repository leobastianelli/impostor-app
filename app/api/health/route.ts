import { NextResponse } from 'next/server';

export async function GET() {
  const envCheck = {
    pusherKey: !!process.env.NEXT_PUBLIC_PUSHER_KEY,
    pusherAppId: !!process.env.PUSHER_APP_ID,
    pusherSecret: !!process.env.PUSHER_SECRET,
    pusherCluster: !!process.env.NEXT_PUBLIC_PUSHER_CLUSTER,
  };

  const allConfigured = Object.values(envCheck).every((v) => v);

  return NextResponse.json({
    status: 'ok',
    environment: {
      configured: allConfigured,
      missing: Object.entries(envCheck)
        .filter(([_, value]) => !value)
        .map(([key]) => key),
    },
    timestamp: new Date().toISOString(),
  });
}
