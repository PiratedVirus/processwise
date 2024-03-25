'use client';
import React, { useState, useEffect } from 'react';
import PdfViewer from '@/app/ui/PdfViewer';
import DocumentPanel from '@/app/components/Users/DocumentPanel'; 
import TablePanel from '@/app/components/Users/TablePanel';
import { sampleObject } from '@/app/lib/sampleCoordinateObject';
import { transformCoordinatesToHighlightAlt, transformCoordinatesToHighlight } from '@/app/lib/utils/utils';

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

    useEffect(() => {
        const initialStates: VisibilityStates = {};
        Object.keys(extendedObj).forEach(key => {
            initialStates[key] = false; // Initialize all as not visible
        });
        setVisibilityStates(initialStates);
    }, []);

    const toggleHighlightVisibility = (key: string) => {
        setVisibilityStates(prev => ({ ...prev, [key]: !prev[key] }));
    };

    console.log("HIGH sampleCoordinatesObject Returning ", sampleCoordinatesObject, visibilityStates);
    return (
        <div style={{ display: 'flex' }}>

            <div className='pr-5' style={{ flex: 1, display: 'flex', flexDirection: 'column', backgroundColor: '#f5f5f5' }}>
                <div >
                    <TablePanel data={sampleObject.Items.valueArray} />
                </div>

                <div className='mt-5' >
                    <DocumentPanel
                        sampleCoordinatesObject={extendedObj}
                        toggleHighlightVisibility={toggleHighlightVisibility}
                    />
                </div>
            </div>



            <div style={{ flex: 1 }}>

                <PdfViewer
                    url={pdfFile}
                    initialHighlights={extendedObj}
                    visibilityStates={visibilityStates}
                />
            </div>
        </div>
    );
};

export default CollapsibleLayoutComponent;
