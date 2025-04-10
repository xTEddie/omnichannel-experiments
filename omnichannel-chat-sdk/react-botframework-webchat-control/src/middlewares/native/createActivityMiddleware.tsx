import AppConfig from "../../configs/AppConfig";

const activityMiddleware = () => (next: CallableFunction) => (...args: any) => {
  AppConfig.WebChat.activityMiddleware.log && console.log(`[activityMiddleware]`);
  const [card] = args;
  if (card.activity) {
    const { activity } = card;
    AppConfig.WebChat.activityMiddleware.log && console.log(activity);

    if (activity.channelData?.tags?.includes('system')) {
      AppConfig.WebChat.activityMiddleware.log && AppConfig.WebChat.activityMiddleware.messages.system.log && console.log(`[activityMiddleware][Message][System] ${card.activity.text}`);
    }

    if (activity.from?.role === 'bot') {
      AppConfig.WebChat.activityMiddleware.log && AppConfig.WebChat.activityMiddleware.messages.bot.log && console.log(`[activityMiddleware][Message][AgentOrBot] ${card.activity.text}`);
    }

    if (activity.from?.role === 'user') {
      AppConfig.WebChat.activityMiddleware.log && AppConfig.WebChat.activityMiddleware.messages.user.log && console.log(`[activityMiddleware][Message][Customer] ${card.activity.text}`);
    }

    // Thread event activity raised by adapter
    if (activity.channelData?.type === "Thread") {
      const tag = 'left';
      if (activity.text.endsWith(`${tag} chat\"`)) {
        return next();
      }
    }
  }
  return next(card);
};

const createActivityMiddleware = () => {
  if (AppConfig.WebChat.activityMiddleware.disabled) {
    return;
  }

  return activityMiddleware;
};

export default createActivityMiddleware;