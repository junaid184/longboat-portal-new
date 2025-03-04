import React, { useState, useEffect } from 'react';
import { DataGrid, GridToolbarQuickFilter } from '@mui/x-data-grid';
import Box from '@mui/material/Box';

export default function MuiGrid({ data, columns, clickHandler, autoHeight, rowsPerPage, checkboxSelection, onSelectionModelChange, loading = false, isChild = false }) {
  const [pageSize, setPageSize] = useState(10);
  const rowHeight = 50;
  const toolbarHeight = 60;
  const padding = 20; 
  const minHeight = 200; 

  function QuickSearchToolbar() {
      return (
          <Box sx={{ p: 1.5, pb: 0 }}>
              <GridToolbarQuickFilter />
          </Box>
      );
  }

  return (
      <Box
          sx={{
              height: '75vh',
              width: '100%', // Keep the width at 100%
              backgroundColor: 'white',
              borderRadius: '12px',
              boxShadow: '0px 0px 20px rgba(0, 0, 0, 0.2)',
              paddingTop: '32px',
          }}
      >
          <DataGrid
              rows={data}
              columns={columns}
              loading={loading}
              rowsPerPageOptions={[10, 50, 100]}
              pageSize={pageSize}
              onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
              getRowHeight={() => rowHeight}
              checkboxSelection
              disableRowSelectionOnClick
              onSelectionModelChange={onSelectionModelChange}
              components={{ Toolbar: QuickSearchToolbar }}
              sx={{
                  '& .MuiDataGrid-root': {
                      overflow: 'auto',
                  },
              }}
          />
      </Box>
  );
}