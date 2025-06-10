const AppConfig = {
  ChatSDK: {
    liveChatConfig: {
      log: false // Log the live chat configuration on init
    },
    liveChatContext: {
      log: true,
      reset: false, // Reset the live chat context on init
      cache: true, // Cache the live chat context in localStorage
      retrieveFromCache: true // Retrieve the live chat context from localStorage if available
    },
    onNewMessage: {
      log: true
    }
  },
  components: {
    WidgetContainer: {
      log: true
    }
  },
  widget: {
    WidgetState: {
      log: true // Log the widget state changes
    }
  }
}

export default AppConfig;