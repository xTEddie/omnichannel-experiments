import { useCallback } from "react";

interface ChatHeaderProps {
  onClose?: () => void;
  onMinimize?: () => void;
}

const ChatHeader = (props: ChatHeaderProps) => {
  const onMinimize = useCallback(async () => {
    if (props?.onMinimize) {
      props.onMinimize();
    }
  }, [props.onMinimize]);

  const onClose = useCallback(async () => {
    if (props?.onClose) {
      props.onClose();
    }
  }, [props.onClose]);

  return (
    <>
      <div style={{backgroundColor: 'rgb(209, 209, 209)', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
        <h1 style={{margin: 0, padding: '5px 15px', fontSize: 16, fontWeight: 500}}> Chat Demo </h1>
        <div style={{display: 'flex', alignItems: 'center'}}>
          {props.onMinimize && <span style={{cursor: 'pointer', padding: '10px 5px 10px 10px'}} onClick={onMinimize}> ➖ </span>}
          <span style={{cursor: 'pointer', padding: '10px 10px 10px 5px'}} onClick={onClose}> ❌ </span>
        </div>
      </div>
    </>
  )
}

export default ChatHeader;