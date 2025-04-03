interface FetchChatSDKConfigOptions {
  authToken?: string;
};

const fetchChatSDKConfig = (options: FetchChatSDKConfigOptions = {}) => {
  const chatSDKConfig: any = {
    chatReconnect: {
      disable: false
    },
    persistentChat: {
      disable: false,
      tokenUpdateTime: 21600000
    }
  };

  if (options.authToken) {
    // ChatSDK uses the authToken only if the chat configuration is set to auth chat. Otherwise, it will ignore it.
    chatSDKConfig.getAuthToken = () => options.authToken;
  }

  return chatSDKConfig;
};

export default fetchChatSDKConfig;