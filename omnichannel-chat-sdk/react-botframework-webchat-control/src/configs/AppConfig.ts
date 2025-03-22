const AppConfig = {
  ChatSDK: {
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
    log: false // Log activity middleware events
  }
};

export default AppConfig;