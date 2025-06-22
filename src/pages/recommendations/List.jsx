import { React, useMemo, useState, useEffect, useContext } from "react";
import { Link, useParams } from "react-router-dom";

import AxiosInstance from "../../components/AxiosInstance";

import { Box, IconButton, Typography, Grid } from "@mui/material";
import CalendarViewMonthIcon from "@mui/icons-material/CalendarViewMonth";
import InfoIcon from '@mui/icons-material/Info';
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import MyButton from "../../components/forms/MyButton";
import DeleteIcon from "@mui/icons-material/Delete";
import Chip from "@mui/material/Chip";
import { MaterialReactTable } from "material-react-table";
import { RoleContext } from "../../components/RoleContext";

const ListRecommendation = () => {
  const params = useParams();
  const lecturer_id = params.id;
  const [recommendations, setRecommendations] = useState([]);
  // const {role} = useContext(RoleContext);
  const role = localStorage.getItem("Role") || ""; 
  const getData = () => {
    AxiosInstance.get(`recommendations/`).then((res) => {
      setRecommendations(res.data);
      console.log(res.data);
    });
  };

  useEffect(() => {
    getData();
  }, []); // get data on initial load page

  const columns = useMemo(
    () => [
      {
        accessorKey: "name",
        header: "Họ tên",
        size: 180,
      },
      {
        accessorKey: "workplace",
        header: "Nơi công tác ",
        size: 40,
      },
      {
        accessorKey: "recommender_details.name",
        header: "Người đề xuất",

      },
      {
        accessorKey: "subject_names",
        header: "Môn học",
        Cell: ({ cell }) => (
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
            {cell.getValue()?.map((char, index) => (
              <Chip key={index} label={char} />
            ))}
          </div>
        ),
      },
      {
        accessorKey: "status",
        header: "Trạng thái",
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
            Đề xuất giảng viên
          </Typography>
        </Box>
        
        
      </Box>

      <MaterialReactTable
      
        columns={columns}
        data={recommendations} // Nạp dữ liệu vào bảng
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
              {"Mô tả giảng viên:"}
            </Typography>
            <Typography variant="body2">
              {row.original.content}
            </Typography>
          </Box>
        )}
        enableRowActions
        positionActionsColumn={'last'}
        renderRowActions={({ row }) => (
          <Box sx={{ display: "flex", flexWrap: "nowrap", gap: "8px" }}>
            <IconButton
              color="primary"
              component={Link}
              to={`/recommendations/edit/${row.original.id}`}
            >
              <InfoIcon />
            </IconButton>
            <IconButton
              color="error"
              component={Link}
              to={`/recommendations/delete/${row.original.id}`}
            >
              <DeleteIcon />
            </IconButton>
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

export default ListRecommendation;
