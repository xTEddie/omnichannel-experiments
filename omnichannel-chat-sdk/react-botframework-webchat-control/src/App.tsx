import { useCallback, useEffect, useState } from 'react'
import { OmnichannelChatSDK } from '@microsoft/omnichannel-chat-sdk';
import ReactWebChat from 'botframework-webchat';
import { version as chatSDKversion } from '@microsoft/omnichannel-chat-sdk/package.json';
import { version as OCSDKVersion } from '@microsoft/ocsdk/package.json';
import { version as webChatVersion } from 'botframework-webchat/package.json';
import { version as chatAdapterVersion } from '@microsoft/botframework-webchat-adapter-azure-communication-chat/package.json';
import AppConfig from './configs/AppConfig';
import fetchDebugConfig from './utils/fetchDebugConfig';
import fetchOmnichannelConfig from './utils/fetchOmnichannelConfig';
import fetchChatSDKConfig from './utils/fetchChatSDKConfig';
import fetchAuthToken from './utils/fetchAuthToken';
import ChatButton from './components/ChatButton/ChatButton';
import ChatCommands from './components/ChatCommands/ChatCommands';
import ChatHeader from './components/ChatHeader/ChatHeader';
import createActivityMiddleware from './middlewares/native/createActivityMiddleware';
import './App.css';

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
      const authToken = await fetchAuthToken({option: 'api'});
      const chatSDKConfig = fetchChatSDKConfig({ authToken });
      const chatSDK = new OmnichannelChatSDK(omnichannelConfig, chatSDKConfig);
      await chatSDK.initialize();

      if (debugConfig.debug) {
        chatSDK.setDebug(true);
      }

      setChatSDK(chatSDK);

      const chatConfig = await chatSDK.getLiveChatConfig();
      if (AppConfig.ChatSDK.liveChatConfig.log) {
        console.log(chatConfig);
      }

      if (AppConfig.ChatSDK.liveChatContext.reset) {
        localStorage.removeItem('liveChatContext');
      }
    }

    init();
  }, []);

  const startChat = useCallback(async () => {
    if (hasChatStarted) {
      return;
    }

    const optionalParams: any = {};
    if (AppConfig.ChatSDK.liveChatContext.retrieveFromCache) {
      const cachedLiveChatContext = localStorage.getItem('liveChatContext');
      if (cachedLiveChatContext && Object.keys(JSON.parse(cachedLiveChatContext)).length > 0) {
        AppConfig.ChatSDK.liveChatContext && console.log("[liveChatContext]");
        optionalParams.liveChatContext = JSON.parse(cachedLiveChatContext);
      }
    }

    await chatSDK?.startChat(optionalParams);

    if (AppConfig.ChatSDK.liveChatContext.cache) {
      const liveChatContext = await chatSDK?.getCurrentLiveChatContext();
      localStorage.setItem('liveChatContext', JSON.stringify(liveChatContext));
    }

    setHasChatStarted(true);
    console.log("Chat started!");
    await chatSDK?.onNewMessage((message: any) => {
      AppConfig.ChatSDK.onNewMessage.log && console.log(`New message!`);
      AppConfig.ChatSDK.onNewMessage.log && console.log(message?.content);
    });

    const chatAdapter = await chatSDK?.createChatAdapter();
    setChatAdapter(chatAdapter);
  }, [chatSDK, hasChatStarted]);

  const endChat = useCallback(async () => {
    if (!hasChatStarted) {
      return;
    }

    await chatSDK?.endChat();

    if (AppConfig.ChatSDK.liveChatContext.cache) {
      localStorage.removeItem('liveChatContext');
    }

    setHasChatStarted(false);
  }, [chatSDK, hasChatStarted]);

  return (
    <>
      <h1>ChatSDK Sample</h1>
      <ChatCommands startChat={startChat} endChat={endChat} />
      { hasChatStarted && <div style={{position: 'absolute', bottom: 20, right: 20, height: 560, width: 350, border: '1px solid rgb(209, 209, 209)', display: 'flex', flexDirection: 'column'}}>
          <ChatHeader onClose={endChat}/>
          {chatAdapter && <ReactWebChat
              directLine={chatAdapter}
              activityMiddleware={createActivityMiddleware()}
            />
          }
        </div>
      }
      { !hasChatStarted && AppConfig.widget.chatButton.disabled === false &&
        <ChatButton handleClick={startChat}/>
      }
    </>
  )
}

export default App;