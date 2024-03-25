'use client';
import React, { useState, useEffect } from 'react';
import { Collapse, Button, Input } from 'antd';
import PdfHighlighterComponent from '@/app/ui/PdfViewer';
import { camelToTitleCase } from '@/app/lib/utils/utils';

const { Panel } = Collapse;
const pdfFile = 'https://gl7crk93wzx1epaw.public.blob.vercel-storage.com/PO_M1_2324_124042-rpBY7jXOA8w0AtfAMjNoKMAsVUDbQl.pdf';
interface HighlightObject {
    [key: string]: any;
}

interface VisibilityStates {
    [key: string]: boolean;
}

const sampleCoordinatesObject = {
    "BillingAddress": {
        "type": "string",
        "valueString": "Plot No. 5 & 32, Sector-6, IMT Manesar, Gurugram Gurugram-Haryana 122052 India",
        "content": "Plot No. 5 & 32, Sector-6, IMT Manesar,\nGurugram\nGurugram-Haryana 122052\nIndia",
        "boundingRegions": [
            {
                "pageNumber": 1,
                "polygon": [
                    2.5638,
                    1.9483,
                    4.5547,
                    1.9483,
                    4.5547,
                    2.5357,
                    2.5638,
                    2.5357
                ]
            }
        ],
        "confidence": 0.489,
        "spans": [
            {
                "offset": 372,
                "length": 78
            }
        ]
    },
    "BillingAddressRecipient": {
        "type": "string",
        "valueString": "Tricolite Electrical Industries Limited",
        "content": "Tricolite Electrical Industries Limited",
        "boundingRegions": [
            {
                "pageNumber": 1,
                "polygon": [
                    2.5878,
                    1.7433,
                    4.7845,
                    1.7525,
                    4.7838,
                    1.91,
                    2.5871,
                    1.9008
                ]
            }
        ],
        "confidence": 0.864,
        "spans": [
            {
                "offset": 332,
                "length": 39
            }
        ]
    },
    "InvoiceTotal": {
        "type": "string",
        "valueString": "236904.00",
        "content": "236904.00",
        "boundingRegions": [
            {
                "pageNumber": 2,
                "polygon": [
                    10.26,
                    3.2854,
                    10.7815,
                    3.2902,
                    10.7804,
                    3.4048,
                    10.2589,
                    3.4
                ]
            }
        ],
        "confidence": 0.973,
        "spans": [
            {
                "offset": 4978,
                "length": 9
            }
        ]
    },
    "PaymentTerm": {
        "type": "string",
        "valueString": "Net-100",
        "content": "Net-100",
        "boundingRegions": [
            {
                "pageNumber": 2,
                "polygon": [
                    1.3741,
                    3.6077,
                    1.8095,
                    3.6053,
                    1.8104,
                    3.7725,
                    1.375,
                    3.7749
                ]
            }
        ],
        "confidence": 0.976,
        "spans": [
            {
                "offset": 4522,
                "length": 7
            }
        ]
    },
    "PurchaseOrder": {
        "type": "string",
        "valueString": "PO/1240422",
        "content": "PO/1240422",
        "boundingRegions": [
            {
                "pageNumber": 1,
                "polygon": [
                    7.954,
                    1.5472,
                    8.6797,
                    1.5473,
                    8.6797,
                    1.6905,
                    7.954,
                    1.6904
                ]
            }
        ],
        "confidence": 0.978,
        "spans": [
            {
                "offset": 689,
                "length": 10
            }
        ]
    },
    "ShippingAddress": {
        "type": "string",
        "valueString": "Plot No. 5 & 32, Sector-6, IMT Manesar, Gurugram Gurugram-Haryana 122052 India",
        "content": "Plot No. 5 & 32, Sector-6, IMT Manesar,\nGurugram\nGurugram-Haryana 122052\nIndia",
        "boundingRegions": [
            {
                "pageNumber": 1,
                "polygon": [
                    4.8937,
                    1.9483,
                    6.8798,
                    1.9483,
                    6.8798,
                    2.507,
                    4.8937,
                    2.507
                ]
            }
        ],
        "confidence": 0.723,
        "spans": [
            {
                "offset": 557,
                "length": 78
            }
        ]
    },
    "ShippingAddressRecipient": {
        "type": "string",
        "valueString": "Tricolite Electrical Industries Limited",
        "content": "Tricolite Electrical Industries Limited",
        "boundingRegions": [
            {
                "pageNumber": 1,
                "polygon": [
                    4.8602,
                    1.7573,
                    7.0421,
                    1.7573,
                    7.0421,
                    1.9006,
                    4.8602,
                    1.9006
                ]
            }
        ],
        "confidence": 0.766,
        "spans": [
            {
                "offset": 517,
                "length": 39
            }
        ]
    },
    "Date": {
        "type": "string",
        "valueString": "15-06-2023",
        "content": "15-06-2023",
        "boundingRegions": [
            {
                "pageNumber": 1,
                "polygon": [
                    10.0001,
                    1.5424,
                    10.6446,
                    1.5328,
                    10.6468,
                    1.6761,
                    10.0022,
                    1.6857
                ]
            }
        ],
        "confidence": 0.973,
        "spans": [
            {
                "offset": 892,
                "length": 10
            }
        ]
    },
    "Subtotal": {
        "type": "string",
        "valueString": "200766.10",
        "content": "200766.10",
        "boundingRegions": [
            {
                "pageNumber": 1,
                "polygon": [
                    10.3316,
                    7.2011,
                    10.7863,
                    7.2059,
                    10.7852,
                    7.3062,
                    10.3305,
                    7.3014
                ]
            }
        ],
        "confidence": 0.878,
        "spans": [
            {
                "offset": 3178,
                "length": 9
            }
        ]
    },
};

