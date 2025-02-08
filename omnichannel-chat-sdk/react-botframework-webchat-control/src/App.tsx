import { useCallback, useEffect, useState } from 'react'
import { OmnichannelChatSDK } from '@microsoft/omnichannel-chat-sdk';
import { version } from '@microsoft/omnichannel-chat-sdk/package.json';
import fetchOmnichannelConfig from './utils/fetchOmnichannelConfig';
import fetchChatSDKConfig from './utils/fetchChatSDKConfig';
import './App.css';

function App() {
  const [chatSDK, setChatSDK] = useState<OmnichannelChatSDK>();

  useEffect(() => {
    console.log(`omnichannel-chat-sdk@${version}`);
    const omnichannelConfig = fetchOmnichannelConfig();
    const chatSDKConfig = fetchChatSDKConfig();

    const init = async () => {
      const chatSDK = new OmnichannelChatSDK(omnichannelConfig, chatSDKConfig);
      await chatSDK.initialize();

      setChatSDK(chatSDK);

      const chatConfig = await chatSDK.getLiveChatConfig();
      console.log(chatConfig);
    }

    init();
  }, []);

  const startChat = useCallback(async () => {
    await chatSDK?.startChat();
    console.log("Chat started!");
    await chatSDK?.onNewMessage((message: any) => {
      console.log(`New message!`)
      console.log(message?.content);
    });
  }, [chatSDK]);

  const endChat = useCallback(async () => {
    await chatSDK?.endChat();
  }, [chatSDK]);

  return (
    <>
      <h1>omnichannel-chat-sdk</h1>
      <div className="card">
        <button onClick={startChat}>
          Start Chat
        </button>
        <button onClick={endChat}>
          End Chat
        </button>
      </div>
    </>
  )
}

export default App
