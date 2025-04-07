const AppConfig = {
  ChatSDK: {
    authToken: {
      log: false
    },
    liveChatConfig: {
      log: false // Log the live chat configuration on init
    },
    onNewMessage: {
      log: false
    },
    liveChatContext: {
      log: true,
      reset: false, // Reset the live chat context on init
      cache: true, // Cache the live chat context in localStorage
      retrieveFromCache: true // Retrieve the live chat context from localStorage if available
    }
  },
  activityMiddleware: {
    disabled: false,
    log: true, // Log activity middleware events
    messages: {
      system: {
        log: false // Log system messages
      },
      bot: {
        log: false // Log WebChat 'bot' role messages (Any incoming OC messages)
      }
    }
  }
};

export default AppConfig;