import React, { useMemo, useState, useEffect } from 'react';
import { Table, Input, Button, Space, Typography, Spin, Row, Col, Tag } from 'antd';
import { SearchOutlined, FilterOutlined } from '@ant-design/icons';
import useFetchApi from '@/app/hooks/useFetchApi'; 
import useAzureApi from '@/app/hooks/useAzureApi';
import { parseRoleToCheckedStates } from '@/app/lib/utils';
import CreateUserModal from '@/app/ui/CreateUserModal';
import DeleteUserModal from '@/app/ui/DeleteUserModal';
import {createCompanyUser} from '@/app/lib/form-defination/createCompanyUser'
import { useSelector } from 'react-redux';
import useFetchApiV2 from '@/app/hooks/useFetchApiV2';
import usePostApi from '@/app/hooks/usePostApi';
const { Text } = Typography;

export const MailboxDocumentTable = () => {
  const [searchText, setSearchText] = useState('');
  const {  isLoading } = useFetchApi();

  const azureUserData = useSelector((state) => state.editFormData.azureUserData);
  const selectedMailboxInUserDashboard = useSelector((state) => state.userDashboardStore.selectedUserMailboxInUserDashboard);


  console.log('azureUserData', JSON.stringify(azureUserData));
  console.log('[email-fetching] selectedMailboxInUserDashboard', JSON.stringify(selectedMailboxInUserDashboard));


  
  
  const userMails = useSelector((state) => state.userDashboardStore.selectedUserMailboxContent);
  const isUserMailsLoading = useSelector((state) => state.userDashboardStore.isUserMailsLoading);
  if(!isUserMailsLoading){
    console.log('[email-fetching] Mail Feilds are ', userMails[2].extractedData.fields);
  }
  // console.log('[email-fetching] mailData from store var', JSON.stringify(userMails));
  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
  };

  const handleReset = (clearFilters, confirm) => {
    clearFilters();
    confirm();
  };

  const getColumnSearchProps = dataIndex => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
      <div style={{ padding: 8 }}>
        <Input
          autoFocus
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{ marginBottom: 8, display: 'block' }}
        />
        <Space>
          <Button
            className='bg-blue-600 text-white hover:text-white'
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<FilterOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Search
          </Button>
          <Button
            onClick={() => handleReset(clearFilters, confirm)}
            size="small"
            style={{ width: 90 }}
          >
            Reset
          </Button>
        </Space>
      </div>
    ),
    filterIcon: filtered => <FilterOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
    onFilter: (value, record) =>
      record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
    sorter: (a, b) => {
      if (typeof a[dataIndex] === 'number' && typeof b[dataIndex] === 'number') {
        return a[dataIndex] - b[dataIndex];
      }
      return a[dataIndex].localeCompare(b[dataIndex]);
    },
  });
  const columns = useMemo(() => [
    {
      title: 'Source',
      dataIndex: 'userName',
      key: 'userName',
      ...getColumnSearchProps('userName'),
      render: (text, record) => (
        <div>
          <div>{record.senderName}</div>
          <div className='text-gray-500'>{record.senderEmail}</div> {/* Display email in a smaller or different style */}
        </div>
      ),
    },
    {
      title: 'Date',
      dataIndex: 'dateTime',
      key: 'dateTime',
      ...getColumnSearchProps('dateTime'),
      render: (text, record) => (
        <div>
          <div>{record.dateTime}</div>
        </div>
      ),
    },
    {
      title: 'Entity name',
      dataIndex: 'entity',
      key: 'entity',
      ...getColumnSearchProps('entity'),
      render: (text, record) => (
        <div>
          <div>{record.extractedData.fields.CustomerName.content ? record.extractedData.fields.CustomerName.content : "Not found" }</div>
        </div>
      ),
    },
    {
      title: 'Doc Name',
      dataIndex: 'docName',
      key: 'docName',
      ...getColumnSearchProps('docName'),
      render: (text, record) => (
        <div>
          <div>{record.attachmentNames ? record.attachmentNames : "Not found" }</div>
          <a href={record.downloadURLs[0]} target="_blank" rel="noreferrer"> Open </a>
        </div>
      ),
    },

    {
      title: 'Doc number',
      dataIndex: 'docNumber',
      key: 'docNumber',
      ...getColumnSearchProps('docNumber'),
      render: (text, record) => (
        <div>
          <div>{record.extractedData.fields.PurchaseOrder.content ? record.extractedData.fields.PurchaseOrder.content : "Not found" }</div>
        </div>
      ),
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      ...getColumnSearchProps('amount'),
      render: (text, record) => (
        <div>
          <div>{record.extractedData.fields.POTotal.content ? record.extractedData.fields.POTotal.content : "Not found" }</div>
        </div>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      ...getColumnSearchProps('status'),
      render: (text, record) => (
        <div>
          <Tag color="geekblue">Unprocessed</Tag>
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

  return (
    (userMails) ? (
    <Spin spinning={isUserMailsLoading} size="large">
      <div className="space-y-5">
        <Row justify="space-between" align="middle" className="px-4 pt-5">
          <Col>
            <Text strong className="text-lg">Documents Overview</Text>
          </Col>
          </Row>
          <Row justify="space-between" align="middle" className="px-4 py-2">
          <Col>
            <Input
              className='w-96'
              prefix={<SearchOutlined className="text-gray-400" />}
              placeholder="Global search..."
              onChange={e => setSearchText(e.target.value)}
              value={searchText}
            />
          </Col>

        </Row>
        <Table
          columns={columns}
          dataSource={searchText ? globalSearch() : userMails}
          rowKey={record => record.userId}
        />
      </div>
    </Spin> ) : null
  );
};
