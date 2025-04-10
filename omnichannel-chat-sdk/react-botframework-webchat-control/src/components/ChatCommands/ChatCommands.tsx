interface ChatCommandsProps {
  startChat: () => void;
  endChat: () => void;
};

const ChatCommands = (props: ChatCommandsProps) => {
  return (
    <>
      <div
        className="card"
        style={{
          border: '1px solid rgb(209, 209, 209)',
          borderRadius: '8px',
          padding: '8px'
        }}
      >
        <h2 style={{fontWeight: 500, margin: '10px 15px 10px'}}> Commands </h2>
        <button onClick={props.startChat}>
          Start Chat
        </button>
        <button onClick={props.endChat}>
          End Chat
        </button>
      </div>
    </>
  )
}

export default ChatCommands;