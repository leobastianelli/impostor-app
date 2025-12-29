import Pusher from 'pusher-js';

let pusherClient: Pusher | null = null;

if (typeof window !== 'undefined') {
  const pusherKey = process.env.NEXT_PUBLIC_PUSHER_KEY;
  const pusherCluster = process.env.NEXT_PUBLIC_PUSHER_CLUSTER;

  if (pusherKey && pusherCluster) {
    pusherClient = new Pusher(pusherKey, {
      cluster: pusherCluster,
      authEndpoint: '/api/pusher/auth',
    });
  } else {
    console.warn('Pusher configuration missing. Please set NEXT_PUBLIC_PUSHER_KEY and NEXT_PUBLIC_PUSHER_CLUSTER environment variables.');
  }
}

export { pusherClient };
