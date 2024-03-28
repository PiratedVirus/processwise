'use client';
import React, { useState, useEffect } from 'react';
import PdfViewer from '@/app/ui/PdfViewer';
import DocumentPanel from '@/app/components/Users/DocumentPanel';
import TablePanel from '@/app/components/Users/TablePanel';
import { useSelector } from 'react-redux';
import useFetchApiV2 from '@/app/hooks/useFetchApiV2';
import { useSession } from 'next-auth/react';
import { Spin } from 'antd';
import axios from 'axios';


interface VisibilityStates {
    [key: string]: boolean;
}
interface MailData {
    mailDataWithConvertedItems: Record<string, any>;
    convertedItemsFromMail: any; // Adjust the type according to the actual data structure
    documentUrl: string;
    mailDataWithoutItems: any;
    // Define other properties returned by your API if needed
}

const CollapsibleLayoutComponent = () => {
    const { data: session } = useSession();
    const [visibilityStates, setVisibilityStates] = useState<VisibilityStates>({});
    const [userCompany, setUserCompany] = useState<string | null>(null);
    const [data, setData] = useState<MailData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isError, setIsError] = useState(false);

    useEffect(() => {
        if (session?.user?.userCompany) {
            setUserCompany(session.user.userCompany);
        }
    }, [session]);


    const currentMailId = typeof window !== 'undefined' ? window.location.pathname.split('/').pop() : '';
    const selectedMailbox = useSelector((state: any) => state.userDashboardStore.selectedUserMailboxInUserDashboard) || 'invoice@63qz7w.onmicrosoft.com';

    useEffect(() => {
        const fetchData = async () => {
          try {
            const result = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/preview-data?id=${currentMailId}&customer=${userCompany}&mailbox=${selectedMailbox}`);
            setData(result.data);
            setIsLoading(false);
          } catch (error) {
            setIsError(true);
            setIsLoading(false);
          }
        };
      
        if (currentMailId && userCompany) {
          fetchData();
        }
      }, [currentMailId, userCompany]);

    useEffect(() => {
        if (data && !isLoading && !isError) {
            const initialStates: VisibilityStates = {};
            Object.keys(data?.mailDataWithConvertedItems).forEach(key => {
                initialStates[key] = false;
            });
            setVisibilityStates(initialStates);
        }
        console.log("data is updating", data)

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
                        csvData = {data}
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
