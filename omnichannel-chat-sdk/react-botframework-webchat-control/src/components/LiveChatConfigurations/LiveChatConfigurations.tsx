import { useEffect, useState } from "react";
import parseLowerCaseString from "../../utils/parseLowerCaseString";

enum CallingOptionsOptionSetNumber {
    NoCalling = 192350000,
    VideoAndVoiceCalling = 192350001,
    VoiceOnly = 192350002
}

interface WidgetConfigurationsProps {
  chatConfig: any;
}

const LiveChatConfigurations = (props: WidgetConfigurationsProps) => {
  const [isAuthenticatedChat, setIsAuthenticatedChat] = useState(false);
  const [isAttachmentEnabled, setIsAttachmentEnabled] = useState(false);
  const [isPersistentChat, setIsPersistentChat] = useState(false);
  const [isChatReconnect, setIsChatReconnect] = useState(false);
  const [isOperatingHours, setIsOperatingHours] = useState(false);
  const [isOutOfOperatingHours, setIsOutOfOperatingHours] = useState(false);
  const [isPreChatSurvey, setIsPreChatSurvey] = useState(false);
  const [isPostChatSurvey, setIsPostChatSurvey] = useState(false);
  const [callingOptions, setCallingOptions] = useState<CallingOptionsOptionSetNumber | string>();

  useEffect(() => {
    if (props.chatConfig) {
      const {LiveChatConfigOperatingHoursSettings, LiveChatConfigAuthSettings, LiveWSAndLiveChatEngJoin} = props.chatConfig;
      const {msdyn_enablefileattachmentsforagents, msdyn_enablefileattachmentsforcustomers, msdyn_conversationmode, msdyn_enablechatreconnect} = LiveWSAndLiveChatEngJoin;
      const {OutOfOperatingHours, msdyn_prechatenabled, msdyn_postconversationsurveyenable, msdyn_callingoptions} = LiveWSAndLiveChatEngJoin;
      setIsAuthenticatedChat(LiveChatConfigAuthSettings?? false);
      setIsAttachmentEnabled(parseLowerCaseString(msdyn_enablefileattachmentsforagents) === 'true' || parseLowerCaseString(msdyn_enablefileattachmentsforcustomers) === 'true');
      setIsPersistentChat(msdyn_conversationmode === "192350001");
      setIsChatReconnect(msdyn_conversationmode === "192350000" && parseLowerCaseString(msdyn_enablechatreconnect) === 'true');
      setIsOperatingHours(LiveChatConfigOperatingHoursSettings?? false);
      setIsOutOfOperatingHours(parseLowerCaseString(OutOfOperatingHours) === 'true');
      setIsPreChatSurvey(parseLowerCaseString(msdyn_prechatenabled) === 'true');
      setIsPostChatSurvey(parseLowerCaseString(msdyn_postconversationsurveyenable) === 'true');
      setCallingOptions(msdyn_callingoptions);
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
      <h2 style={{fontWeight: 500, margin: '10px 15px 10px'}}> Live Chat Configurations </h2>
      <div style={{textAlign: 'left', padding: '10px', display: 'flex', flexDirection: 'column'}}>
        <div>
          <span> Authenticated </span>
          <input type="checkbox" checked={isAuthenticatedChat} readOnly />
        </div>
        <div>
          <span> Attachment </span>
          <input type="checkbox" checked={isAttachmentEnabled} readOnly />
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
        <div>
          {callingOptions === CallingOptionsOptionSetNumber.NoCalling.toString() && <span> No Calling </span>}
          {callingOptions === CallingOptionsOptionSetNumber.VoiceOnly.toString() && <span> Voice Only </span>}
          {callingOptions === CallingOptionsOptionSetNumber.VideoAndVoiceCalling.toString() && <span> Voice & Video Calling </span>}
          {callingOptions && <input type="checkbox" checked={true} readOnly />}
        </div>
      </div>
    </div>
  )
};

export default LiveChatConfigurations;