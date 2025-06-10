import { useCallback, useEffect, useState } from 'react'
import { OmnichannelChatSDK } from '@microsoft/omnichannel-chat-sdk';
import AppConfig from './configs/AppConfig';
import AppDetails from './components/AppDetails/AppDetails';
import ChatCommands from './components/ChatCommands/ChatCommands';
import ChatHeader from './components/ChatHeader/ChatHeader';
import fetchOmnichannelConfig from './utils/fetchOmnichannelConfig';
import WidgetContainer from './components/WidgetContainer/WidgetContainer';
import WidgetContent from './components/WidgetContent/WidgetContent';
import WidgetState from './common/WidgetState';
import './App.css'

function App() {
  const [widgetState, setWidgetState] = useState(WidgetState.UNKNOWN);
  const [chatSDK, setChatSDK] = useState<OmnichannelChatSDK>();
  const [messages, setMessages] = useState<any[]>([]);
  const [userMessage, setUserMessage] = useState<string>('');

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
      setMessages((prevMessages) => [...prevMessages, message]);
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

  const onTextChange = useCallback((event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setUserMessage(event.target.value);
  }, []);

  const onSend = useCallback(async () => {
    console.log('Send message!');
    const response = await chatSDK.sendMessage({content: userMessage});
    setMessages((prevMessages) => [...prevMessages, response]);
    setUserMessage('');
  }, [chatSDK, userMessage]);

  const onMinimize = useCallback(() => {
    console.log("Minimize!");
  }, []);

  return (
    <>
      <h1>ChatSDK Sample</h1>
      <AppDetails />
      <ChatCommands startChat={startChat} endChat={endChat}/>
      { widgetState === WidgetState.CHAT && <WidgetContainer>
          <ChatHeader onClose={endChat} onMinimize={onMinimize}/>
          <WidgetContent>
            <div style={{display: 'flex', flexDirection: 'column', fontSize: '12px', height: '100%'}}>
              {messages.map((message, index) => {
                return (
                  <li> {message.content} </li>
                );
              })}
            </div>
            <div style={{display: 'flex', width: '100%'}}>
              <textarea placeholder="Type message..." cols="50" rows="5" style={{border: 'none', resize: 'none'}} onChange={onTextChange}></textarea>
              <button onClick={onSend}>Send</button>
            </div>
          </WidgetContent>
        </WidgetContainer>
      }
    </>
  )
}

export default App
