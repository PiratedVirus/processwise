'use client';
import React, { useState, useEffect } from 'react';
import { Collapse, Button } from 'antd';
import PdfHighlighterComponent from '@/app/ui/PdfViewer';

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
         <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div style={{ flex: 1 }}>
          <Collapse defaultActiveKey={['1']}>
            <Panel header="Top Half" key="1">
              Content of Top Half
            </Panel>
          </Collapse>
        </div>
        <div style={{ flex: 1 }}>
          <Collapse defaultActiveKey={['2']}>
            <Panel header="Bottom Half" key="2">
            {Object.keys(sampleCoordinatesObject).map(key => (
            <Button key={key} onClick={() => toggleHighlightVisibility(key)}>
            Highlight {key}
            </Button>
          ))}
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
