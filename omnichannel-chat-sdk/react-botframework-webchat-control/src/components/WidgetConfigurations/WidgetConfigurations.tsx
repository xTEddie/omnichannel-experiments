import { useEffect, useState } from "react";

interface WidgetConfigurationsProps {
  chatConfig: any;
}

const parseLowerCaseString = (property: string | boolean): string => {
  return String(property).toLowerCase();
};

const WidgetConfigurations = (props: WidgetConfigurationsProps) => {
  const [isAuthenticatedChat, setIsAuthenticatedChat] = useState(false);
  const [isPersistentChat, setIsPersistentChat] = useState(false);
  const [isChatReconnect, setIsChatReconnect] = useState(false);
  const [isOperatingHours, setIsOperatingHours] = useState(false);
  const [isOutOfOperatingHours, setIsOutOfOperatingHours] = useState(false);
  const [isPreChatSurvey, setIsPreChatSurvey] = useState(false);
  const [isPostChatSurvey, setIsPostChatSurvey] = useState(false);

  useEffect(() => {
    if (props.chatConfig) {
      const {LiveChatConfigOperatingHoursSettings, LiveChatConfigAuthSettings, LiveWSAndLiveChatEngJoin} = props.chatConfig;
      const {msdyn_conversationmode, msdyn_enablechatreconnect} = LiveWSAndLiveChatEngJoin;
      const {OutOfOperatingHours, msdyn_prechatenabled, msdyn_postconversationsurveyenable} = LiveWSAndLiveChatEngJoin;
      setIsAuthenticatedChat(LiveChatConfigAuthSettings?? false);
      setIsPersistentChat(msdyn_conversationmode === "192350001");
      setIsChatReconnect(msdyn_conversationmode === "192350000" && parseLowerCaseString(msdyn_enablechatreconnect) === 'true');
      setIsOperatingHours(LiveChatConfigOperatingHoursSettings?? false);
      setIsOutOfOperatingHours(parseLowerCaseString(OutOfOperatingHours) === 'true');
      setIsPreChatSurvey(parseLowerCaseString(msdyn_prechatenabled) === 'true');
      setIsPostChatSurvey(parseLowerCaseString(msdyn_postconversationsurveyenable) === 'true');
    }
  }, [props.chatConfig]);

  return (
    <div
      style={{
        border: '1px solid rgb(209, 209, 209)',
        borderRadius: '8px',
        padding: '8px',
        margin: '0 0 10px 0',
      }}
    >      
      <h2 style={{fontWeight: 500, margin: '10px 15px 10px'}}> Widget Configurations </h2>
      <div style={{textAlign: 'left', padding: '10px', display: 'flex', flexDirection: 'column'}}>
        <div>
          <span> Authenticated </span>
          <input type="checkbox" checked={isAuthenticatedChat} readOnly />
        </div>
        <div>
          <span> Reconnect Chat </span>
          <input type="checkbox" checked={isChatReconnect} readOnly />
        </div>
        <div>
          <span> Persistent Chat </span>
          <input type="checkbox" checked={isPersistentChat} readOnly />
        </div>
        <div>
          <span> Operating Hours </span>
          <input type="checkbox" checked={isOperatingHours} readOnly />
        </div>
        <div>
          <span> Offline </span>
          <input type="checkbox" checked={isOutOfOperatingHours} readOnly />
        </div>
        <div>
          <span> Pre-chat Survey </span>
          <input type="checkbox" checked={isPreChatSurvey} readOnly />
        </div>
        <div>
          <span> Post-chat Survey </span>
          <input type="checkbox" checked={isPostChatSurvey} readOnly />
        </div>
      </div>
    </div>
  )
};

export default WidgetConfigurations;