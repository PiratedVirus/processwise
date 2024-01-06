import React from 'react';
import { Box, Button, ButtonGroup, Grid, Input, Select, Text } from '@chakra-ui/react';

interface PaginationProps {
  tableType?: string;
  pageIndex: number;
  pageOptions: number[];
  pageSize: number;
  canPreviousPage: boolean;
  canNextPage: boolean;
  gotoPage: (page: number) => void;
  setPageSize: (size: number) => void;
}

const PaginationComponent: React.FC<PaginationProps> = ({
  tableType,
  pageIndex,
  pageOptions,
  pageSize,
  canPreviousPage,
  canNextPage,
  gotoPage,
  setPageSize,
}) => {
  return (
    <Box mt={5} px={{ base: '4', md: '6' }} pb="5">
      <Grid templateColumns="repeat(3, 1fr)" gap={6} alignItems="center">
        <Box>
          <Text color="fg.muted" textStyle="sm">
            Showing Page <strong>{pageIndex + 1}</strong> of {pageOptions.length}
            {' '}| Go to page:
            <Input
              size="sm"
              type="number"
              defaultValue={pageIndex + 1}
              onChange={(e) => {
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
            size="sm"
            value={pageSize}
            onChange={(e) => setPageSize(Number(e.target.value))}
          >
            {[5, 10, 15, 20].map((size) => (
              <option key={size} value={size}>
                Show {size} {tableType}
              </option>
            ))}
          </Select>
        </Box>

        {/* Navigation Buttons */}
        <ButtonGroup spacing="3" justifySelf="end">
          <Button colorScheme="messenger" size="sm" onClick={() => gotoPage(pageIndex - 1)} isDisabled={!canPreviousPage}>
            Previous
          </Button>
          <Button colorScheme="messenger" size="sm" onClick={() => gotoPage(pageIndex + 1)} isDisabled={!canNextPage}>
            Next
          </Button>
        </ButtonGroup>
      </Grid>
    </Box>
  );
};

export default PaginationComponent;
