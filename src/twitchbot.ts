import { Client } from 'tmi.js';
import dotenv from 'dotenv';
import { askChris } from './askchris';

dotenv.config();

const {
  TWITCH_USERNAME,
  TWITCH_OAUTH_TOKEN,
  TWITCH_CHANNEL,
} = process.env;


if (TWITCH_USERNAME && TWITCH_OAUTH_TOKEN && TWITCH_CHANNEL) {
  startTwitchBot();
}

const twitchClient = () => new Client({
  identity: {
    username: TWITCH_USERNAME!,
    password: TWITCH_OAUTH_TOKEN!,
  },
  channels: [TWITCH_CHANNEL!],
});

function startTwitchBot() {
  const client = twitchClient();

  client.on('message', async (channel: string, tags: any, message: string, self: boolean) => {
    if (self) return; 

    if (message.startsWith('!q')) {
      const question = message.slice(3).trim();
      const response = await askChris(question);
      client.say(channel, `@${tags.username} ${response}`);
    }
  });

  client.connect().catch(console.error);
}

