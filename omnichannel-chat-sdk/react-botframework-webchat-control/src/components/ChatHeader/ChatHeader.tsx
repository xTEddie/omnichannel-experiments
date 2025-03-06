import { useCallback } from "react";

interface ChatHeaderProps {
  onClose?: () => void;
}

const ChatHeader = (props: ChatHeaderProps) => {
  const onClose = useCallback(async () => {
    if (props?.onClose) {
      props.onClose();
    }
  }, [props.onClose]);

  return (
    <>
      <div style={{backgroundColor: 'rgb(209, 209, 209)', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
        <h1 style={{margin: 0, padding: '5px 15px', fontSize: 16, fontWeight: 500}}> Chat Demo </h1>
        <span style={{display: 'flex', alignItems: 'center', cursor: 'pointer', padding: 10}} onClick={onClose}> ❌ </span>
      </div>
    </>
  )
}

export default ChatHeader;