import React, { useState } from "react";
import { DataGrid, GridToolbarQuickFilter } from "@mui/x-data-grid";
import Box from "@mui/material/Box";

export default function MuiGridDynamic({
  rows = [],
  columns = [],
  loading = false,
  checkboxSelection = true,
  disableSelectionOnClick = true,
  pageSizeOptions = [10, 50, 100],
  initialPageSize = 10,
  totalCount = 0,
  paginationMode = "server",
  onPageChange,
  onPageSizeChange,
  onSelectionModelChange,
  autoHeight = false,
  height = "72vh",
}) {
  const [pageSize, setPageSize] = useState(initialPageSize);

  // Quick search toolbar component
  function QuickSearchToolbar() {
    return (
      <Box sx={{ p: 1.5, pt:3, pb: 0 }}>
        <GridToolbarQuickFilter />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        height: height,
        width: "100%",
        backgroundColor: "white",
        borderRadius: "12px",
        boxShadow: "0px 0px 20px rgba(0, 0, 0, 0.2)",
        padding: "16px",
      }}
    >
      <DataGrid
        rows={rows}
        columns={columns}
        loading={loading}
        checkboxSelection={checkboxSelection}
        disableSelectionOnClick={disableSelectionOnClick}
        rowsPerPageOptions={pageSizeOptions}
        pageSize={pageSize}
        onPageSizeChange={(newPageSize) => {
          setPageSize(newPageSize);
          if (onPageSizeChange) onPageSizeChange(newPageSize);
        }}
        paginationMode={paginationMode}
        onPageChange={onPageChange}
        rowCount={totalCount}
        components={{ Toolbar: QuickSearchToolbar }}
        autoHeight={autoHeight}
        onSelectionModelChange={onSelectionModelChange}
        sx={{
          "& .MuiDataGrid-root": {
            overflow: "auto",
          },
        }}
      />
    </Box>
  );
}
