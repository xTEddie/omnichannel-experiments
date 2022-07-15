import { useCallback, useEffect, useState } from "react";
// import {OmnichannelChatSDK} from "@microsoft/omnichannel-chat-sdk";
import fetchOmnichannelConfig from "../utils/fetchOmnichannelConfig";
import fetchDebugConfig from "../utils/fetchDebugConfig";
import ReactWebChat from "botframework-webchat";
import dynamic from "next/dynamic";

const omnichannelConfig = fetchOmnichannelConfig();
const debugConfig = fetchDebugConfig();

console.log(`%c [OmnichannelConfig]`, 'background-color:#001433;color:#fff');
console.log(omnichannelConfig);

console.log(`%c [debugConfig]`, 'background-color:#001433;color:#fff');
console.log(debugConfig);

const OmnichannelChatWidget = () => {
  const [chatSDK, setChatSDK] = useState<any>();
  const [chatAdapter, setChatAdapter] = useState(undefined);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    console.log("[OmnichannelChatWidget]");

    const init = async () => {
      const OmnichannelChatSDK = (await import("@microsoft/omnichannel-chat-sdk")).OmnichannelChatSDK;
      const chatSDK = new OmnichannelChatSDK(omnichannelConfig);
      chatSDK.setDebug(!debugConfig.disable);

      await chatSDK.initialize();

      setChatSDK(chatSDK);
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

    const chatAdapter = await chatSDK.createChatAdapter();
    setChatAdapter(chatAdapter);
  }, [chatSDK]);

  const endChat = useCallback(async () => {
    await chatSDK.endChat();

    await (chatAdapter as any)?.end();

    setChatAdapter(undefined);
  }, [chatSDK, chatAdapter]);

  return (
    <div>
      <button onClick={startChat}> Start Chat </button>
      <button onClick={endChat}> End Chat </button>
      {chatAdapter && <ReactWebChat directLine={chatAdapter} userID="teamsvisitor" />}
    </div>
  )
}

export default OmnichannelChatWidget;