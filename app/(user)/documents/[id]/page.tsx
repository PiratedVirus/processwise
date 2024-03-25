'use client';
import React from 'react';
import { Collapse } from 'antd';
import PdfHighlighterComponent from '@/app/ui/PdfViewer';

const { Panel } = Collapse;
const pdfFile = 'https://gl7crk93wzx1epaw.public.blob.vercel-storage.com/PO_M1_2324_124042-rpBY7jXOA8w0AtfAMjNoKMAsVUDbQl.pdf';




const CollapsibleLayoutComponent = () => {
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
              Content of Bottom Half
            </Panel>
          </Collapse>
        </div>
      </div>
      <div style={{ flex: 1 }}>
      <PdfHighlighterComponent url={pdfFile} initialHighlights={[]}/>

      </div>
    </div>
  );
};

export default CollapsibleLayoutComponent;
