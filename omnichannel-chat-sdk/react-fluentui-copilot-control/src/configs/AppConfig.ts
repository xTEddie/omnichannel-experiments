const AppConfig = {
  ChatSDK: {
    liveChatConfig: {
      log: false // Log the live chat configuration on init
    },
    onNewMessage: {
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