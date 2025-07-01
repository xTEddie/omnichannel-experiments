import * as AdaptiveCards from 'adaptivecards';
import { useCallback, useEffect, useState, Fragment } from 'react'
import { OmnichannelChatSDK } from '@microsoft/omnichannel-chat-sdk';
import { FluentThemeProvider } from 'botframework-webchat-fluent-theme';
import { createStore } from "botframework-webchat";
import { Components } from 'botframework-webchat';
import AppConfig from './configs/AppConfig';
import AppDetails from './components/AppDetails/AppDetails';
import fetchDebugConfig from './utils/fetchDebugConfig';
import fetchOmnichannelConfig from './utils/fetchOmnichannelConfig';
import fetchChatSDKConfig from './utils/fetchChatSDKConfig';
import fetchChatReconnectConfig from './utils/fetchChatReconnectConfig';
import fetchAuthToken from './utils/fetchAuthToken';
import ChatButton from './components/ChatButton/ChatButton';
import ChatCommands from './components/ChatCommands/ChatCommands';
import ChatHeader from './components/ChatHeader/ChatHeader';
import createActivityMiddleware from './middlewares/native/createActivityMiddleware';
import createAttachmentMiddleware from './middlewares/native/createAttachmentMiddleware';
import createCardActionMiddleware from './middlewares/native/createCardActionMiddleware';
import createSendBoxMiddleware from './middlewares/native/createSendBoxMiddleware';
import LiveChatConfigurations from './components/LiveChatConfigurations/LiveChatConfigurations';
import WidgetContainer from './components/WidgetContainer/WidgetContainer';
import WidgetContent from './components/WidgetContent/WidgetContent';
import WidgetState from './common/WidgetState';
import getLiveChatContextFromCache from './utils/getLiveChatContextFromCache';
import parseLowerCaseString from './utils/parseLowerCaseString';
import useSuperChatAdapter from './utils/useSuperChatAdapter';
import './App.css';

enum PostChatSurveyMode {
  Embed = '192350000',
  Link = '192350001'
};

