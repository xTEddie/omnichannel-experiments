import AppConfig from "../../configs/AppConfig";

const activityMiddleware = () => (next: CallableFunction) => (...args: any) => {
  AppConfig.activityMiddleware.log && console.log(`[activityMiddleware]`);
  const [card] = args;
  if (card.activity) {
    AppConfig.activityMiddleware.log && console.log(card.activity);
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