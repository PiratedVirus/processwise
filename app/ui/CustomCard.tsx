import React from 'react';
import { MailOutlined, CheckCircleFilled } from '@ant-design/icons';

interface CustomCardProps {
  headerText: string;
  subText?: string;
  icon: React.ReactNode;
  selected: boolean;
  onSelect: () => void;
}

const CustomCard: React.FC<CustomCardProps> = ({
  headerText,
  subText,
  icon,
  selected,
  onSelect,
}) => {
  return (

    <div 
      onClick={onSelect}
      className={`flex items-center justify-center mx-3 bg-white cursor-pointer rounded-md ${selected ? 'border-blue-500 border-2 text-blue-500' : 'border-2 border-transparent'} w-96 relative`}>
       {selected && (
          <CheckCircleFilled style={{ color: 'blue', fontSize: '20px', position: 'absolute', top: -6, left: -6 }} />
      )}
      <div className="card-tick flex items-center justify-center text-center p-1">
        <MailOutlined className='p-2' style={{ color: '#027dfc', fontSize: '18px' }} />        
        <p className='text-base font-semibold ml-1 mr-3'>{headerText}</p>
      </div>
    </div>


  );
};

export default CustomCard;
