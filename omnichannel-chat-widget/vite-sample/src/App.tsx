import { useEffect, useState } from 'react'
import { ILiveChatWidgetProps } from "@microsoft/omnichannel-chat-widget/lib/types/components/livechatwidget/interfaces/ILiveChatWidgetProps";//
import { OmnichannelChatSDK } from '@microsoft/omnichannel-chat-sdk';
import { LiveChatWidget } from '@microsoft/omnichannel-chat-widget';
import fetchOmnichannelConfig from './utils/fetchOmnichannelConfig';
import './App.css'

function App() {
  const [liveChatWidgetProps, setLiveChatWidgetProps] = useState<ILiveChatWidgetProps>();

  useEffect(() => {
    const omnichannelChatConfig = fetchOmnichannelConfig();
    console.log(omnichannelChatConfig);

    const init = async () => {
      const chatSDK = new OmnichannelChatSDK(omnichannelChatConfig);
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
        chatSDK,
        chatConfig
      };
      setLiveChatWidgetProps(liveChatWidgetProps);
    };

    init();
  }, []);
  return (
    <>
      <h1>Vite + Omnichannel Chat Widget</h1>
      <div>
        {liveChatWidgetProps && <LiveChatWidget {...liveChatWidgetProps} />}
      </div>
    </>
  )
}

export default App
