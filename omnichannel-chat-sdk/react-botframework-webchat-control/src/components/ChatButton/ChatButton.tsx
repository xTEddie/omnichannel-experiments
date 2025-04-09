import { useCallback, useState } from "react";

interface ChatButtonProps {
  title?: string;
  subtitle?: string;
  handleClick?: () => void;
};

const ChatButton = (props: ChatButtonProps) => {
  const [buttonHovered, setButtonHovered] = useState(false);
  const onButtonClick = useCallback(async () => {
    if (props.handleClick) {
      await props.handleClick();
    }
  }, [props.handleClick]);
  return (
    <>
      <div 
        style={{
            cursor: 'pointer',
            position: 'absolute', 
            bottom: 20, 
            right: 20, 
            height: 50, 
            width: 160, 
            border: '1px solid rgb(209, 209, 209)',
            borderRadius: '100px', 
            display: 'flex', 
            flexDirection: 'row', 
            justifyContent: 'space-between',
            boxShadow: buttonHovered? '0px 0px 15px rgb(209, 209, 209)': '0px 0px 5px rgb(209, 209, 209)',
          }}
          onMouseEnter={() => setButtonHovered(true)}
          onMouseLeave={() => setButtonHovered(false)}
          onClick={onButtonClick}
        >
        <div 
          style={{            
            width: 50, 
            height: 50, 
            border: '1px solid rgb(209, 209, 209)', 
            borderRadius: '100%',            
            backgroundColor: buttonHovered? 'rgb(255, 228, 23)': 'rgb(0, 0, 0)',
            boxShadow: buttonHovered? '0px 0px 10px rgb(255, 228, 23)': 'none',
          }}
        >
          <span style={{
            fontSize: 30,
            opacity: buttonHovered? 0.3: 1
          }}>
            ⚡
          </span>
        </div>
        <div style={{display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '0 20px 0 0'}}> 
          <span style={{fontSize: 16, fontWeight: 500}}>
            {props.title || `Questions?`}
          </span>
          <span style={{fontSize: 14, fontWeight: 400}}>            
            {props.subtitle || `Let's Talk!`}
          </span>
        </div>
      </div>
    </>
  );
};

export default ChatButton;