function App() {
  const [widgetState, setWidgetState] = useState(WidgetState.UNKNOWN);
  const [recentWidgetState, setRecentWidgetState] = useState(WidgetState.UNKNOWN);
  const [chatSDK, setChatSDK] = useState<OmnichannelChatSDK>();
  const [chatConfig, setChatConfig] = useState<any>(undefined);
  const [chatAdapter, setChatAdapter] = useState<any>(undefined);
  const [liveChatContext, setLiveChatContext] = useState<any>(undefined);
  const [isOutOfOperatingHours, setIsOutOfOperatingHours] = useState(false);
  const [isPreChatSurveyEnabled, setIsPreChatSurveyEnabled] = useState(false);
  const [isChatReconnect, setIsChatReconnect] = useState(false);
  const [renderedPreChatSurveyCard, setRenderedPreChatSurveyCard] = useState<any>(undefined);
  const [preChatResponse, setPreChatResponse] = useState<any>(undefined);
  const [isPostChatSurvey, setIsPostChatSurvey] = useState(false);
  const [postChatSurveyMode, setPostChatSurveyMode] = useState<PostChatSurveyMode>();
  const [embedPostChatSurvey, setEmbedPostChatSurvey] = useState<any> (undefined);;
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [styleOptions, setStyleOptions] = useState<any>({});
  const [conversationEndedByAgentFirst, setConversationEndedByAgentFirst] = useState(false);
  const chatReconnectConfig = fetchChatReconnectConfig();
  const { Composer, BasicWebChat } = Components;
  const store = createStore(
    {} // initial state
  );

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
      const {OutOfOperatingHours, msdyn_conversationmode, msdyn_enablechatreconnect, msdyn_prechatenabled, msdyn_postconversationsurveyenable, msdyn_postconversationsurveymode} = LiveWSAndLiveChatEngJoin;
      setIsPreChatSurveyEnabled(parseLowerCaseString(msdyn_prechatenabled) === 'true');
      setPostChatSurveyMode(msdyn_postconversationsurveymode);
      setIsOutOfOperatingHours(parseLowerCaseString(OutOfOperatingHours) === 'true');
      setIsChatReconnect(msdyn_conversationmode === "192350000" && parseLowerCaseString(msdyn_enablechatreconnect) === 'true');
      setIsPostChatSurvey(parseLowerCaseString(msdyn_postconversationsurveyenable) === 'true');
      setWidgetState(WidgetState.READY);
    }

    init();
  }, []);

  useEffect(() => {
    AppConfig.widget.WidgetState.log && console.log(widgetState);
  }, [widgetState]);

  useEffect(() => {
    if (widgetState === WidgetState.PRECHATSURVEYSUBMITTED && AppConfig.widget.preChatSurveyPane.disabled === false) {
      startChat(); // Starts chat once pre-chat survey is submitted
      return;
    }

    if (widgetState === WidgetState.READONLY && AppConfig.widget.postChatSurveyPane.disabled === false) {
      setStyleOptions({hideSendBox: true});
    }

    if (widgetState === WidgetState.ENDED) {
      if (isPostChatSurvey && AppConfig.widget.postChatSurveyPane.disabled === false) {
        if (postChatSurveyMode === PostChatSurveyMode.Link) {
          setWidgetState(WidgetState.READONLY);
          return;
        }

        const renderPostChatSurvey = async () => {
          const requestId = chatSDK?.requestId; // save the requestId for later use
          (chatSDK as any).requestId = liveChatContext?.requestId;
          (chatSDK as any).chatToken = liveChatContext?.chatToken;

          const postChatSurveyContext = await chatSDK?.getPostChatSurveyContext();

          let embedPostChatSurvey = undefined;
          if (postChatSurveyMode === PostChatSurveyMode.Embed) {
            if (postChatSurveyContext?.participantType === 'User') {
              embedPostChatSurvey = (
                <iframe
                  src={postChatSurveyContext?.surveyInviteLink}
                  style={{
                    height: "inherit",
                    width: "100%",
                    display: "block",
                    border: 0
                  }} />
              );
            } else if (postChatSurveyContext?.participantType === 'Bot') {
              embedPostChatSurvey = (
                <iframe
                  src={postChatSurveyContext?.botSurveyInviteLink || postChatSurveyContext?.surveyInviteLink}
                  style={{
                    height: "inherit",
                    width: "100%",
                    display: "block",
                    border: 0
                  }} />
              );
            }
          }

          setEmbedPostChatSurvey(embedPostChatSurvey);

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
  }, [chatSDK, widgetState, isPostChatSurvey, postChatSurveyMode, liveChatContext]);

  const startChat = useCallback(async () => {
    if (errorMessage && AppConfig.widget.errorPane.disabled === false) {
      setWidgetState(WidgetState.ERROR);
      return;
    }

    if (isOutOfOperatingHours && AppConfig.widget.offlinePane.disabled === false) {
      setWidgetState(WidgetState.OFFLINE);
      return;
    }

    let cachedLiveChatContext = undefined;
    if (AppConfig.ChatSDK.liveChatContext.retrieveFromCache) {
      cachedLiveChatContext = getLiveChatContextFromCache();
    }

    const optionalParams: any = {};
    let skipPreChatSurvey = false;
    if (widgetState === WidgetState.READY && isChatReconnect) {
      if (chatReconnectConfig?.reconnectId) {
        const {reconnectId} = chatReconnectConfig;
        const chatReconnectContext = await chatSDK?.getChatReconnectContext({reconnectId});
        if (chatReconnectContext?.reconnectId) {
          optionalParams.reconnectId = chatReconnectConfig.reconnectId;
          skipPreChatSurvey = true;
        }
      }
    }

    if (widgetState === WidgetState.READY && !skipPreChatSurvey && isPreChatSurveyEnabled && AppConfig.widget.preChatSurveyPane.disabled === false && !cachedLiveChatContext) {
      const adaptiveCard = new AdaptiveCards.AdaptiveCard();
      const preChatSurveyRaw = await chatSDK?.getPreChatSurvey(false);
      const preChatSurvey = JSON.parse(preChatSurveyRaw.replaceAll("&#42;", "*")); // HTML entities '&#42;' is not unescaped for some reason
      if (AppConfig.widget.preChatSurveyPane.log === true) {
        console.log(preChatSurvey);
      }

      adaptiveCard.parse(preChatSurvey);

      adaptiveCard.onExecuteAction = (action: any) => {
        const preChatResponse = (action as any).data;

        if (AppConfig.widget.preChatSurveyPane.log === true) {
          console.log(preChatResponse);
        }

        setPreChatResponse(preChatResponse);
        setWidgetState(WidgetState.PRECHATSURVEYSUBMITTED);
      }

      const renderedPreChatSurveyCard = adaptiveCard.render(); // Renders as HTML element
      setRenderedPreChatSurveyCard(renderedPreChatSurveyCard);

      setWidgetState(WidgetState.PRECHATSURVEY);
      return;
    }

    if (widgetState === WidgetState.CHAT) {
      return;
    }

    if (widgetState === WidgetState.MINIMIZED) { // Resumes chat
      if (recentWidgetState !== WidgetState.UNKNOWN) {
        setRecentWidgetState(WidgetState.UNKNOWN);
        setWidgetState(recentWidgetState);
      }
      return;
    }

    if (AppConfig.widget.loadingPane.disabled === false) {
      setWidgetState(WidgetState.LOADING);
    }

    if (preChatResponse && AppConfig.widget.preChatSurveyPane.disabled === false) {
      optionalParams.preChatResponse = preChatResponse;
    }

    if (AppConfig.ChatSDK.liveChatContext.retrieveFromCache) {
      if (cachedLiveChatContext) {
        optionalParams.liveChatContext = cachedLiveChatContext;
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
    await chatSDK?.onAgentEndSession(() => {
      AppConfig.ChatSDK.onAgentEndSession.log && console.log(`Agent ended session!`);

      setConversationEndedByAgentFirst(true);
      if (isPostChatSurvey && AppConfig.widget.postChatSurveyPane.disabled === false) {
        setWidgetState(WidgetState.ENDED);
      }
    });
    await chatSDK?.onNewMessage((message: any) => {
      AppConfig.ChatSDK.onNewMessage.log && console.log(`New message!`);
      AppConfig.ChatSDK.onNewMessage.log && console.log(message?.content);
    });

    let chatAdapter = await chatSDK?.createChatAdapter();
    if (AppConfig.WebChat.superChatAdapter.disabled === false) {
      chatAdapter = useSuperChatAdapter(await chatSDK?.createChatAdapter());
    }
    setChatAdapter(chatAdapter);
  }, [chatSDK, widgetState, recentWidgetState, errorMessage, isOutOfOperatingHours, isChatReconnect, isPreChatSurveyEnabled, preChatResponse]);

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
      if (conversationEndedByAgentFirst) {
        await chatSDK?.endChat();
      }

      setEmbedPostChatSurvey(undefined);
      setLiveChatContext(null);
      setStyleOptions({});
      setConversationEndedByAgentFirst(false);
      setWidgetState(WidgetState.READY);
      return;
    }

    if (widgetState === WidgetState.READONLY && AppConfig.widget.postChatSurveyPane.disabled === false) {
      if (conversationEndedByAgentFirst) {
        await chatSDK?.endChat();
      }

      setEmbedPostChatSurvey(undefined);
      setLiveChatContext(null);
      setStyleOptions({});
      setConversationEndedByAgentFirst(false);
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
  }, [chatSDK, widgetState, conversationEndedByAgentFirst]);

  const onMinimize = useCallback(() => {
    setRecentWidgetState(widgetState);
    setWidgetState(WidgetState.MINIMIZED);
  }, [widgetState]);

  const WebChatThemeProvider = AppConfig.WebChat.FluentThemeProvider.disabled === false ? FluentThemeProvider: Fragment;
  return (
    <>
      <h1>ChatSDK Sample</h1>
      <AppDetails />
      <LiveChatConfigurations chatConfig={chatConfig} />
      <ChatCommands startChat={startChat} endChat={endChat} />
      {widgetState === WidgetState.ERROR && AppConfig.widget.errorPane.disabled === false && <WidgetContainer>
        <ChatHeader onClose={endChat} onMinimize={onMinimize}/>
          <WidgetContent>
            <span> {errorMessage || 'Error'} </span>
          </WidgetContent>
        </WidgetContainer>
      }
      {widgetState === WidgetState.OFFLINE && AppConfig.widget.offlinePane.disabled === false && <WidgetContainer>
        <ChatHeader onClose={endChat} onMinimize={onMinimize}/>
          <WidgetContent>
            <span> Offline </span>
          </WidgetContent>
        </WidgetContainer>
      }
      {widgetState === WidgetState.PRECHATSURVEY && AppConfig.widget.preChatSurveyPane.disabled === false && <WidgetContainer>
        <ChatHeader onClose={endChat} onMinimize={onMinimize}/>
          <WidgetContent>
          <div ref={(n) => { // Returns React element
            n && n.firstChild && n.removeChild(n.firstChild); // Removes duplicates fix
            renderedPreChatSurveyCard && n && n.appendChild(renderedPreChatSurveyCard);
          }} />
          </WidgetContent>
        </WidgetContainer>
      }
      {widgetState === WidgetState.LOADING && AppConfig.widget.loadingPane.disabled === false && <WidgetContainer>
        <ChatHeader onClose={endChat} onMinimize={onMinimize}/>
          <WidgetContent>
            <span> Loading </span>
          </WidgetContent>
        </WidgetContainer>
      }
      { (widgetState === WidgetState.CHAT || (widgetState === WidgetState.READONLY && AppConfig.widget.postChatSurveyPane.disabled === false)) && <WidgetContainer>
        <ChatHeader onClose={endChat} onMinimize={onMinimize}/>
          {chatAdapter &&
            <WebChatThemeProvider>
              <Composer
                store={store}
                directLine={chatAdapter}
                styleOptions={{...AppConfig.WebChat.styleOptions, ...styleOptions}}
                activityMiddleware={createActivityMiddleware()}
                attachmentMiddleware={createAttachmentMiddleware()}
                cardActionMiddleware={createCardActionMiddleware()}
                sendBoxMiddleware={createSendBoxMiddleware()}
              >
                <BasicWebChat />
              </Composer>
            </WebChatThemeProvider>
          }
        </WidgetContainer>
      }
      { widgetState === WidgetState.POSTCHATSURVEY && AppConfig.widget.postChatSurveyPane.disabled === false && <WidgetContainer>
        <ChatHeader onClose={endChat} onMinimize={onMinimize}/>
          <WidgetContent>
            {embedPostChatSurvey}
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