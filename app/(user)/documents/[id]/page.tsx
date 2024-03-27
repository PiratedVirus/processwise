'use client';
import React, { useState, useEffect } from 'react';
import PdfViewer from '@/app/ui/PdfViewer';
import DocumentPanel from '@/app/components/Users/DocumentPanel';
import TablePanel from '@/app/components/Users/TablePanel';
import { useSelector } from 'react-redux';
import useFetchApiV2 from '@/app/hooks/useFetchApiV2';
import { useSession } from 'next-auth/react';
import { Spin } from 'antd';


interface VisibilityStates {
    [key: string]: boolean;
}

const CollapsibleLayoutComponent = () => {
    const { data: session } = useSession();
    const [visibilityStates, setVisibilityStates] = useState<VisibilityStates>({});
    const [userCompany, setUserCompany] = useState<string | null>(null);

    useEffect(() => {
        if (session?.user?.userCompany) {
            setUserCompany(session.user.userCompany);
        }
    }, [session]);


    const currentMailId = typeof window !== 'undefined' ? window.location.pathname.split('/').pop() : '';
    const selectedMailbox = useSelector((state: any) => state.userDashboardStore.selectedUserMailboxInUserDashboard) || 'invoice@63qz7w.onmicrosoft.com';

    const { data, isLoading, isError } = useFetchApiV2(`${process.env.NEXT_PUBLIC_API_URL}/preview-data?id=${currentMailId}&customer=${userCompany}&mailbox=${selectedMailbox}`);


    useEffect(() => {
        if (data && !isLoading && !isError) {
            const initialStates: VisibilityStates = {};
            Object.keys(data.mailDataWithConvertedItems).forEach(key => {
                initialStates[key] = false;
            });
            setVisibilityStates(initialStates);
        }

    }, [data, isLoading, isError]);

    const toggleHighlightVisibility = (key: string) => {
        setVisibilityStates(prev => ({ ...prev, [key]: !prev[key] }));
    };

    if (isLoading || isError || !data) {
        return <Spin size="large" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }} />;
    }
    return (
        <div style={{ display: 'flex' }}>

            <div className='pr-5' style={{ flex: 1, display: 'flex', flexDirection: 'column', backgroundColor: '#f5f5f5' }}>
                <div >
                    <TablePanel data={data.convertedItemsFromMail} toggleHighlightVisibility={toggleHighlightVisibility} />
                </div>

                <div className='mt-5' >
                    <DocumentPanel
                        sampleCoordinatesObject={data.mailDataWithoutItems}
                        toggleHighlightVisibility={toggleHighlightVisibility}
                    />
                </div>
            </div>



            <div style={{ flex: 1 }}>

                <PdfViewer
                    url={data.documentUrl}
                    initialHighlights={data.mailDataWithConvertedItems}
                    visibilityStates={visibilityStates}
                />
            </div>
        </div>
    );
};

export default CollapsibleLayoutComponent;
