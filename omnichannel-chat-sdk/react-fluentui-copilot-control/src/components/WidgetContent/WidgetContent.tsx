interface WidgetContentProps {
  children: React.ReactNode;
};

const WidgetContent: React.FC<WidgetContentProps> = ({children}) => {
  return (
    <div style={{backgroundColor: 'white', width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column'}}>
      {children}
    </div>
  );
};

export default WidgetContent;