import { useEffect } from "react";
import AppConfig from "../../configs/AppConfig";

interface WidgetContainerProps {
  children: React.ReactNode;
};

const WidgetContainer: React.FC<WidgetContainerProps> = ({children}) => {
  useEffect(() => {
    if (AppConfig.components.WidgetContainer.log) {
      console.log('WidgetContainer');
    }
  }, []);

  return (
    <div style={{position: 'absolute', bottom: 20, right: 20, height: 560, width: 350, border: '1px solid rgb(209, 209, 209)', display: 'flex', flexDirection: 'column'}}>
      {children}
    </div>
  )
};

export default WidgetContainer;