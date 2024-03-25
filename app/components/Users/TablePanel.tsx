import { Collapse, Table } from 'antd'; 
const { Panel } = Collapse;

type TablePanelProps = {
  data: any[]; 
};

const TablePanel: React.FC<TablePanelProps> = ({ data }) => {
  console.log("table data HIGH", data)
  const extractColumns = (data: any) => {
    const columnsSet = new Set<string>();
    data.forEach((item: any) => {
      Object.keys(item.valueObject).forEach((key) => {
        columnsSet.add(key);
      });
    });
    return Array.from(columnsSet).map((key) => ({
      title: key,
      dataIndex: key,
      key: key,
    }));
  };

  const prepareDataSource = (data: any) => {
    return data.map((item: any) => {
      const row: { [key: string]: any } = {};
      Object.entries(item.valueObject).forEach(([key, value]: [string, any]) => {
        // Assuming you want to display 'valueString' for each cell
        row[key] = value.valueString;
      });
      return row;
    });
  };

  const convertDataIntoTable = (data: any) => {
    const tableData = data.map((item: any) => ({
      type: item.type,
      valueObject: item.valueObject,
      confidence: item.confidence,
    }));
  
    return tableData;
  };

  const tableData = convertDataIntoTable(data);
  const columns = extractColumns(tableData);
  const dataSource = prepareDataSource(tableData);

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

export default TablePanel;