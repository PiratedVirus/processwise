import React from 'react';
import { Spin } from 'antd';

const CenterSpin: React.FC = () => {
  return (
    <div className="flex justify-center items-center h-screen">
      <Spin />
    </div>
  );
}
export default CenterSpin;