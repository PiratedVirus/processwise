import React from 'react';
import { Button } from 'antd';
import { useDispatch, useSelector } from 'react-redux';

interface ButtonConfig {
  text: string;
  onClick: () => void;
  className?: string;
  hidden?: boolean;
}

interface HeaderTitleProps {
  title?: string;
  titleNode?: React.ReactNode;
  showButtons?: boolean;
  buttons?: ButtonConfig[];
  cancelAction?: () => void; // Add cancelAction prop
  renderTabContent?: React.ReactNode;
}

const HeaderTitle: React.FC<HeaderTitleProps> = ({ title, titleNode, renderTabContent, showButtons = false, buttons = [], cancelAction }) => {
  const isHeaderBtnVisible = useSelector((state: any) => state.uiInteraction.isHeaderBtnVisible);

  // const cancelButtonConfig: ButtonConfig = {
  //   text: 'Cancel',
  //   onClick: cancelAction ? cancelAction : () => {}, 
  //   className: 'bg-white-500 text-white',
  // };

  return (
    <>
      <div className="w-full bg-slate-100 mb-2 py-5 flex justify-between items-center">

          {titleNode ? titleNode : (title && <h1 className="text-2xl text-blue-900 font-bold">{title}</h1>)}    
          {showButtons && isHeaderBtnVisible && (
          <div>
            <Button onClick={cancelAction ? cancelAction : () => {}} className="bg-white-500 ml-5">Cancel</Button>
          
            {buttons.map(({ text, onClick, className = '', hidden = false }, index) => (
              <Button
                key={index}
                onClick={onClick}
                className={`${className} ml-2`}
                hidden={hidden}
              >
                {text}
              </Button>
            ))}
          </div>
        )}
      </div>
      {renderTabContent}    
    </>
  );
};

export default HeaderTitle;
