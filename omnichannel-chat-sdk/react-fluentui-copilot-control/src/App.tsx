import { useCallback, useEffect, useState } from 'react'
import { OmnichannelChatSDK } from '@microsoft/omnichannel-chat-sdk';
import AppConfig from './configs/AppConfig';
import AppDetails from './components/AppDetails/AppDetails';
import ChatCommands from './components/ChatCommands/ChatCommands';
import fetchOmnichannelConfig from './utils/fetchOmnichannelConfig';
import WidgetState from './common/WidgetState';
import './App.css'

function App() {
  const [widgetState, setWidgetState] = useState(WidgetState.UNKNOWN);
  const [chatSDK, setChatSDK] = useState<OmnichannelChatSDK>();

  useEffect(() => {
    const init = async () => {
      const omnichannelConfig = fetchOmnichannelConfig();
      const chatSDK = new OmnichannelChatSDK(omnichannelConfig);
      await chatSDK.initialize();

      setChatSDK(chatSDK);

      const chatConfig = await chatSDK.getLiveChatConfig();
      if (AppConfig.ChatSDK.liveChatConfig.log) {
        console.log(chatConfig);
      }

      setWidgetState(WidgetState.READY);
    }

    init();
  }, []);

  useEffect(() => {
    AppConfig.widget.WidgetState.log && console.log(widgetState);
  }, [widgetState]);

  useEffect(() => {
    if (widgetState === WidgetState.ENDED) {
      setWidgetState(WidgetState.READY);
    }
  }, [widgetState]);

  const startChat = useCallback(async () => {
    if (!chatSDK) {
      return;
    }

    if (widgetState === WidgetState.CHAT) {
      return;
    }

    try {
      await chatSDK.startChat();
    } catch (error: any) {
      console.error(error);
    }

    await chatSDK?.onNewMessage((message: any) => {
      AppConfig.ChatSDK.onNewMessage.log && console.log(`New message!`);
      AppConfig.ChatSDK.onNewMessage.log && console.log(message?.content);
    });

    setWidgetState(WidgetState.CHAT);

    console.log("Chat started!");
  }, [chatSDK, widgetState]);

  const endChat = useCallback(async () => {
    if (!chatSDK) {
      return;
    }

    if (widgetState !== WidgetState.CHAT) {
      return;
    }

    try {
      await chatSDK.endChat();
    } catch (error: any) {
      console.error(error);
    }

    console.log("Chat ended!");
    setWidgetState(WidgetState.ENDED);
  }, [chatSDK, widgetState]);

  return (
    <>
      <h1>ChatSDK Sample</h1>
      <AppDetails />
      <ChatCommands startChat={startChat} endChat={endChat}/>
    </>
  )
}

export default App
