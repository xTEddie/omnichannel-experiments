import { useEffect } from 'react'
import { OmnichannelChatSDK } from '@microsoft/omnichannel-chat-sdk';
import AppConfig from './configs/AppConfig';
import fetchOmnichannelConfig from './utils/fetchOmnichannelConfig';
import './App.css'

function App() {
  useEffect(() => {
    const init = async () => {
      const omnichannelConfig = fetchOmnichannelConfig();
      const chatSDK = new OmnichannelChatSDK(omnichannelConfig);
      await chatSDK.initialize();

      const chatConfig = await chatSDK.getLiveChatConfig();
      if (AppConfig.ChatSDK.liveChatConfig.log) {
        console.log(chatConfig);
      }
    }

    init();
  }, []);

  return (
    <>
      <h1>ChatSDK Sample</h1>
    </>
  )
}

export default App
