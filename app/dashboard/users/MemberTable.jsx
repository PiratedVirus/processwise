'use client'
import React, { useMemo, useState, useEffect } from 'react';
import { useTable, useSortBy, useFilters, usePagination } from 'react-table';
import { 
  Badge, Box, Stack, InputGroup, InputLeftElement, HStack, Icon, IconButton, Table, Tbody, Td, Text, Th, Thead, Tr, Input, ButtonGroup, Button, Grid, Select
} from '@chakra-ui/react';
import { FiEdit2, FiTrash2, FiSearch } from 'react-icons/fi';
import { IoArrowDown, IoArrowUp } from 'react-icons/io5';
import { Spinner } from '@chakra-ui/react';
import useFetchApi from '@/app/hooks/useFetchApi';
import PaginationComponent from '@/app/components/Table/PaginationComponent';


const DefaultColumnFilter = ({
  column: { filterValue, setFilter },
}) => {
  return (
    <Input mt={2}
      size={'sm'}
      value={filterValue || ''}
      onChange={e => setFilter(e.target.value)}
    />
  );
};

export const MemberTable = (props) => {
  const [data, setData] = useState([]);
  const { fetchApi, isLoading } = useFetchApi();
  const [globalFilter, setGlobalFilter] = useState('');
  
  useEffect(() => {
    fetchApi('http://localhost:7071/api/fetchData', 'POST', { modelName: 'UserDetails' })
      .then(setData)
      .catch(error => console.error('Error:', error));
  }, [fetchApi]);


  const columns = useMemo(
    () => [
      {
        Header: 'Name',
        accessor: 'userName', 
        Filter: DefaultColumnFilter
      },
      {
        Header: 'Status',
        accessor: 'userStatus',
        Filter: DefaultColumnFilter,
        Cell: ({ value }) => (
          <Badge colorScheme={value === 'active' ? 'green' : 'red'}>
            {value.charAt(0).toUpperCase() + value.slice(1)}
          </Badge>
        ),
      },
      {
        Header: 'Email',
        accessor: 'userEmail',
        Filter: DefaultColumnFilter
      },
      {
        Header: 'Role',
        accessor: 'userRole',
        Filter: DefaultColumnFilter
      },
      {
        Header: 'Actions',
        id: 'actions',
        Cell: () => (
          <HStack spacing="1">
            <IconButton icon={<FiTrash2 />} variant="outline" aria-label="Delete member" />
            <IconButton icon={<FiEdit2 />} variant="outline" aria-label="Edit member" />
          </HStack>
        ),
      },
    ],
    []
  );

  const dataFiltered = useMemo(() => {
    if (!globalFilter) return data;
    return data.filter(row => {
      // Assuming row object has properties corresponding to columns
      return Object.keys(row).some(key => {
        if (row[key]) {
          return row[key].toString().toLowerCase().includes(globalFilter.toLowerCase());
        }
        return false;
      });
    });
  }, [data, globalFilter]);
  // Use the state and functions returned from useTable to build your UI
  const {
    rows,
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page, // Use 'page' instead of 'rows'
    prepareRow,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    state: { pageIndex, pageSize },
  } = useTable(
    {
      columns,
      data: dataFiltered,
      defaultColumn: { Filter: DefaultColumnFilter }
    },
    useFilters,
    useSortBy,
    usePagination
  );
  if (isLoading) {
    return <Spinner size="xl" />;
  }

  if (!data) {
    return <Text>No data available.</Text>;
  }

  return (
    <Stack spacing="5">

      <Box px={{ base: '4', md: '6' }} pt="5">
        <Stack direction={{ base: 'column', md: 'row' }} justify="space-between">
          <Text textStyle="lg" fontWeight="medium">
            Users
          </Text>
          <InputGroup maxW="xs">
            <InputLeftElement pointerEvents="none">
              <Icon as={FiSearch} color="fg.muted" boxSize="5" />
            </InputLeftElement>
            <Input placeholder="Global search..."
              value={globalFilter}
              onChange={e => setGlobalFilter(e.target.value)} />
          </InputGroup>
        </Stack>
      </Box>

      <Table {...props} {...getTableProps()}>
        <Thead>
          {headerGroups.map(headerGroup => (
            <Tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map(column => (
                <Th {...column.getHeaderProps(column.getSortByToggleProps())}>
                  <HStack spacing="3">
                    <Text>{column.render('Header')}</Text>
                    {/* Ensure the sort icons are within the element that has the sorting props */}
                    {column.canSort ? (
                      column.isSorted ? (
                        column.isSortedDesc ? (
                          <Icon as={IoArrowDown} boxSize="4" />
                        ) : (
                          <Icon as={IoArrowUp} boxSize="4" />
                        )
                      ) : <Icon as={IoArrowDown} boxSize="4" color="transparent" /> // Transparent icon for unsorted
                    ) : null}
                  </HStack>
                  {/* Render column filter UI */}
                  <Box>{column.canFilter ? column.render('Filter') : null}</Box>
                </Th>
              ))}
            </Tr>
          ))}
        </Thead>
        <Tbody {...getTableBodyProps()}>
          {page.map(row => {
            prepareRow(row);
            return (
              <Tr {...row.getRowProps()}>
                {row.cells.map(cell => (
                  <Td {...cell.getCellProps()}>{cell.render('Cell')}</Td>
                ))}
              </Tr>
            );
          })}
        </Tbody>
      </Table>
      <div>
      <PaginationComponent
        tableType="users"
        pageIndex={pageIndex}
        pageOptions={pageOptions}
        pageSize={pageSize}
        canPreviousPage={canPreviousPage}
        canNextPage={canNextPage}
        gotoPage={gotoPage}
        setPageSize={setPageSize}
      />

      </div>
    </Stack>



  );
};
