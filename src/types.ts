export interface OpenAIResponse {
    choices: { message: { content: string } }[];
}

export interface AiConf {
    key:string
    url: string;
    model:string;
    role: string
}

export interface LiveChatMessageSnippet {
    liveChatId: string;
    type: string;
    textMessageDetails?: {
      messageText: string;
    };
}
  
export interface LiveChatAuthorDetails {
    displayName: string;
    channelId: string;
    isVerified: boolean;
}
  
export interface LiveChatMessageItem {
    id: string;
    snippet: LiveChatMessageSnippet;
    authorDetails: LiveChatAuthorDetails;
}
  
export interface LiveChatMessagesResponse {
    kind: string;
    etag: string;
    items: LiveChatMessageItem[];
    nextPageToken?: string;
    pageInfo: {
      totalResults: number;
      resultsPerPage: number;
    };
}