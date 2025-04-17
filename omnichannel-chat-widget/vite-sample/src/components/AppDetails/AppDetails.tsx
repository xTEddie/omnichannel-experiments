import { version as chatWidgetVersion } from '@microsoft/omnichannel-chat-widget/package.json';
import { version as chatComponentsVersion } from '@microsoft/omnichannel-chat-components/package.json';
import { version as chatSDKversion } from '@microsoft/omnichannel-chat-sdk/package.json';
import { version as OCSDKVersion } from '@microsoft/ocsdk/package.json';
import { version as webChatVersion } from 'botframework-webchat/package.json';
import { version as chatAdapterVersion } from '@microsoft/botframework-webchat-adapter-azure-communication-chat/package.json';

const AppDetails = () => {
  console.log(`ocsdk@${OCSDKVersion}`);
  console.log(`omnichannel-chat-sdk@${chatSDKversion}`);
  console.log(`omnichannel-chat-components@${chatComponentsVersion}`);
  console.log(`omnichannel-chat-widget@${chatWidgetVersion}`);
  console.log(`botframework-webchat@${webChatVersion}`);
  console.log(`botframework-webchat-adapter-azure-communication-chat@${chatAdapterVersion}`)

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
      name: 'omnichannel-chat-components',
      version: chatComponentsVersion
    },      
    {
      name: 'omnichannel-chat-widget',
      version: chatWidgetVersion
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
        {packageVersions && packageVersions.map((pkg) => (
            <div>
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