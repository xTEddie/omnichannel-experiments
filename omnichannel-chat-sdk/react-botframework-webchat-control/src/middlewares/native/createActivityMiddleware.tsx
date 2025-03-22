import AppConfig from "../../configs/AppConfig";

const activityMiddleware = () => (next: CallableFunction) => (...args: any) => {
  AppConfig.activityMiddleware.log && console.log(`[activityMiddleware]`);
  const [card] = args;
  if (card.activity) {
    const { activity } = card;
    AppConfig.activityMiddleware.log && console.log(activity);

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
  if (AppConfig.activityMiddleware.disabled) {
    return;
  }

  return activityMiddleware;
};

export default createActivityMiddleware;