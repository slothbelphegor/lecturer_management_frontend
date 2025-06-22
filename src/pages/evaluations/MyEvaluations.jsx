import { React, useMemo, useState, useEffect } from "react";

import AxiosInstance from "../../components/AxiosInstance";

import { Box, IconButton, Typography, Grid } from "@mui/material";
import CalendarViewMonthIcon from "@mui/icons-material/CalendarViewMonth";
import { MaterialReactTable } from "material-react-table";

const MyEvaluations = () => {
  const [evaluations, setEvaluations] = useState([]);

  const getData = () => {
    AxiosInstance.get(`evaluations/me/`).then((res) => {
      setEvaluations(res.data);
      console.log(res);
    }).catch((error) => {
        console.log(error)
    });
  };

  useEffect(() => {
    getData();
  }, []); // get data on initial load page

  const columns = useMemo(
    () => [
      {
        accessorKey: "title",
        header: "Tiêu đề",
        size: 180,
      },
      {
        accessorKey: "date",
        header: "Ngày đánh giá",
        size: 40,
      },
      {
        accessorKey: "type",
        header: "Loại đánh giá",
        size: 40,
      },
    
    ],
    []
  );
  return (
    <div>
      <Box className="topbar" sx={{
        display: "flex",
        justifyContent: "space-between",
      }}>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <CalendarViewMonthIcon />
          <Typography
            sx={{ marginLeft: "15px", fontWeight: "bold" }}
            variant="subtitle2"
          >
            Đánh giá giảng viên
          </Typography>
        </Box>
        

      </Box>

      <MaterialReactTable
      
        columns={columns}
        data={evaluations}
        // columns shrink to fit the screen

        initialState={{
          density: "compact", // Kích thước compact 
          columnVisibility: {
          },
        }}
        enableColumnActions={false}
        enableColumnFilters={true}
        enablePagination={true}
        enableSorting={true}
        
        enableExpanding
        renderDetailPanel={({ row }) => (
          <Box sx={{ padding: 2 }}>
            <Typography variant="h6" gutterBottom>
              {row.original.title || "N/A"}
            </Typography>
            <Typography variant="body2">
              {row.original.content || "N/A"}
            </Typography>
          </Box>
        )}

        getRowId={(row) => row.id} // Giả định document có trường 'id' duy nhất
        displayColumnDefOptions={{
          
          "mrt-row-expand": {
            Header: "", // Ẩn header
            size: 10, // Kích thước cột
            enableResizing: false,
            enableColumnActions: false,
            position: "last", // Đặt nút collapse ở đầu hàng
          },
          "mrt-row-actions": {
            // Cột actions
            Header: "", // Tùy chọn - thêm tiêu đề nếu muốn
            position: "last", // Luôn đặt ở cuối bảng
            size: 30, // Kích thước cột
          },
        }}
        muiTableBodyRowProps={{
          sx: {
            "&:hover td": {
              backgroundColor: "#f5f5f5",
            },
          },
        }}
        muiTablePaperProps={{
          sx: {
            boxShadow: "none",
            border: "1px solid #e0e0e0",
          },
        }}
        
        
      />
    </div>
  );
};

export default MyEvaluations;
