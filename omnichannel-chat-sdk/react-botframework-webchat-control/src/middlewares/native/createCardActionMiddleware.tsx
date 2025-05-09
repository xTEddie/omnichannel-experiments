import AppConfig from "../../configs/AppConfig";

const cardActionMiddleware = () => (next: CallableFunction) => (...args: any) => {
  AppConfig.WebChat.cardActionMiddleware.log && console.log(`[cardActionMiddleware]`);
  const [card] = args;
  AppConfig.WebChat.cardActionMiddleware.log && console.log(card);
  return next(...args);
};

const createCardActionMiddleware = () => {
  if (AppConfig.WebChat.cardActionMiddleware.disabled) {
    return;
  }

  return cardActionMiddleware;
}

export default createCardActionMiddleware;