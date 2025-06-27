import { Components } from 'botframework-webchat-component';
import AppConfig from "../../configs/AppConfig";

const {
  BasicSendBox
} = Components;

const createSendBoxMiddleware = () => {
  if (AppConfig.WebChat.sendBoxMiddleware.disabled) {
    return;
  }

  return [() => () => () => BasicSendBox];
};

export default createSendBoxMiddleware;