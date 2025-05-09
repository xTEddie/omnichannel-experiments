import { version as chatSDKversion } from '@microsoft/omnichannel-chat-sdk/package.json';
import { version as OCSDKVersion } from '@microsoft/ocsdk/package.json';
import { version as webChatVersion } from 'botframework-webchat/package.json';
import { version as chatAdapterVersion } from '@microsoft/botframework-webchat-adapter-azure-communication-chat/package.json';
import { useEffect } from 'react';

const AppDetails = () => {
  useEffect(() => {
    console.log(`ocsdk@${OCSDKVersion}`);
    console.log(`omnichannel-chat-sdk@${chatSDKversion}`);
    console.log(`botframework-webchat@${webChatVersion}`);
    console.log(`botframework-webchat-adapter-azure-communication-chat@${chatAdapterVersion}`)
  }, []);

  const packageVersions = [
    {
      name: 'ocsdk',
      version: OCSDKVersion
    },
    {
      name: 'omnichannel-chat-sdk',
      version: chatSDKversion
    },
    {
      name: 'botframework-webchat',
      version: webChatVersion
    },
    {
      name: 'botframework-webchat-adapter-azure-communication-chat',
      version: chatAdapterVersion
    }
  ];

  return (
    <>
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '5px',
        alignItems: 'flex-start',
        border: '1px solid rgb(209, 209, 209)',
        borderRadius: '8px',
        padding: '8px',
        margin: '0 0 10px 0'
      }}>
        <h2 style={{fontWeight: 500, margin: 0}}> App Details </h2>
        {packageVersions && packageVersions.map((pkg, index) => (
            <div key={index}>
              <span style={{fontWeight: 500}}>{pkg.name}</span>
              <span style={{fontWeight: 600, color: 'red'}}>@</span>
              <span style={{fontWeight: 500, color: '#646cff'}}>{pkg.version}</span>
            </div>
          )
        )}
      </div>
    </>
  );
};

export default AppDetails;