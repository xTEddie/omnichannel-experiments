import { useCallback, useEffect, useState } from 'react'
import { OmnichannelChatSDK } from '@microsoft/omnichannel-chat-sdk';
import ReactWebChat from 'botframework-webchat';
import { version as chatSDKversion } from '@microsoft/omnichannel-chat-sdk/package.json';
import { version as webChatVersion } from 'botframework-webchat/package.json';
import { version as chatAdapterVersion } from '@microsoft/botframework-webchat-adapter-azure-communication-chat/package.json';
import fetchDebugConfig from './utils/fetchDebugConfig';
import fetchOmnichannelConfig from './utils/fetchOmnichannelConfig';
import fetchChatSDKConfig from './utils/fetchChatSDKConfig';
import './App.css';

function App() {
  const [chatSDK, setChatSDK] = useState<OmnichannelChatSDK>();
  const [chatAdapter, setChatAdapter] = useState<any>(undefined);

  useEffect(() => {
    console.log(`omnichannel-chat-sdk@${chatSDKversion}`);
    console.log(`botframework-webchat@${webChatVersion}`);
    console.log(`botframework-webchat-adapter-azure-communication-chat@${chatAdapterVersion}`)
    const omnichannelConfig = fetchOmnichannelConfig();
    const debugConfig = fetchDebugConfig();
    const chatSDKConfig = fetchChatSDKConfig();

    const init = async () => {
      const chatSDK = new OmnichannelChatSDK(omnichannelConfig, chatSDKConfig);
      await chatSDK.initialize();

      if (debugConfig.debug) {
        chatSDK.setDebug(true);
      }

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

    const chatAdapter = await chatSDK?.createChatAdapter();
    setChatAdapter(chatAdapter);
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
      <div style={{position: 'absolute', bottom: 20, right: 20, height: 560, width: 350}}>
        {chatAdapter && <ReactWebChat
          directLine={chatAdapter}
        />}
      </div>
    </>
  )
}

export default App
