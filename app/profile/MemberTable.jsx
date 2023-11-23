'use client'
import React, { useMemo, useState, useCallback } from 'react';
import {
  Avatar, Badge, Box, Stack, Checkbox, InputGroup, InputLeftElement, HStack, Icon, IconButton, Table, Tbody, Td, Text, Th, Thead, Tr, Input, ButtonGroup, Button, Grid, Select
} from '@chakra-ui/react';
import { FiEdit2, FiTrash2, FiSearch } from 'react-icons/fi';
import { IoArrowDown, IoArrowUp } from 'react-icons/io5';
import { useTable, useSortBy, useFilters, usePagination } from 'react-table';
import { Rating } from './Rating';
import { members as data } from './data';

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
// const RatingFilter = ({ column: { filterValue, setFilter } }) => {
//   // Define the options for rating filter (adjust as per your data)
//   const options = useMemo(() => [1, 2, 3, 4, 5], []);

//   return (
//     <select mt={2}
//     size={'sm'}
//       value={filterValue}
//       onChange={e => setFilter(e.target.value || undefined)}
//     >
//       <option mt={2} size={'sm'} value="">All</option>
//       {options.map(option => (
//         <option key={option} value={option}>
//           {option} Stars
//         </option>
//       ))}
//     </select>
//   );
// };
export const MemberTable = (props) => {
  // Define columns for React Table
  const [globalFilter, setGlobalFilter] = useState('');
  const columns = useMemo(
    () => [
      {
        Header: 'Name',
        accessor: 'name', // accessor is the "key" in the data
        Filter: DefaultColumnFilter
      },
      {
        Header: 'Status',
        accessor: 'status',
        Filter: DefaultColumnFilter,
        Cell: ({ value }) => (
          <Badge colorScheme={value === 'active' ? 'green' : 'red'}>
            {value.charAt(0).toUpperCase() + value.slice(1)}
          </Badge>
        ),
      },
      {
        Header: 'Email',
        accessor: 'email',
        Filter: DefaultColumnFilter
      },
      {
        Header: 'Role',
        accessor: 'role',
        Filter: DefaultColumnFilter
      },
      // {
      //   Header: 'Rating',
      //   accessor: 'rating',
      //   Filter: RatingFilter,
      //   Cell: ({ value }) => <Rating defaultValue={value} size="xl" />,
      // },
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
  console.log('Current Page Index:', pageIndex);
  console.log('Total Page Count:', pageOptions.length);
  console.log('Can go to Previous Page:', canPreviousPage);
  console.log('Can go to Next Page:', canNextPage);

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
        <Box mt={5} px={{ base: '4', md: '6' }} pb="5">
          <Grid
            templateColumns="repeat(3, 1fr)"
            gap={6}
            alignItems="center"
          >
            {/* Page Information */}
            <Box>
              <Text color="fg.muted" textStyle="sm">
                Showing Page <strong> {pageIndex + 1} of {pageOptions.length} </strong>
                | Go to page:
                <Input
                  size={'sm'}
                  type="number"
                  defaultValue={pageIndex + 1}
                  onChange={e => {
                    const page = e.target.value ? Number(e.target.value) - 1 : 0;
                    gotoPage(page);
                  }}
                  style={{ width: '40px', display: 'inline-block' }}
                />
              </Text>
            </Box>

            {/* Page Size Selector */}
            <Box justifySelf="center">
              <Select
                size={'sm'}
                value={pageSize}
                onChange={e => {
                  setPageSize(Number(e.target.value));
                }}
              >
                {[5, 10, 15, 20].map(pageSize => (
                  <option key={pageSize} value={pageSize}>
                    Show {pageSize} users
                  </option>
                ))}
              </Select>
            </Box>

            {/* Navigation Buttons */}
            <ButtonGroup
              spacing="3"
              justifySelf="end"
            >
              <Button colorScheme="messenger" size={'sm'} onClick={() => previousPage()} isDisabled={!canPreviousPage}>Previous</Button>
              <Button colorScheme="messenger" size={'sm'} onClick={() => nextPage()} isDisabled={!canNextPage}>Next</Button>
            </ButtonGroup>
          </Grid>
        </Box>

      </div>
    </Stack>



  );
};
