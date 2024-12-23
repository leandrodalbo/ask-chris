import { google } from '../node_modules/googleapis/build/src/index';
import dotenv from 'dotenv';
import { LiveChatMessagesResponse } from './types';
import { askChris } from './askchris';

dotenv.config();

const {
  YOUTUBE_API_KEY,
  YOUTUBE_LIVE_CHAT_ID,
} = process.env;

if (YOUTUBE_API_KEY && YOUTUBE_LIVE_CHAT_ID) {
  startYouTubeBot();
}

const youtube = google.youtube({
  version: 'v3',
  auth: YOUTUBE_API_KEY!,
});

const liveMessages = async (): Promise<LiveChatMessagesResponse>=>{
  const messages = await youtube.liveChatMessages.list({
    liveChatId: YOUTUBE_LIVE_CHAT_ID!,
    part: 'snippet,authorDetails',
  });

  return messages.data as LiveChatMessagesResponse;
}

const postChatAnswer = async (author: string, message:string) =>{
  await youtube.liveChatMessages.insert({
    part: 'snippet',
    requestBody: {
      snippet: {
        liveChatId: YOUTUBE_LIVE_CHAT_ID!,
        type: 'textMessageEvent',
        textMessageDetails: {
          messageText: `@${author} ${message}`,
        },
      },
    },
  });
}


const listenToChat = async ()=> {
    try {
      const response = await liveMessages();

      for (const item of response.items) {
        const message = item.snippet.textMessageDetails!.messageText 
        const author = item.authorDetails!.displayName!;

        if (message.startsWith('!q')) {
          const question = message.slice(3).trim();
          const answer = await askChris(question);

          postChatAnswer(author, answer)

        }
      }
    } catch (error) {
      console.error('Error in YouTube chat');
    }
}

async function startYouTubeBot() {
  setInterval(listenToChat, 5000); 
}

