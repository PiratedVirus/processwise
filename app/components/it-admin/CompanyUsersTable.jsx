import React, { useMemo, useState, useEffect } from 'react';
import { Table, Input, Button, Badge, Space, Typography, Spin, Row, Col } from 'antd';
import { FiEdit2, FiTrash2 } from 'react-icons/fi';
import { SearchOutlined, FilterOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import useFetchApi from '@/app/hooks/useFetchApi'; // Make sure this path matches your project structure

const { Text } = Typography;

export const MemberTable = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const { fetchApi } = useFetchApi();

  useEffect(() => {
    setLoading(true);
    fetchApi('http://localhost:7071/api/fetchData', 'POST', { modelName: 'UserDetails' })
      .then(response => {
        setData(response);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error:', error);
        setLoading(false);
      });
  }, [fetchApi]);

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
      title: 'Name',
      dataIndex: 'userName',
      key: 'userName',
      ...getColumnSearchProps('userName'),
    },
    {
      title: 'Status',
      dataIndex: 'userStatus',
      key: 'userStatus',
      render: value => (
        <Badge status={value === 'active' ? 'success' : 'error'} text={value} />
      ),
      ...getColumnSearchProps('userStatus'),
    },
    {
      title: 'Email',
      dataIndex: 'userEmail',
      key: 'userEmail',
      ...getColumnSearchProps('userEmail'),
    },
    {
      title: 'Role',
      dataIndex: 'userRole',
      key: 'userRole',
      ...getColumnSearchProps('userRole'),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: () => (
        <Space size="middle">
          <Button icon={<EditOutlined />} />
          <Button icon={<DeleteOutlined />} />
        </Space>
      ),
    },
  ], []);

  const globalSearch = () => {
    const filteredData = data.filter(entry => 
      Object.values(entry).some(value => 
        value.toString().toLowerCase().includes(searchText.toLowerCase())
      )
    );
    return filteredData.length > 0 ? filteredData : data;
  };

  return (
    <Spin spinning={loading} size="large">
      <div className="space-y-5">
        <Row justify="space-between" align="middle" className="px-4 py-2">
          <Col>
            <Text strong className="text-lg">User Table</Text>
          </Col>
          <Col>
            <Input
              prefix={<SearchOutlined className="text-gray-400" />}
              placeholder="Global search..."
              onChange={e => setSearchText(e.target.value)}
              value={searchText}
            />
          </Col>
        </Row>
        <Table
          columns={columns}
          dataSource={searchText ? globalSearch() : data}
          rowKey="id"
        />
      </div>
    </Spin>
  );
};
