import AppConfig from "../../configs/AppConfig";

const attachmentMiddleware = () => (next: CallableFunction) => (...args: any) => {
  AppConfig.WebChat.attachmentMiddleware.log && console.log(`[attachmentMiddleware]`);
  const [card] = args;
  if (card.activity) {
    const { activity } = card;
    AppConfig.WebChat.attachmentMiddleware.log && console.log(activity);
  }
  return next(card);
};


const createAttachmentMiddleware = () => {
  if (AppConfig.WebChat.attachmentMiddleware.disabled) {
    return;
  }

  return attachmentMiddleware;
};

export default createAttachmentMiddleware;