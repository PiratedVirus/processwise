import React from 'react';
import { Skeleton } from 'antd';

const CustomCardSkeleton: React.FC = () => {
    return (
        <div className="flex justify-center">
            <div className="flex items-center justify-center mx-3 bg-white my-5 px-10 pt-3 cursor-pointer rounded-md border-2 border-transparent w-96 relative">
                <div className="card-tick flex items-center justify-center text-center p-1">
                    <Skeleton.Input active size="large" />
                </div>
            </div>

            <div className="flex items-center justify-center mx-3 bg-white my-5 px-10 pt-3 cursor-pointer rounded-md border-2 border-transparent w-96 relative">
                <div className="card-tick flex items-center justify-center text-center p-1">
                    <Skeleton.Input active size="large" />
                </div>
            </div>
            <div className="flex items-center justify-center mx-3 bg-white my-5 px-10 pt-3 cursor-pointer rounded-md border-2 border-transparent w-96 relative">
                <div className="card-tick flex items-center justify-center text-center p-1">
                    <Skeleton.Input active size="large" />
                </div>
            </div>

            <div className="flex items-center justify-center mx-3 bg-white my-5 px-10 pt-3 cursor-pointer rounded-md border-2 border-transparent w-96 relative">
                <div className="card-tick flex items-center justify-center text-center p-1">
                    <Skeleton.Input active size="large" />
                </div>
            </div>
        </div>
    );
};

export default CustomCardSkeleton;