import React from 'react';
import Link  from 'next/link';
import { PlusCircleOutlined } from '@ant-design/icons';

const CreateClientCard: React.FC = () => (
  <Link href="/moderator/register" legacyBehavior>
    
    <div className="flex justify-center items-center bg-blue-500 text-white rounded-md cursor-pointer h-48 max-w-64">
      <div className="text-center">
        <PlusCircleOutlined className="text-xl" />
        <span className="mt-2 mx-3 text-xl font-large">Create new</span>
      </div>
    </div>
  </Link>

);
export default CreateClientCard;

