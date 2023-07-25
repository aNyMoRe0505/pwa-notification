import webpush from 'web-push';

webpush.setVapidDetails(
  'mailto:anymore0505@gmail.com',
  process.env.NEXT_PUBLIC_WEB_PUSH_PUBLIC_KEY,
  process.env.WEB_PUSH_PRIVATE_KEY,
);

const subscribers = [];

export default async function handler(req, res) {
  switch (req.method) {
    case 'GET': {
      try {
        await Promise.all(
          subscribers.map(async (subscriber) => {
            await webpush.sendNotification(
              subscriber,
              JSON.stringify({
                title: req.query.title || '你好, 朋友！',
                keyA: 'hello',
                keyB: 'yoyoman',
                keyC: 'haha',
              }),
            );
          }),
        );
        res.status(204).end();
      } catch (error) {
        console.log('error', error);
        res.status(400).end();
      }
      break;
    }

    case 'POST': {
      const payload = JSON.parse(req.body);
      const isUserExist = subscribers.some(
        (subscriber) => subscriber.endpoint === payload.endpoint,
      );
      if (isUserExist) {
        res.status(204).end();
      } else {
        subscribers.push(payload);
        res.status(201).end();
      }
      break;
    }

    default: {
      res.status(404).end();
      break;
    }
  }
}
