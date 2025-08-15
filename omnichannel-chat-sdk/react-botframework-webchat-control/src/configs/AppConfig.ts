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
    onAgentEndSession: {
      log: false
    },
    liveChatContext: {
      log: true,
      reset: false, // Reset the live chat context on init
      cache: true, // Cache the live chat context in localStorage
      retrieveFromCache: true // Retrieve the live chat context from localStorage if available
    }
  },
  components: {
    WidgetContainer: {
      log: false
    }
  },
  widget: {
    WidgetState: {
      log: false // Log the widget state changes
    },
    chatButton: {
      disabled: false
    },
    errorPane: {
      disabled: false
    },
    offlinePane: {
      disabled: false
    },
    preChatSurveyPane: {
      log: false,
      disabled: false
    },
    loadingPane: {
      disabled: false
    },
    postChatSurveyPane: {
      disabled: false
    }
  },
  WebChat: {
    superChatAdapter: {
      disabled: false
    },
    FluentThemeProvider: {
      disabled: false
    },
    styleOptions: {
      rootHeight: '510px'
    },
    activityMiddleware: {
      disabled: false,
      log: false, // Log activity middleware events
      messages: {
        system: {
          log: false // Log system messages
        },
        bot: {
          log: false // Log WebChat 'bot' role messages (Any incoming OC messages)
        },
        user: {
          log: false // Log WebChat 'user' role messages (Any outgoing messages)
        }
      }
    },
    activityStatusMiddleware: {
      disabled: false,
      log: false // Log activity status middleware events
    },
    attachmentMiddleware: {
      disabled: false,
      log: false // Log attachment middleware events
    },
    cardActionMiddleware: {
      disabled: false,
      log: false // Log card action middleware events
    },
    sendBoxMiddleware: {
      disabled: true
    }
  }
};

export default AppConfig;