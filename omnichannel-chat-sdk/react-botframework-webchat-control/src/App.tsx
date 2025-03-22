import { useCallback, useEffect, useState } from 'react'
import { OmnichannelChatSDK } from '@microsoft/omnichannel-chat-sdk';
import ReactWebChat from 'botframework-webchat';
import { version as chatSDKversion } from '@microsoft/omnichannel-chat-sdk/package.json';
import { version as OCSDKVersion } from '@microsoft/ocsdk/package.json';
import { version as webChatVersion } from 'botframework-webchat/package.json';
import { version as chatAdapterVersion } from '@microsoft/botframework-webchat-adapter-azure-communication-chat/package.json';
import fetchDebugConfig from './utils/fetchDebugConfig';
import fetchOmnichannelConfig from './utils/fetchOmnichannelConfig';
import fetchChatSDKConfig from './utils/fetchChatSDKConfig';
import fetchAuthToken from './utils/fetchAuthToken';
import ChatHeader from './components/ChatHeader/ChatHeader';
import './App.css';

const AppConfig = {
  onNewMessage: {
    log: true
  }
};

function App() {
  const [chatSDK, setChatSDK] = useState<OmnichannelChatSDK>();
  const [chatAdapter, setChatAdapter] = useState<any>(undefined);
  const [hasChatStarted, setHasChatStarted] = useState(false);

  useEffect(() => {
    console.log(`ocsdk@${OCSDKVersion}`);
    console.log(`omnichannel-chat-sdk@${chatSDKversion}`);
    console.log(`botframework-webchat@${webChatVersion}`);
    console.log(`botframework-webchat-adapter-azure-communication-chat@${chatAdapterVersion}`)

    const init = async () => {
      const omnichannelConfig = fetchOmnichannelConfig();
      const debugConfig = fetchDebugConfig();
      const authToken = await fetchAuthToken({option: 'none'});
      const chatSDKConfig = fetchChatSDKConfig({ authToken });
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
    if (hasChatStarted) {
      return;
    }

    await chatSDK?.startChat();
    setHasChatStarted(true);
    console.log("Chat started!");
    await chatSDK?.onNewMessage((message: any) => {
      AppConfig.onNewMessage.log && console.log(`New message!`);
      AppConfig.onNewMessage.log && console.log(message?.content);
    });

    const chatAdapter = await chatSDK?.createChatAdapter();
    setChatAdapter(chatAdapter);
  }, [chatSDK, hasChatStarted]);

  const endChat = useCallback(async () => {
    if (!hasChatStarted) {
      return;
    }

    await chatSDK?.endChat();
    setHasChatStarted(false);
  }, [chatSDK, hasChatStarted]);

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
      { hasChatStarted && <div style={{position: 'absolute', bottom: 20, right: 20, height: 560, width: 350, border: '1px solid rgb(209, 209, 209)', display: 'flex', flexDirection: 'column'}}>
          <ChatHeader onClose={endChat}/>
          {chatAdapter && <ReactWebChat
            directLine={chatAdapter}
          />}
        </div>
      }
    </>
  )
}

export default App
