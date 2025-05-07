import { useCallback, useEffect, useState, Fragment } from 'react'
import { OmnichannelChatSDK } from '@microsoft/omnichannel-chat-sdk';
import { FluentThemeProvider } from 'botframework-webchat-fluent-theme';
import ReactWebChat from 'botframework-webchat';
import AppConfig from './configs/AppConfig';
import AppDetails from './components/AppDetails/AppDetails';
import fetchDebugConfig from './utils/fetchDebugConfig';
import fetchOmnichannelConfig from './utils/fetchOmnichannelConfig';
import fetchChatSDKConfig from './utils/fetchChatSDKConfig';
import fetchAuthToken from './utils/fetchAuthToken';
import ChatButton from './components/ChatButton/ChatButton';
import ChatCommands from './components/ChatCommands/ChatCommands';
import ChatHeader from './components/ChatHeader/ChatHeader';
import createActivityMiddleware from './middlewares/native/createActivityMiddleware';
import WidgetConfigurations from './components/WidgetConfigurations/WidgetConfigurations';
import WidgetContainer from './components/WidgetContainer/WidgetContainer';
import parseLowerCaseString from './utils/parseLowerCaseString';
import './App.css';

enum WidgetState {
  UNKNOWN = 'UNKNOWN',
  READY = 'READY', // Widget is ready to be used
  LOADING = 'LOADING',
  CHAT = 'CHAT',
  ENDED = 'ENDED',
  MINIMIZED = 'MINIMIZED',
  OFFLINE = 'OFFLINE'
};

function App() {
  const [widgetState, setWidgetState] = useState(WidgetState.UNKNOWN);
  const [chatSDK, setChatSDK] = useState<OmnichannelChatSDK>();
  const [chatConfig, setChatConfig] = useState<any>(undefined);
  const [chatAdapter, setChatAdapter] = useState<any>(undefined);
  const [isOutOfOperatingHours, setIsOutOfOperatingHours] = useState(false);

  useEffect(() => {
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
      setChatConfig(chatConfig);
      if (AppConfig.ChatSDK.liveChatConfig.log) {
        console.log(chatConfig);
      }

      if (AppConfig.ChatSDK.liveChatContext.reset) {
        localStorage.removeItem('liveChatContext');
      }

      const {LiveWSAndLiveChatEngJoin} = chatConfig;
      const {OutOfOperatingHours} = LiveWSAndLiveChatEngJoin;
      setIsOutOfOperatingHours(parseLowerCaseString(OutOfOperatingHours) === 'true');

      setWidgetState(WidgetState.READY);
    }

    init();
  }, []);

  useEffect(() => {
    if (widgetState === WidgetState.ENDED) {
      setWidgetState(WidgetState.READY);
    }
  }, [widgetState]);

  const startChat = useCallback(async () => {
    if (isOutOfOperatingHours) {
      setWidgetState(WidgetState.OFFLINE);
      return;
    }

    if (widgetState === WidgetState.CHAT) {
      return;
    }

    if (widgetState === WidgetState.MINIMIZED) { // Resumes chat
      setWidgetState(WidgetState.CHAT);
      return;
    }

    if (AppConfig.widget.loadingPane.disabled === false) {
      setWidgetState(WidgetState.LOADING);
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

    setWidgetState(WidgetState.CHAT);
    console.log("Chat started!");
    await chatSDK?.onNewMessage((message: any) => {
      AppConfig.ChatSDK.onNewMessage.log && console.log(`New message!`);
      AppConfig.ChatSDK.onNewMessage.log && console.log(message?.content);
    });

    const chatAdapter = await chatSDK?.createChatAdapter();
    setChatAdapter(chatAdapter);
  }, [chatSDK, widgetState, isOutOfOperatingHours]);

  const endChat = useCallback(async () => {
    if (widgetState === WidgetState.OFFLINE) {
      setWidgetState(WidgetState.MINIMIZED);
      return;
    }

    if (widgetState !== WidgetState.CHAT) {
      return;
    }

    await chatSDK?.endChat();

    if (AppConfig.ChatSDK.liveChatContext.cache) {
      localStorage.removeItem('liveChatContext');
    }

    setWidgetState(WidgetState.ENDED);
  }, [chatSDK, widgetState]);

  const WebChatThemeProvider = AppConfig.WebChat.FluentThemeProvider.disabled === false ? FluentThemeProvider: Fragment;
  return (
    <>
      <h1>ChatSDK Sample</h1>
      <AppDetails />
      <WidgetConfigurations chatConfig={chatConfig} />
      <ChatCommands startChat={startChat} endChat={endChat} />
      {widgetState === WidgetState.OFFLINE && <WidgetContainer>
        <ChatHeader onClose={endChat} onMinimize={() => {setWidgetState(WidgetState.MINIMIZED)}}/>
          <div style={{backgroundColor: 'white', width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
            <span> Offline </span>
          </div>
        </WidgetContainer>
      }
      {widgetState === WidgetState.LOADING && AppConfig.widget.loadingPane.disabled === false && <WidgetContainer>
          <ChatHeader onClose={endChat} onMinimize={() => {setWidgetState(WidgetState.MINIMIZED)}}/>
          <div style={{backgroundColor: 'white', width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
            <span> Loading </span>
          </div>
        </WidgetContainer>
      }
      { widgetState === WidgetState.CHAT && <WidgetContainer>
          <ChatHeader onClose={endChat} onMinimize={() => {setWidgetState(WidgetState.MINIMIZED)}}/>
          {chatAdapter &&
            <WebChatThemeProvider>
              <ReactWebChat
                directLine={chatAdapter}
                styleOptions={AppConfig.WebChat.styleOptions}
                activityMiddleware={createActivityMiddleware()}
              />
            </WebChatThemeProvider>
          }
        </WidgetContainer>
      }
      { (widgetState === WidgetState.READY || widgetState === WidgetState.MINIMIZED) && AppConfig.widget.chatButton.disabled === false &&
        <ChatButton handleClick={startChat}/>
      }
    </>
  )
}

export default App;