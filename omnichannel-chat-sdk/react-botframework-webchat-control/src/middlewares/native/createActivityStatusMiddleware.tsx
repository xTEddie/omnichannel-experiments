import AppConfig from "../../configs/AppConfig";

const createActivityStatusMiddleware = (locale: string) => {
    if (AppConfig.WebChat.activityStatusMiddleware.disabled) {
        return;
    }

    const activityStatusMiddleware = () => (next: CallableFunction) => (...args: any) => {
      AppConfig.WebChat.activityStatusMiddleware.log && console.log(`[activityStatusMiddleware]`);
      const [card] = args;
      if (card.activity) {
        const { activity } = card;
        AppConfig.WebChat.activityStatusMiddleware.log && console.log(activity);
      }

      return next(card);
    };

    return activityStatusMiddleware;
};

export default createActivityStatusMiddleware;