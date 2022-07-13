import { useCallback, useEffect, useState } from "react";
import {OmnichannelChatSDK} from "@microsoft/omnichannel-chat-sdk";
import fetchOmnichannelConfig from "../utils/fetchOmnichannelConfig";

const omnichannelConfig = fetchOmnichannelConfig();

console.log(`%c [OmnichannelConfig]`, 'background-color:#001433;color:#fff');
console.log(omnichannelConfig);

const OmnichannelChatWidget = () => {
  const [chatSDK, setChatSDK] = useState<any>();

  useEffect(() => {
    console.log("[OmnichannelChatWidget]");
    const init = async () => {
      const chatSDK = new OmnichannelChatSDK(omnichannelConfig);
      setChatSDK(chatSDK);

      await chatSDK.initialize();
    }

    init();
  }, []);

  const startChat = useCallback(async () => {
    console.log("[startChat]");

    await chatSDK.startChat();

    chatSDK.onNewMessage((message: any) => {
      console.log(`[onNewMessage]`);
      console.log(message);
    });
  }, [chatSDK]);

  return (
    <div>
      <button onClick={startChat}> Start Chat </button>
    </div>
  )
}

export default OmnichannelChatWidget;