import Pusher from 'pusher';

let pusherServer: Pusher | null = null;

const pusherAppId = process.env.PUSHER_APP_ID;
const pusherKey = process.env.NEXT_PUBLIC_PUSHER_KEY;
const pusherSecret = process.env.PUSHER_SECRET;
const pusherCluster = process.env.NEXT_PUBLIC_PUSHER_CLUSTER;

if (pusherAppId && pusherKey && pusherSecret && pusherCluster) {
  pusherServer = new Pusher({
    appId: pusherAppId,
    key: pusherKey,
    secret: pusherSecret,
    cluster: pusherCluster,
    useTLS: true,
  });
} else {
  console.warn('Pusher server configuration missing. Please set all required environment variables.');
}

export { pusherServer };
