import React, { useMemo, useState, useEffect } from 'react';
import { Table, Input, Button, Badge, Space, Typography, Spin, Row, Col } from 'antd';
import { SearchOutlined, FilterOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import useFetchApi from '@/app/hooks/useFetchApi'; 
import { parseRoleToCheckedStates } from '@/app/lib/utils';
import CreateUserModal from '@/app/ui/CreateUsersModal';
const { Text } = Typography;

export const MemberTable = () => {
  const [data, setData] = useState([]);
  const [searchText, setSearchText] = useState('');
  const { fetchApi, isLoading, error } = useFetchApi();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const responseData = await fetchApi('http://localhost:7071/api/fetchData', 'POST', { modelName: 'UserDetails', columnName: 'userCompany', columnValue: 'OYO' });
        setData(responseData);
      } catch (fetchError) {
        console.error('Fetch error:', fetchError);
      }
    };

    fetchData();
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
  const roleColumns = ['Processing', 'Approving', 'Reporting', 'Admin'];
  const columns = useMemo(() => [
    {
      title: 'Name',
      dataIndex: 'userName',
      key: 'userName',
      ...getColumnSearchProps('userName'),
      render: (text, record) => (
        <div>
          <div>{record.userName}</div>
          <div className='text-gray-500'>{record.userEmail}</div> {/* Display email in a smaller or different style */}
        </div>
      ),
    },
    ...roleColumns.map((role, index) => ({
      title: role,
      dataIndex: 'userRole',
      key: role,
      render: (userRole) => {
        const checkedStates = parseRoleToCheckedStates(userRole);
        return (
          <input type="checkbox" checked={checkedStates[index]} disabled />
        );
      },
    })),

    {
      title: 'Position',
      dataIndex: 'userPosition',
      key: 'userPosition',
      ...getColumnSearchProps('userPosition'),
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
        value ? value.toString().toLowerCase().includes(searchText.toLowerCase()) : false
      )
    );
    return filteredData.length > 0 ? filteredData : data;
  };

  return (
    <Spin spinning={isLoading} size="large">
      <div className="space-y-5">
        <Row justify="space-between" align="middle" className="px-4 pt-5">
          <Col>
            <Text strong className="text-lg">User Table</Text>
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
          <CreateUserModal modalOpenText='Create New User ' modalOpenType='button' />

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
