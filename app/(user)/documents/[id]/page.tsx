'use client';
import React, { useState, useEffect } from 'react';
import PdfViewer from '@/app/ui/PdfViewer';
import DocumentPanel from '@/app/components/Users/DocumentPanel'; 
import TablePanel from '@/app/components/Users/TablePanel';
import { sampleObject } from '@/app/lib/sampleCoordinateObject';
import {useSelector} from 'react-redux';
import useFetchApiV2 from '@/app/hooks/useFetchApiV2';
import { useSession } from 'next-auth/react';
import { Spin } from 'antd';


const { Items, ...sampleCoordinatesObject } = sampleObject;
interface VisibilityStates {
    [key: string]: boolean;
}

const pdfFile = 'https://gl7crk93wzx1epaw.public.blob.vercel-storage.com/PO_M1_2324_124042-rpBY7jXOA8w0AtfAMjNoKMAsVUDbQl.pdf';

console.log("TEST Items", sampleObject.Items);

function convertItems(items: any[]): any {
    const result: any = {};

    items.forEach((item, index) => {
        const newItem = { ...item.valueObject };

        Object.keys(newItem).forEach((key) => {
            const newKey = `row-${index + 1}-${key}`;
            result[newKey] = newItem[key];
        });
    });

    return result;
}

const convertedItems = convertItems(sampleObject.Items.valueArray);
const extendedObj = { ...convertedItems, ...sampleCoordinatesObject };
console.log("TEST extendedObj", extendedObj);




const CollapsibleLayoutComponent = () => {
    const [visibilityStates, setVisibilityStates] = useState<VisibilityStates>({});
    const { data: session } = useSession();

        // Extract currentMailId, selectedMailbox, and userCompany with appropriate fallbacks
        const currentMailId = typeof window !== 'undefined' ? window.location.pathname.split('/').pop() : '';
        const selectedMailbox = useSelector((state: any) => state.userDashboardStore.selectedUserMailboxInUserDashboard) || 'invoice@63qz7w.onmicrosoft.com';
        const userCompany = session?.user?.userCompany || 'YouTube';
    
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

    if (isLoading || isError || status === 'loading' || !data) {
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
