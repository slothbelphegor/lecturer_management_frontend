import { React, useMemo, useState, useEffect, useContext } from "react";
import { Link, useParams } from "react-router-dom";

import AxiosInstance from "../../components/AxiosInstance";

import { Box, IconButton, Typography, Grid } from "@mui/material";
import CalendarViewMonthIcon from "@mui/icons-material/CalendarViewMonth";
import EditIcon from "@mui/icons-material/Edit";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import MyButton from "../../components/forms/MyButton";
import DeleteIcon from "@mui/icons-material/Delete";
import { MaterialReactTable } from "material-react-table";
import { RoleContext } from "../../components/RoleContext";

const ListEvaluation = () => {
  const params = useParams();
  const lecturer_id = params.id;
  const [currentLecturer, setCurrentLecturer] = useState({});
  const [evaluations, setEvaluations] = useState([]);
  // const {role} = useContext(RoleContext);
  const role = localStorage.getItem("Role") || ""; 
  const getData = () => {
    AxiosInstance.get(`lecturers/${lecturer_id}/`).then((res) => {
      setCurrentLecturer(res.data);
      console.log(res.data);
    });
    AxiosInstance.get(`evaluations/by-lecturer/${lecturer_id}/`).then((res) => {
      setEvaluations(res.data);
      console.log(res.data);
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
      { console.log(evaluations)}
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
            Đánh giá giảng viên {currentLecturer.name}
          </Typography>
        </Box>
        {['it_faculty', 'supervision_department'].includes(role) && (
          <Box>
            <MyButton
              type="button"
              label="Thêm đánh giá"
              onClick={() => {
                window.location.href = `/lecturers/${lecturer_id}/evaluations/create`;
              }}
            />
          </Box>
        )}
        
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
        enableRowActions
        positionActionsColumn={'last'}
        renderRowActions={({ row }) => (
          <Box sx={{ display: "flex", flexWrap: "nowrap", gap: "8px" }}>
            <IconButton
              color="primary"
              component={Link}
              to={`/lecturers/${lecturer_id}/evaluations/edit/${row.original.id}`}
            >
              <EditIcon />
            </IconButton>
            <IconButton
              color="error"
              component={Link}
              to={`/lecturers/${lecturer_id}/evaluations/delete/${row.original.id}`}
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

export default ListEvaluation;
