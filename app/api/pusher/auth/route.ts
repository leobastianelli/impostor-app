import { NextRequest, NextResponse } from 'next/server';
import { pusherServer } from '@/lib/pusher/server';

export async function POST(request: NextRequest) {
  try {
    if (!pusherServer) {
      return NextResponse.json(
        { error: 'Pusher not configured. Please set environment variables.' },
        { status: 503 }
      );
    }

    const data = await request.text();
    const params = new URLSearchParams(data);
    const socketId = params.get('socket_id');
    const channel = params.get('channel_name');

    if (!socketId || !channel) {
      return NextResponse.json(
        { error: 'Missing socket_id or channel_name' },
        { status: 400 }
      );
    }

    let authResponse;

if (channel.startsWith('presence-')) {
  // ⚠️ Presence requiere channel_data
  const presenceData = {
    user_id: socketId, // mínimo válido (mejor que nada)
    user_info: {},
  };

  authResponse = pusherServer.authorizeChannel(
    socketId,
    channel,
    presenceData
  );
} else {
  // private channels
  authResponse = pusherServer.authorizeChannel(socketId, channel);
}

return NextResponse.json(authResponse);


    return NextResponse.json(authResponse);
  } catch (error) {
    console.error('Pusher auth error:', error);
    return NextResponse.json(
      { error: 'Authentication failed' },
      { status: 500 }
    );
  }
}