const CollapsibleLayoutComponent = () => {
    const [visibilityStates, setVisibilityStates] = useState<VisibilityStates>({});
    function darkenColor(color: string, amount: number): string {
        let [r, g, b] = color.match(/\w\w/g)!.map((c) => parseInt(c, 16));
        return (
            "#" +
            [r, g, b]
                .map((c) => Math.max(0, Math.min(255, c - amount)).toString(16).padStart(2, "0"))
                .join("")
        );
    }

    type ColorPair = {
        backgroundColor: string;
        borderColor: string;
    };

    const getConfidenceColor = (confidence: number): ColorPair => {
        const colors = {
            red: '#FF8A65',
            green: '#C8E6C9',
            yellow: '#FFECB3',
            orange: '#FFE0B2',
        };

        let color;
        if (confidence >= 0.7) {
            color = colors.green;
        } else if (confidence >= 0.4) {
            color = colors.yellow;
        } else {
            color = colors.orange;
        }

        const borderColor = darkenColor(color, 30); // Adjust the amount to get the desired darkness

        return {
            backgroundColor: color,
            borderColor: borderColor,
        };
    };

    useEffect(() => {
        const initialStates: VisibilityStates = {};
        Object.keys(sampleCoordinatesObject).forEach(key => {
            initialStates[key] = false; // Initialize all as not visible
        });
        setVisibilityStates(initialStates);
    }, []);

    const toggleHighlightVisibility = (key: string) => {
        setVisibilityStates(prev => ({ ...prev, [key]: !prev[key] }));
    };


    return (
        <div style={{ display: 'flex' }}>

            <div className='pr-5' style={{ flex: 1, display: 'flex', flexDirection: 'column', backgroundColor: '#f5f5f5' }}>
                <div style={{ flex: 1 }}>
                    <Collapse defaultActiveKey={['1']}>
                        <Panel header="Top Half" key="1">
                            Content of Top Half
                        </Panel>
                    </Collapse>
                </div>


                <div className='mt-5' >
                    <Collapse bordered={false} defaultActiveKey={['1']} style={{ marginBottom: '20px', background: 'white' }}>
                        <Panel header={<span className="font-bold">Document Data Fields</span>} key="1">
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
                                {Object.entries(sampleCoordinatesObject).map(([key, { valueString, confidence }]) => (
                                    <div key={key}>
                                        <label style={{ display: 'block', marginBottom: '5px' }}>{camelToTitleCase(key)}</label>
                                        <Input.TextArea
                                            onClick={() => toggleHighlightVisibility(key)}
                                            defaultValue={valueString}
                                            autoSize={{ minRows: 1, maxRows: 6 }}
                                            style={{
                                                backgroundColor: getConfidenceColor(confidence).backgroundColor,
                                                borderColor: getConfidenceColor(confidence).borderColor,
                                            }}
                                        />
                                    </div>
                                ))}
                                <div style={{ gridColumn: '1 / -1' }}>
                                    <label style={{ display: 'block', marginBottom: '5px' }}> Notes</label>
                                    <Input.TextArea placeholder="Notes..." />
                                </div>
                            </div>

                        </Panel>
                    </Collapse>
                </div>


            </div>



            <div style={{ flex: 1 }}>

                <PdfHighlighterComponent
                    url={pdfFile}
                    initialHighlights={sampleCoordinatesObject}
                    visibilityStates={visibilityStates}
                />
            </div>
        </div>
    );
};

export default CollapsibleLayoutComponent;
