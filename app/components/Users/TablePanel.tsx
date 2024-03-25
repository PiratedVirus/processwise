import React from 'react';
import { Table, Collapse } from 'antd';
 const { Panel } = Collapse;

interface DocumentTableProps {
  data: { [key: string]: any };
  toggleHighlightVisibility: (key: string) => void;
}

const DocumentTable: React.FC<DocumentTableProps> = ({ data, toggleHighlightVisibility }) => {
  const columns: any[] = [];
  const dataSource: any[] = [];

  // Deduce columns
  Object.keys(data).forEach((key) => {
    const header = key.split('-').slice(2).join('-'); // Get header from key
    if (!columns.find((col) => col.dataIndex === header)) {
      columns.push({
        title: header,
        dataIndex: header,
        key: header,
        render: (text: any, record: any, index: number) => (
          <div onClick={() => toggleHighlightVisibility(`row-${record.key}-${header}`)}>
            {text}
          </div>
        ),
      });
    }
  });

  // Prepare dataSource
  Object.entries(data).forEach(([key, value]) => {
    const rowNumber = parseInt(key.split('-')[1], 10);
    const header = key.split('-').slice(2).join('-');
    const rowIndex = dataSource.findIndex((item) => item.key === rowNumber);
    
    if (rowIndex === -1) {
      dataSource.push({ key: rowNumber, [header]: value.valueString ?? value.valueNumber });
    } else {
      dataSource[rowIndex][header] = value.valueString ?? value.valueNumber;
    }
  });


  return (
    <Collapse bordered={false} defaultActiveKey={['1']} style={{ marginBottom: '20px', background: 'white' }}>
        <Panel header={<span className="font-bold">Document Table Fields</span>}  key="1">
            <div style={{ maxWidth: '100%', overflowX: 'auto' }}>
                <Table dataSource={dataSource} columns={columns} pagination={{ pageSize: 2 }} />
            </div>
        </Panel>
    </Collapse>
  );
};

export default DocumentTable;
