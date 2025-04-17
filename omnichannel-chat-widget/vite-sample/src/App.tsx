import { useCallback, useEffect, useState } from 'react'
import { ILiveChatWidgetProps } from '@microsoft/omnichannel-chat-widget/lib/types/components/livechatwidget/interfaces/ILiveChatWidgetProps';
import { OmnichannelChatSDK } from '@microsoft/omnichannel-chat-sdk';
import { BroadcastService, LiveChatWidget } from '@microsoft/omnichannel-chat-widget';
import AppConfig from './configs/AppConfig';
import fetchOmnichannelConfig from './utils/fetchOmnichannelConfig';
import fetchChatSDKConfig from './utils/fetchChatSDKConfig';
import fetchAuthToken from './utils/fetchAuthToken';
import AppDetails from './components/AppDetails/AppDetails';
import ChatCommands from './components/ChatCommands/ChatCommands';
import './App.css';

function App() {
  const [liveChatWidgetProps, setLiveChatWidgetProps] = useState<ILiveChatWidgetProps>();

  useEffect(() => {
    const omnichannelChatConfig = fetchOmnichannelConfig();
    console.log(omnichannelChatConfig);

    const init = async () => {
      const authToken = await fetchAuthToken({option: 'api'});
      const chatSDKConfig = fetchChatSDKConfig({ authToken });
      const chatSDK = new OmnichannelChatSDK(omnichannelChatConfig, chatSDKConfig);
      const chatConfig = await chatSDK.initialize();
      const liveChatWidgetProps = {
        styleProps: {
          generalStyles: {
            bottom: "20px",
            right: "20px",
            width: "360px",
            height: "560px"
          }
        },
        headerProps: {
          styleProps: {
            generalStyleProps: {
              height: "70px"
            }
          }
        },
        webChatContainerProps: {
          webChatStyles: {
            hideUploadButton: false
          }
        },
        controlProps: {
          hideChatButton: AppConfig.ChatWidget.hideChatButton,
        },
        chatSDK,
        chatConfig,
        getAuthToken: () => authToken
      };
      setLiveChatWidgetProps(liveChatWidgetProps);
    };

    init();
  }, []);

  const startChat = useCallback(async () => {
    BroadcastService.postMessage({
      eventName: 'StartChat',
    });
  }, []);

  const endChat = useCallback(() => {
    BroadcastService.postMessage({
      eventName: 'InitiateEndChat',
    });
  }, []);

  return (
    <>
      <h1>Vite + Omnichannel Chat Widget</h1>
      <AppDetails />
      <ChatCommands startChat={startChat} endChat={endChat} />
      <div>
        {liveChatWidgetProps && <LiveChatWidget {...liveChatWidgetProps} />}
      </div>
    </>
  )
}

export default App
