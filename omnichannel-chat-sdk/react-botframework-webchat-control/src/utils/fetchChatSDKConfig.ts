const fetchChatSDKConfig = () => {
  const chatSDKConfig = {
    chatReconnect: {
      disable: false
    },
    persistentChat: {
      disable: false,
      tokenUpdateTime: 21600000
    }
  };

  return chatSDKConfig;
};

export default fetchChatSDKConfig;