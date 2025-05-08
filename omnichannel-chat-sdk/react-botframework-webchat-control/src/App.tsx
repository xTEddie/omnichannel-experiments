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
import createAttachmentMiddleware from './middlewares/native/createAttachmentMiddleware';
import LiveChatConfigurations from './components/LiveChatConfigurations/LiveChatConfigurations';
import WidgetContainer from './components/WidgetContainer/WidgetContainer';
import WidgetContent from './components/WidgetContent/WidgetContent';
import parseLowerCaseString from './utils/parseLowerCaseString';
import './App.css';

enum WidgetState {
  UNKNOWN = 'UNKNOWN',
  READY = 'READY', // Widget is ready to be used
  LOADING = 'LOADING', // Chat started but not fully completed yet
  CHAT = 'CHAT', // Chat is in progress
  ENDED = 'ENDED', // Chat has ended
  POSTCHATSURVEY = 'POSTCHATSURVEY',
  MINIMIZED = 'MINIMIZED', // Chat is minimized
  OFFLINE = 'OFFLINE', // Chat is out of business hours
  ERROR = 'ERROR' // Chat is in error state
};

function App() {
  const [widgetState, setWidgetState] = useState(WidgetState.UNKNOWN);
  const [chatSDK, setChatSDK] = useState<OmnichannelChatSDK>();
  const [chatConfig, setChatConfig] = useState<any>(undefined);
  const [chatAdapter, setChatAdapter] = useState<any>(undefined);
  const [liveChatContext, setLiveChatContext] = useState<any>(undefined);
  const [isOutOfOperatingHours, setIsOutOfOperatingHours] = useState(false);
  const [isPostChatSurvey, setIsPostChatSurvey] = useState(false);
  const [postChatSurveyContext, setPostChatSurveyContext] = useState<any>(undefined);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

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
      const {OutOfOperatingHours, msdyn_postconversationsurveyenable} = LiveWSAndLiveChatEngJoin;
      setIsOutOfOperatingHours(parseLowerCaseString(OutOfOperatingHours) === 'true');
      setIsPostChatSurvey(parseLowerCaseString(msdyn_postconversationsurveyenable) === 'true');

      setWidgetState(WidgetState.READY);
    }

    init();
  }, []);

  useEffect(() => {
    if (widgetState === WidgetState.ENDED) {
      if (isPostChatSurvey && AppConfig.widget.postChatSurveyPane.disabled === false) {
        const renderPostChatSurvey = async () => {
          const requestId = chatSDK?.requestId; // save the requestId for later use
          (chatSDK as any).requestId = liveChatContext?.requestId;
          (chatSDK as any).chatToken = liveChatContext?.chatToken;

          const postChatSurveyContext = await chatSDK?.getPostChatSurveyContext();
          setPostChatSurveyContext(postChatSurveyContext);

          // Clean up
          (chatSDK as any).requestId = requestId;
          (chatSDK as any).chatToken = {};

          setWidgetState(WidgetState.POSTCHATSURVEY);
        }

        renderPostChatSurvey();
        return;
      }

      setWidgetState(WidgetState.READY);
    }
  }, [chatSDK, widgetState, isPostChatSurvey, liveChatContext]);

  const startChat = useCallback(async () => {
    if (errorMessage && AppConfig.widget.errorPane.disabled === false) {
      setWidgetState(WidgetState.ERROR);
      return;
    }

    if (isOutOfOperatingHours && AppConfig.widget.offlinePane.disabled === false) {
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

    try {
      await chatSDK?.startChat(optionalParams);
    } catch (error: any) {
      if (AppConfig.widget.errorPane.disabled === false) {
        if (error?.message === 'InvalidConversation') {
          setErrorMessage('Conversation not found');
        }

        if (error?.message === 'ClosedConversation') {
          setErrorMessage('Conversation has been closed');
        }

        if (error?.message === 'GetAuthTokenNotFound') {
          setErrorMessage('GetAuthToken function not implemented');
        }

        if (error?.message === 'ChatTokenRetrievalFailure' && error?.httpResponseStatusCode === 401) {
          setErrorMessage('Invalid auth token');
        }

        console.error(error);
        setWidgetState(WidgetState.ERROR);
        return;
      }

      throw error;
    }
    const liveChatContext = await chatSDK?.getCurrentLiveChatContext();
    setLiveChatContext(liveChatContext);
    if (AppConfig.ChatSDK.liveChatContext.cache) {
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
  }, [chatSDK, widgetState, errorMessage, isOutOfOperatingHours]);

  const endChat = useCallback(async () => {
    if (widgetState === WidgetState.ERROR && AppConfig.widget.errorPane.disabled === false) {
      setErrorMessage(null);
      setWidgetState(WidgetState.READY);
      return;
    }

    if (widgetState === WidgetState.OFFLINE && AppConfig.widget.offlinePane.disabled === false) {
      setWidgetState(WidgetState.MINIMIZED);
      return;
    }

    if (widgetState === WidgetState.POSTCHATSURVEY && AppConfig.widget.postChatSurveyPane.disabled === false) {
      setPostChatSurveyContext(null);
      setLiveChatContext(null);
      setWidgetState(WidgetState.READY);
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
      <LiveChatConfigurations chatConfig={chatConfig} />
      <ChatCommands startChat={startChat} endChat={endChat} />
      {widgetState === WidgetState.ERROR && AppConfig.widget.errorPane.disabled === false && <WidgetContainer>
        <ChatHeader onClose={endChat} onMinimize={() => {setWidgetState(WidgetState.MINIMIZED)}}/>
          <WidgetContent>
            <span> {errorMessage || 'Error'} </span>
          </WidgetContent>
        </WidgetContainer>
      }
      {widgetState === WidgetState.OFFLINE && AppConfig.widget.offlinePane.disabled === false && <WidgetContainer>
        <ChatHeader onClose={endChat} onMinimize={() => {setWidgetState(WidgetState.MINIMIZED)}}/>
          <WidgetContent>
            <span> Offline </span>
          </WidgetContent>
        </WidgetContainer>
      }
      {widgetState === WidgetState.LOADING && AppConfig.widget.loadingPane.disabled === false && <WidgetContainer>
          <ChatHeader onClose={endChat} onMinimize={() => {setWidgetState(WidgetState.MINIMIZED)}}/>
          <WidgetContent>
            <span> Loading </span>
          </WidgetContent>
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
                attachmentMiddleware={createAttachmentMiddleware()}
              />
            </WebChatThemeProvider>
          }
        </WidgetContainer>
      }
      { widgetState === WidgetState.POSTCHATSURVEY && AppConfig.widget.postChatSurveyPane.disabled === false && <WidgetContainer>
          <ChatHeader onClose={endChat} onMinimize={() => {setWidgetState(WidgetState.MINIMIZED)}}/>
          <WidgetContent>
            <iframe
              src={postChatSurveyContext?.surveyInviteLink}
              style={{
                height: "inherit",
                width: "100%",
                display: "block",
                border: 0
              }} />
          </WidgetContent>
        </WidgetContainer>
      }
      { (widgetState === WidgetState.READY || widgetState === WidgetState.MINIMIZED) && AppConfig.widget.chatButton.disabled === false &&
        <ChatButton handleClick={startChat}/>
      }
    </>
  )
}

export default App;