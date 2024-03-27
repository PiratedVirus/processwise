import React, { useMemo, useState, useEffect } from 'react';
import { Table, Input, Button, Space, Spin, Row, Col, Tag } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import useFetchApi from '@/app/hooks/useFetchApi'; 
import { useSelector, useDispatch } from 'react-redux';
import {updateSelectedUserMailboxContent} from '@/redux/reducers/userReducer';
import  MailboxTabs  from '@/app/ui/MailboxTabs';
import FileUpload from '@/app/ui/Upload';
import { useRouter } from 'next/navigation';

export const MailboxDocumentTable = () => {
  const tagColorMap = {
    'Unprocessed': 'blue',
    'Validated': 'geekblue',
    'Approved': 'green',
    'Pending approval': 'gold',
    'Rejected': 'volcano',
  };
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const documentStatus = useSelector((state) => state.userDashboardStore.selectedDocuementTab) || "All docs";
  const userMailsUnfiltered = useSelector((state) => state.userDashboardStore.selectedUserMailboxContent);
  const userMails = (documentStatus === "All docs" ) ? userMailsUnfiltered : userMailsUnfiltered?.filter((mail) => mail.mailStatus === documentStatus) || [];
  const isUserMailsLoading = useSelector((state) => state.userDashboardStore.isUserMailsLoading);

 
  
  
  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
  };

  const handleReset = (clearFilters, confirm) => {
    clearFilters();
    confirm();
  };

  const getColumnSearchProps = (getValueFromRecord) => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
      <div style={{ padding: 8 }}>
        <Input
          autoFocus
          placeholder={`Search `} // Updated to use the new placeholder parameter
          value={selectedKeys[0]}
          onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => handleSearch(selectedKeys, confirm)}
          style={{ marginBottom: 8, display: 'block' }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm)}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Search
          </Button>
          <Button onClick={() => handleReset(clearFilters, confirm)} size="small" style={{ width: 90 }}>
            Reset
          </Button>
        </Space>
      </div>
    ),
    filterIcon: filtered => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
    onFilter: (value, record) => {
      const recordValue = getValueFromRecord(record);
      return recordValue ? recordValue.toString().toLowerCase().includes(value.toLowerCase()) : false;
    },
    sorter: (a, b) => {
      const valueA = getValueFromRecord(a) || ''; // Ensure we have a fallback value for comparison
      const valueB = getValueFromRecord(b) || ''; // Ensure we have a fallback value for comparison
      return valueA.localeCompare(valueB);
    },
  });
  const columns = useMemo(() => [
    {
      title: 'Source',
      dataIndex: 'userName',
      key: 'userName',
      ...getColumnSearchProps(record => record.senderName),
      render: (text, record) => (
        <div>
          <div>{record.senderName || record.uploaderName}</div>
          <div className='text-gray-500'>{record.senderEmail || "Manual Upload"}</div> {/* Display email in a smaller or different style */}
        </div>
      ),
    },
    {
      title: 'Date',
      dataIndex: 'dateTime',
      key: 'dateTime',
      ...getColumnSearchProps(record => record.dateTime),
      render: (text, record) => (
        <div>
          <div>{new Date(record.dateTime).toLocaleString() || ''}</div>
        </div>
      ),
    },
    {
      title: 'Entity name',
      dataIndex: 'entity',
      key: 'entity',
      ...getColumnSearchProps(record => record.extractedData.fields.BillingAddressRecipient?.content || ''),
      render: (text, record) => (
        <div>
          <div>{record.extractedData.fields.BillingAddressRecipient?.content ? record.extractedData.fields.BillingAddressRecipient.content : "Not found" }</div>
        </div>
      ),
    },
    
    {
      title: 'Doc Name',
      dataIndex: 'docName',
      key: 'docName',
      ...getColumnSearchProps(record => record.attachmentNames || ''),
      render: (text, record) => (
        <div>
          <div>{record?.attachmentNames ? record.attachmentNames : "Not found" }</div>
          <a href={record?.downloadURL} target="_blank" rel="noreferrer"> Open </a>
        </div>
      ),
    },

    {
      title: 'Doc number',
      dataIndex: 'docNumber',
      key: 'docNumber',
      ...getColumnSearchProps(record => record.extractedData.fields.PurchaseOrder?.content || ''),
      render: (text, record) => (
        <div>
          <div>{record.extractedData.fields.PurchaseOrder?.content ? record.extractedData.fields.PurchaseOrder.content : "Not found" }</div>
        </div>
      ),
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      ...getColumnSearchProps(record => record.extractedData.fields.InvoiceTotal?.content || ''),
      render: (text, record) => (
        <div>
          <div>{record.extractedData.fields.InvoiceTotal?.content ? record.extractedData.fields.InvoiceTotal.content : "Not found" }</div>
        </div>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      ...getColumnSearchProps(record => record.mailStatus),
      render: (text, record) => (
        <div>
          <Tag style={{ borderRadius: '12px' }} color={tagColorMap[record.mailStatus]}>{record.mailStatus}</Tag>
        </div>
      ),
    },
 

  ], []);

  const globalSearch = () => {
    const filteredData = userMails.filter(entry => 
      Object.values(entry).some(value => 
        value ? value.toString().toLowerCase().includes(searchText.toLowerCase()) : false
      )
    );
    return filteredData.length > 0 ? filteredData : userMails;
  };
  console.log("userMails" ,userMails?.error)
 
  return (
    
    (userMails) ? (
    
    <Spin spinning={isUserMailsLoading} size="large">
      <div className="space-y-5">
        <Row justify="space-between" align="middle" className="px-4 pt-5">
          <Col>
            <p className="text-2xl font-medium">Documents Overview</p>
          </Col>
         
          <div className="flex justify-between items-center px-4 py-2">
            <FileUpload />

            <Input
              style={{ width: '320px' }}
              className=' ml-6'
              prefix={<SearchOutlined className="text-gray-400" />}
              placeholder="Global search..."
              onChange={e => setSearchText(e.target.value)}
              value={searchText}
            />
          </div>

        </Row>

        <MailboxTabs />

        <Table
          columns={columns}
          dataSource={searchText ? globalSearch() : userMails}
          rowKey={record => record}
          onRow={(record) => ({
            onClick: () => {
                router.push(`/documents/${record.rowId}`);
            },
            style: {
              cursor: 'pointer',
          },
        })}
          
        />
      </div>
    </Spin> ) : null
  );
};
