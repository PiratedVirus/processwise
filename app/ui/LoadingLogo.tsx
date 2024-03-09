import React from 'react';
import Image from 'next/image';

export default function LoadingLogo() {
    return (
        <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
                <Image className='animate-pulse' src="/logo_large.png" width={150} height={30} alt="Logo" />
        </div>
    );
}