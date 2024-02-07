// HeaderTitle.tsx
import React from 'react';
import { Button } from 'antd';

interface ButtonConfig {
  text: string;
  onClick: () => void;
  className?: string;
  hidden?: boolean;
}

interface HeaderTitleProps {
  title: string;
  showButtons?: boolean;
  buttons?: ButtonConfig[];
  cancelAction?: () => void; // Add cancelAction prop
}

const HeaderTitle: React.FC<HeaderTitleProps> = ({ title, showButtons = false, buttons = [], cancelAction }) => {
  // Constant "Cancel" button configuration
  const cancelButtonConfig: ButtonConfig = {
    text: 'Cancel',
    onClick: cancelAction ? cancelAction : () => {}, // Use cancelAction if provided, otherwise empty function
    className: 'bg-white-500 text-white',
  };

  return (
    <div className="w-full bg-slate-100 mb-2 py-5 flex justify-between items-center">
      <h1 className="text-2xl text-blue-900 font-bold">{title}</h1>
      {showButtons && (
        <div>
          <Button {...cancelButtonConfig} className="ml-5"> {cancelButtonConfig.text}</Button>  {/* Render the Cancel button */}
         
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
  );
};

export default HeaderTitle;
