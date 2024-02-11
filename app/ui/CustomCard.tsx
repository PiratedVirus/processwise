import React from 'react';
import Link from 'next/link';
import { RightOutlined, CheckCircleFilled } from '@ant-design/icons';

interface CustomCardProps {
  headerText: string;
  subText: string;
  link: string;
  icon: React.ReactNode;
  selected: boolean;
  onSelect: () => void;
  customHeight: string;
  customWidth: string;
}

const CustomCard: React.FC<CustomCardProps> = ({
  headerText,
  subText,
  link,
  icon,
  selected,
  onSelect,
  customHeight,
  customWidth,
}) => {
  // Generate the complete class names including the custom height and width.
  const cardHeightClass = customHeight ? `h-${customHeight}` : 'h-auto';
  const cardWidthClass = customWidth ? `max-w-${customWidth}` : 'w-full';

  return (
    <div onClick={onSelect} className={`relative mx-2 ${cardWidthClass} ${cardHeightClass}`}>
      <Link href={link}>
        <div
          className={`flex items-center bg-white py-4 pl-4 mb-5 cursor-pointer rounded-md transition-shadow duration-200 ease-in ${selected ? 'border-blue-500 border-2 text-blue-500' : 'border-gray-300'}`}
        >
          {selected && (
            <div className="absolute -top-3 -left-2 z-10">
              <CheckCircleFilled style={{ color: 'blue', fontSize: '20px' }} />
            </div>
          )}
          <div className="flex-grow">
            <p className={`font-bold ${selected ? 'text-blue-500' : 'text-gray-800'}`}>{headerText}</p>
            <p className={`${selected ? 'text-blue-500' : 'text-gray-600'}`}>{subText}</p>
          </div>
          <div className="ml-3">
            {icon}
          </div>
        </div>
      </Link>
    
    </div>
  );
};

export default CustomCard;
